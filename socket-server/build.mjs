import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['./socket-server/socket.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: './socket-server/dist/socket.js',
  external: [
    'socket.io',
    'mongoose',
    'bcrypt',
    'nodemailer',
    'dotenv'
  ],
  format: 'esm',
  sourcemap: true,
  minify: false,
  logLevel: 'info',
}).then(() => {
  console.log('✅ Socket server built successfully!');
}).catch(() => {
  console.error('❌ Build failed');
  process.exit(1);
});