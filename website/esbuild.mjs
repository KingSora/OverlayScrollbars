import glob from 'fast-glob';
import { esbuild } from '@~local/esbuild';

const processArgs = process.argv.slice(2);
const watch = processArgs.includes('-w');
const minify = processArgs.includes('-p');
const define = {};

await esbuild({
  entryPoints: glob.sync('./src/**/*.{ts,tsx,js,jsx,md,mdx}'),
  outdir: './next-app/src',
  outbase: 'src',
  platform: 'node',
  loader: {
    '.aac': 'copy',
    '.avif': 'copy',
    '.css': 'copy',
    '.scss': 'copy',
    '.eot': 'copy',
    '.flac': 'copy',
    '.gif': 'copy',
    '.gql': 'text',
    '.graphql': 'text',
    '.ico': 'copy',
    '.jpeg': 'copy',
    '.jpg': 'copy',
    '.md': 'copy',
    '.mdx': 'copy',
    '.mp3': 'copy',
    '.mp4': 'copy',
    '.ogg': 'copy',
    '.otf': 'copy',
    '.png': 'copy',
    '.sql': 'text',
    '.svg': 'copy',
    '.ttf': 'copy',
    '.wav': 'copy',
    '.webm': 'copy',
    '.webmanifest': 'copy',
    '.webp': 'copy',
    '.woff': 'copy',
    '.woff2': 'copy',
    '.zip': 'copy',
  },
  minify,
  define,
  watch,
});
