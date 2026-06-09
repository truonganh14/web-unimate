import 'dotenv/config';
import { spawn } from 'child_process';
import ngrok from '@ngrok/ngrok';

const port = Number(process.argv[2] || process.env.PORT || 5000);
const label = process.argv[3] || (port === 5173 ? 'web' : 'api');

function startCliTunnel() {
  console.log(`[ngrok:${label}] Dùng ngrok CLI → http://localhost:${port}`);
  console.log('[ngrok] Xem URL public tại http://127.0.0.1:4040');
  console.log('[ngrok] Nhấn Ctrl+C để dừng tunnel.\n');

  const child = spawn('ngrok', ['http', String(port), '--log=stdout'], {
    stdio: 'inherit',
    shell: true,
  });

  child.on('exit', (code) => process.exit(code ?? 0));
}

if (!process.env.NGROK_AUTHTOKEN) {
  console.log('Chưa có NGROK_AUTHTOKEN trong .env — thử dùng ngrok CLI...\n');
  startCliTunnel();
  process.stdin.resume();
} else {
  try {
    const listener = await ngrok.forward({
      addr: port,
      authtoken: process.env.NGROK_AUTHTOKEN,
    });

    console.log('');
    console.log(`[ngrok:${label}] Public URL: ${listener.url()}`);
    console.log(`[ngrok:${label}] Forwarding -> http://localhost:${port}`);
    console.log('[ngrok] Nhấn Ctrl+C để dừng tunnel.');
    console.log('');

    process.stdin.resume();
  } catch (error) {
    console.error('SDK ngrok lỗi:', error.message);
    console.log('Thử fallback sang ngrok CLI...\n');
    startCliTunnel();
    process.stdin.resume();
  }
}
