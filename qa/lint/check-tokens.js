import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '../..');
const TOKENS_PATH = path.join(ROOT_DIR, 'src/design/tokens.json');
const LAW_PATH = path.join(ROOT_DIR, 'qa/design-law.json');
const TAILWIND_PATH = path.join(ROOT_DIR, 'tailwind.config.js');

function formatTimestamp() {
  const d = new Date();
  return d.toTimeString().split(' ')[0];
}

function logStep(step, total, message, status) {
  const stepStr = String(step).padStart(2, '0');
  const totalStr = String(total).padStart(2, '0');
  const time = formatTimestamp();
  console.log(`[MX-QA] [${stepStr}/${totalStr}] [${time}] > ${message} ... ${status}`);
}

function runTokenCheck() {
  console.log('==============================================================');
  console.log(' MegaTrix Design QA - Token Verification Engine');
  console.log('==============================================================');

  let step = 1;
  const totalSteps = 4;
  let errors = [];

  // 1. Verify tokens.json exists and parse schema
  try {
    if (!fs.existsSync(TOKENS_PATH)) {
      throw new Error(`tokens.json missing at ${TOKENS_PATH}`);
    }
    const tokens = JSON.parse(fs.readFileSync(TOKENS_PATH, 'utf-8'));
    
    const requiredColors = ['bg', 'surface', 'panel', 'border', 'border-hi', 'text', 'text-mid', 'text-low', 'accent', 'cta-bg', 'cta-fg'];
    for (const key of requiredColors) {
      if (!tokens.color?.[key]) {
        errors.push(`Missing required token color: ${key}`);
      }
    }

    const requiredFonts = ['display', 'ui', 'mono'];
    for (const key of requiredFonts) {
      if (!tokens.font?.[key]) {
        errors.push(`Missing required font definition: ${key}`);
      }
    }

    if (!Array.isArray(tokens.radius) || tokens.radius.length === 0) {
      errors.push('tokens.radius must be a non-empty array');
    }
    if (!Array.isArray(tokens.fontSize) || tokens.fontSize.length === 0) {
      errors.push('tokens.fontSize must be a non-empty array');
    }

    if (errors.length === 0) {
      logStep(step++, totalSteps, 'Token schema integrity & color keys', 'PASS');
    } else {
      logStep(step++, totalSteps, `Token schema integrity (${errors.length} errors)`, 'FAIL');
    }
  } catch (err) {
    errors.push(err.message);
    logStep(step++, totalSteps, 'Token schema integrity', `FAIL (${err.message})`);
  }

  // 2. Verify design-law.json exists and links to tokens
  try {
    if (!fs.existsSync(LAW_PATH)) {
      throw new Error(`design-law.json missing at ${LAW_PATH}`);
    }
    const law = JSON.parse(fs.readFileSync(LAW_PATH, 'utf-8'));
    if (!law.surfaces || !law.accentBudget || !law.badges || !law.icons || !law.typography) {
      errors.push('design-law.json is missing core rule sections');
      logStep(step++, totalSteps, 'Design Law specification completeness', 'FAIL');
    } else {
      logStep(step++, totalSteps, 'Design Law specification completeness', 'PASS');
    }
  } catch (err) {
    errors.push(err.message);
    logStep(step++, totalSteps, 'Design Law specification completeness', `FAIL (${err.message})`);
  }

  // 3. Verify Tailwind config locks to tokens
  try {
    const tailwindContent = fs.readFileSync(TAILWIND_PATH, 'utf-8');
    if (!tailwindContent.includes('tokens.json')) {
      errors.push('tailwind.config.js does not import tokens.json');
      logStep(step++, totalSteps, 'Tailwind theme token binding', 'FAIL');
    } else {
      logStep(step++, totalSteps, 'Tailwind theme token binding', 'PASS');
    }
  } catch (err) {
    errors.push(err.message);
    logStep(step++, totalSteps, 'Tailwind theme token binding', `FAIL (${err.message})`);
  }

  // 4. Summary & exit code
  if (errors.length === 0) {
    logStep(step, totalSteps, 'Final token validation result', 'PASS (0 violations)');
    console.log('--------------------------------------------------------------');
    console.log(' All token checks passed. Tokens locked successfully.');
    console.log('==============================================================\n');
    process.exit(0);
  } else {
    logStep(step, totalSteps, 'Final token validation result', `FAIL (${errors.length} violations)`);
    console.log('--------------------------------------------------------------');
    errors.forEach(e => console.error(` [ERROR] ${e}`));
    console.log('==============================================================\n');
    process.exit(1);
  }
}

runTokenCheck();
