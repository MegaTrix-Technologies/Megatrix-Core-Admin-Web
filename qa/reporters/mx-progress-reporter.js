import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '../..');
const STATUS_PATH = path.join(ROOT_DIR, 'qa/reports/LIVE_STATUS.json');
const PROGRESS_PATH = path.join(ROOT_DIR, 'qa/reports/PROGRESS.md');

function formatTimestamp() {
  return new Date().toTimeString().split(' ')[0];
}

class MxProgressReporter {
  constructor() {
    this.testCount = 0;
    this.totalTests = 0;
    this.passed = 0;
    this.failed = 0;
    this.skipped = 0;
    this.failures = [];
    this.heartbeat = null;
  }

  onBegin(config, suite) {
    this.totalTests = suite.allTests().length;
    console.log('\n==============================================================');
    console.log(' MegaTrix Design QA - Playwright Behaviour & E2E Suite');
    console.log(` Total tests scheduled: ${this.totalTests}`);
    console.log('==============================================================');

    this.heartbeat = setInterval(() => {
      const time = formatTimestamp();
      console.log(`[MX-QA] [--/--] [${time}] ... heartbeat: playwright worker executing`);
    }, 8000);
  }

  onTestBegin(test) {
    this.testCount++;
    const stepStr = String(this.testCount).padStart(2, '0');
    const totalStr = String(this.totalTests).padStart(2, '0');
    const time = formatTimestamp();
    const title = test.title;
    const project = test.parent?.project()?.name || 'default';
    console.log(`[MX-QA] [${stepStr}/${totalStr}] [${time}] > [${project}] ${title} ... RUNNING`);

    this.updateStatus({
      phase: 'playwright',
      step: this.testCount,
      total: this.totalTests,
      current: `[${project}] ${title}`,
      updatedAt: new Date().toISOString()
    });
  }

  onTestEnd(test, result) {
    const stepStr = String(this.testCount).padStart(2, '0');
    const totalStr = String(this.totalTests).padStart(2, '0');
    const time = formatTimestamp();
    const title = test.title;
    const project = test.parent?.project()?.name || 'default';

    if (result.status === 'passed') {
      this.passed++;
      console.log(`[MX-QA] [${stepStr}/${totalStr}] [${time}] > [${project}] ${title} ... PASS`);
    } else if (result.status === 'skipped') {
      this.skipped++;
      console.log(`[MX-QA] [${stepStr}/${totalStr}] [${time}] > [${project}] ${title} ... SKIP`);
    } else {
      this.failed++;
      const err = result.error?.message?.split('\n')[0] || 'Unknown error';
      this.failures.push({ test: title, project, error: err });
      console.log(`[MX-QA] [${stepStr}/${totalStr}] [${time}] > [${project}] ${title} ... FAIL (${err})`);
    }

    this.updateStatus({
      phase: 'playwright',
      step: this.testCount,
      total: this.totalTests,
      current: `[${project}] ${title}`,
      passed: this.passed,
      failed: this.failed,
      skipped: this.skipped,
      updatedAt: new Date().toISOString()
    });
  }

  onEnd(result) {
    if (this.heartbeat) clearInterval(this.heartbeat);

    console.log('\n--------------------------------------------------------------');
    console.log(' Playwright Execution Summary');
    console.log(` Total: ${this.totalTests} | Passed: ${this.passed} | Failed: ${this.failed} | Skipped: ${this.skipped}`);
    if (this.failures.length > 0) {
      console.log(' Failures recorded:');
      this.failures.forEach(f => console.log(`   - [${f.project}] ${f.test}: ${f.error}`));
    }
    console.log('==============================================================\n');
  }

  updateStatus(data) {
    try {
      let existing = {};
      if (fs.existsSync(STATUS_PATH)) {
        try { existing = JSON.parse(fs.readFileSync(STATUS_PATH, 'utf-8')); } catch {}
      }
      const merged = { ...existing, ...data };
      if (!fs.existsSync(path.dirname(STATUS_PATH))) {
        fs.mkdirSync(path.dirname(STATUS_PATH), { recursive: true });
      }
      fs.writeFileSync(STATUS_PATH, JSON.stringify(merged, null, 2));

      // Append to PROGRESS.md
      let md = '';
      if (fs.existsSync(PROGRESS_PATH)) {
        md = fs.readFileSync(PROGRESS_PATH, 'utf-8');
      }
      if (!md.includes('## Playwright E2E Suite')) {
        md += '\n## Playwright E2E Suite\n\n';
      }
      md += `- [${data.failed > 0 ? ' ' : 'x'}] Step ${data.step}/${data.total}: ${data.current} (${new Date().toLocaleTimeString()})\n`;
      fs.writeFileSync(PROGRESS_PATH, md);
    } catch {}
  }
}

export default MxProgressReporter;
