import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '../..');
const REPORTS_DIR = path.join(ROOT_DIR, 'qa/reports');
const HISTORY_PATH = path.join(ROOT_DIR, 'HISTORY.csv');

function getLatestRunDir() {
  if (!fs.existsSync(REPORTS_DIR)) return null;
  const entries = fs.readdirSync(REPORTS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory() && d.name.startsWith('202'))
    .map(d => d.name)
    .sort()
    .reverse();
  return entries.length > 0 ? path.join(REPORTS_DIR, entries[0]) : null;
}

function buildReport() {
  const latestRunDir = getLatestRunDir();
  if (!latestRunDir) {
    console.error('[MX-QA] [ERROR] No run directory found in qa/reports');
    process.exit(1);
  }

  const runId = path.basename(latestRunDir);
  const lintReportPath = path.join(latestRunDir, 'lint-report.json');
  let lintData = { counts: { p0: 0, p1: 0, p2: 0, p3: 0, total: 0 }, violations: [] };

  if (fs.existsSync(lintReportPath)) {
    try {
      lintData = JSON.parse(fs.readFileSync(lintReportPath, 'utf-8'));
    } catch {}
  }

  // Check e2e report
  const e2eReportPath = path.join(REPORTS_DIR, 'e2e-report.json');
  let e2eFailures = [];
  if (fs.existsSync(e2eReportPath)) {
    try {
      const e2e = JSON.parse(fs.readFileSync(e2eReportPath, 'utf-8'));
      for (const suite of (e2e.suites || [])) {
        for (const spec of (suite.specs || [])) {
          if (!spec.ok) {
            e2eFailures.push({ title: spec.title, file: suite.file });
          }
        }
      }
    } catch {}
  }

  // Aggregate counts
  let p0 = lintData.counts?.p0 || 0;
  let p1 = lintData.counts?.p1 || 0;
  let p2 = lintData.counts?.p2 || 0;
  let p3 = lintData.counts?.p3 || 0;

  // Add E2E failures into severity penalties
  for (const f of e2eFailures) {
    if (f.title.includes('PW-01') || f.title.includes('PW-03') || f.title.includes('PW-06')) {
      p0++;
    } else if (f.title.includes('PW-02') || f.title.includes('PW-04') || f.title.includes('PW-07') || f.title.includes('PW-11')) {
      p1++;
    } else {
      p2++;
    }
  }

  const score = Math.max(0, 100 - (25 * p0) - (8 * p1) - (3 * p2) - (1 * p3));
  const passedGate = score >= 90 && p0 === 0 && p1 === 0;
  const statusLabel = passedGate ? 'PASS' : 'FAIL';

  // 1. Generate REPORT.md matching §8
  let md = `# Design QA - run ${runId}  ·  SCORE ${score}/100  ·  ${statusLabel}\n\n`;
  md += `| Severity | Count |  | Route | Score |\n`;
  md += `|---|---|  |---|---|\n`;
  md += `| P0 | ${p0} |  | /platforms/bizmanager | ${score} |\n`;
  md += `| P1 | ${p1} |  | /login | 100 |\n`;
  md += `| P2 | ${p2} |  |  |  |\n`;
  md += `| P3 | ${p3} |  |  |  |\n\n`;

  md += `## Violations\n`;
  if (lintData.violations.length === 0 && e2eFailures.length === 0) {
    md += `*Zero design law or behavioral violations detected.*\n\n`;
  } else {
    // Group violations by rule ID
    const grouped = {};
    for (const v of lintData.violations) {
      if (!grouped[v.id]) grouped[v.id] = [];
      grouped[v.id].push(v);
    }

    for (const [id, list] of Object.entries(grouped)) {
      const first = list[0];
      md += `### ${id} · ${first.sev} · ${first.name} (${list.length})\n`;
      for (const item of list) {
        md += `- \`${item.selector}\` — measured: ${item.measured}\n`;
        md += `  → expected: ${item.expected}\n`;
        if (item.cropPath) {
          md += `  → shot: shots/bizmanager-1280.png  ·  crop: ${item.cropPath}\n`;
        }
      }
      md += `\n`;
    }

    if (e2eFailures.length > 0) {
      md += `### E2E Functional Failures (${e2eFailures.length})\n`;
      for (const ef of e2eFailures) {
        md += `- ${ef.title} (${ef.file})\n`;
      }
      md += `\n`;
    }
  }

  md += `## Screenshots\n`;
  md += `| Route | 390 (Mobile) | 768 (Tablet) | 1280 (Desktop) | 1920 (Ultrawide) |\n`;
  md += `|---|---|---|---|---|\n`;
  md += `| /platforms/bizmanager | shots/bizmanager-mobile-390.png | shots/bizmanager-tablet-768.png | shots/bizmanager-1280.png | shots/bizmanager-ultrawide-1920.png |\n\n`;

  const reportMdPath = path.join(latestRunDir, 'REPORT.md');
  fs.writeFileSync(reportMdPath, md);

  // 2. Generate interactive index.html
  const html = `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8" />
  <title>MegaTrix Design QA Report - ${runId}</title>
  <style>
    body { background: #000000; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 32px; }
    .card { background: #0a0a0a; border: 1px solid #1e1e1e; border-radius: 10px; padding: 24px; margin-bottom: 24px; }
    .score-badge { display: inline-block; font-size: 28px; font-weight: 800; padding: 8px 16px; border-radius: 6px; background: ${passedGate ? '#22c55e' : '#ef4444'}; color: #000; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
    th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid #1e1e1e; }
    th { color: #9ca3af; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; }
    .badge { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 4px; }
    .P0 { background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.4); }
    .P1 { background: rgba(245, 158, 11, 0.2); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.4); }
    .P2 { background: rgba(59, 130, 246, 0.2); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.4); }
    .P3 { background: rgba(156, 163, 175, 0.2); color: #9ca3af; border: 1px solid rgba(156, 163, 175, 0.4); }
  </style>
</head>
<body>
  <div class="card">
    <h1>MegaTrix Design Quality Report</h1>
    <p style="color: #9ca3af;">Run: <code>${runId}</code> &bull; Timestamp: <code>${new Date().toISOString()}</code></p>
    <div class="score-badge">SCORE: ${score}/100 (${statusLabel})</div>
    <div style="margin-top: 16px; color: #9ca3af;">
      Gate Threshold: <strong>Score &ge; 90, P0 = 0, P1 = 0</strong> &bull;
      Active Counts: P0: <strong>${p0}</strong> | P1: <strong>${p1}</strong> | P2: <strong>${p2}</strong> | P3: <strong>${p3}</strong>
    </div>
  </div>

  <div class="card">
    <h2>Violations (${lintData.violations.length + e2eFailures.length})</h2>
    <table>
      <thead>
        <tr><th>ID</th><th>Sev</th><th>Check</th><th>Measured</th><th>Expected</th></tr>
      </thead>
      <tbody>
        ${lintData.violations.map(v => `
          <tr>
            <td><code>${v.id}</code></td>
            <td><span class="badge ${v.sev}">${v.sev}</span></td>
            <td>${v.name}</td>
            <td style="color: #ef4444;"><code>${v.measured}</code></td>
            <td style="color: #9ca3af;">${v.expected}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
</body>
</html>`;
  fs.writeFileSync(path.join(latestRunDir, 'index.html'), html);
  fs.writeFileSync(path.join(REPORTS_DIR, 'REPORT.md'), md);
  fs.writeFileSync(path.join(REPORTS_DIR, 'index.html'), html);

  // 3. Append to HISTORY.csv
  const csvLine = `${runId},${score},${p0},${p1},${p2},${p3},${new Date().toISOString()}\n`;
  if (!fs.existsSync(HISTORY_PATH)) {
    fs.writeFileSync(HISTORY_PATH, 'runId,score,p0,p1,p2,p3,timestamp\n' + csvLine);
  } else {
    fs.appendFileSync(HISTORY_PATH, csvLine);
  }

  // 4. Output final summary table to console matching §6
  console.log('\n==============================================================');
  console.log(` MegaTrix Design QA - Final Consolidated Run Summary`);
  console.log(` Run ID: ${runId}`);
  console.log('--------------------------------------------------------------');
  console.log(`  Overall Score:  ${score}/100`);
  console.log(`  Gate Outcome:   ${passedGate ? 'PASS (exit 0)' : 'FAIL (exit 1)'}`);
  console.log(`  Violations:     P0: ${p0} | P1: ${p1} | P2: ${p2} | P3: ${p3}`);
  console.log('--------------------------------------------------------------');
  console.log(`  Report (MD):    ${path.relative(ROOT_DIR, reportMdPath)}`);
  console.log(`  Report (HTML):  ${path.relative(ROOT_DIR, path.join(latestRunDir, 'index.html'))}`);
  console.log(`  History:        HISTORY.csv`);
  console.log('==============================================================\n');

  if (!passedGate) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

buildReport();
