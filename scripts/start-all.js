import { spawn } from 'child_process';

console.log('===================================================');
console.log('  Starting MegaTrix Core Admin Backend & Frontend  ');
console.log('===================================================');

// 1. Spawn Backend Express API on Port 5002
const serverProcess = spawn('node', ['server/index.js'], {
  stdio: 'inherit',
  shell: true,
});

// 2. Spawn Vite Frontend on Port 5175
const viteProcess = spawn('npx', ['vite', '--port', '5175'], {
  stdio: 'inherit',
  shell: true,
});

const handleExit = () => {
  serverProcess.kill();
  viteProcess.kill();
  process.exit();
};

process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);
