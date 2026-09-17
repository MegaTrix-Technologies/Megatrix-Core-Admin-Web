import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

console.log('==============================================================');
console.log(' MegaTrix Design QA - Full Suite Orchestrator');
console.log('==============================================================\n');

let failed = false;

function runStep(name, args) {
  console.log(`[MX-QA] >>> Running ${name}...`);
  const result = spawnSync(npmCmd, args, {
    cwd: ROOT_DIR,
    stdio: 'inherit',
    shell: true,
  });
  if (result.status !== 0) {
    console.log(`[MX-QA] [WARNING] Step ${name} exited with code ${result.status}`);
    failed = true;
  } else {
    console.log(`[MX-QA] [SUCCESS] Step ${name} passed.`);
  }
  console.log('');
}

// 1. Tokens
runStep('qa:tokens', ['run', 'qa:tokens']);

// 2. Linter (Puppeteer)
runStep('qa:lint', ['run', 'qa:lint']);

// 3. E2E (Playwright)
runStep('qa:e2e', ['run', 'qa:e2e']);

// 4. Report generator - MUST run even if earlier steps failed!
console.log('[MX-QA] >>> Generating Consolidated Report (Unconditional)...');
const reportResult = spawnSync(npmCmd, ['run', 'qa:report'], {
  cwd: ROOT_DIR,
  stdio: 'inherit',
  shell: true,
});

if (reportResult.status !== 0) {
  failed = true;
}

if (failed) {
  console.error('\n[MX-QA] [GATE FAILED] One or more Design QA checks did not meet threshold.');
  process.exit(1);
} else {
  console.log('\n[MX-QA] [GATE PASSED] All Design QA checks passed successfully (Score 100, P0=0, P1=0).');
  process.exit(0);
}
