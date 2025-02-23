import fsPromises from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { spawn } from 'child_process';

const processArgs = process.argv;
const deployDocs = processArgs.includes('--docs');
const deployExamples = processArgs.includes('--examples');

const run = async (command, args, options) => {
  const process = spawn(command, args, {
    ...options,
    stdio: 'inherit',
    shell: true,
  });
  return new Promise((resolvePromise, rejectPromise) => {
    process.on('error', () => {
      rejectPromise();
    });
    process.on('exit', () => {
      resolvePromise();
    });
  });
};

const fileDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(fileDir, '..');
const docsDir = resolve(rootDir, 'docs');
const docsExampleDir = resolve(docsDir, 'example');

if (deployDocs && !deployExamples) {
  await run('npm', ['run build:os'], { cwd: rootDir });
} else {
  await run('npm', ['run build'], { cwd: rootDir });
}

if (deployDocs) {
  await run('npm', ['install']);
  await run('npm', ['run build']);

  const nextJsDistDir = resolve(fileDir, 'dist');
  const nextJsDistDirItems = await fsPromises.readdir(nextJsDistDir);
  await Promise.all(
    nextJsDistDirItems.map((name) =>
      fsPromises.rm(resolve(docsDir, name), { recursive: true, force: true })
    )
  );
  await Promise.all(
    nextJsDistDirItems.map((name) =>
      fsPromises.cp(resolve(nextJsDistDir, name), resolve(docsDir, name), { recursive: true })
    )
  );
}

const examplesMap = {
  overlayscrollbars: {
    cwd: 'examples/overlayscrollbars',
    folder: 'dist',
  },
  react: {
    cwd: 'examples/react',
    folder: 'dist',
  },
  vue: {
    cwd: 'examples/vue',
    folder: 'dist',
  },
  angular: {
    cwd: 'examples/angular',
    folder: 'dist',
  },
  solid: {
    cwd: 'examples/solid',
    folder: 'dist',
  },
  svelte: {
    cwd: 'examples/svelte',
    folder: 'dist',
  },
};

if (deployExamples) {
  await fsPromises.rm(docsExampleDir, { recursive: true, force: true });
  await Promise.all(
    Object.entries(examplesMap).map(([name, info]) =>
      (async () => {
        const cwd = resolve(rootDir, info.cwd);
        const sourceBuildDir = resolve(cwd, info.folder);
        const targetBuildDir = resolve(docsExampleDir, name);

        await Promise.all([
          fsPromises.rm(sourceBuildDir, { recursive: true, force: true }),
          fsPromises.mkdir(targetBuildDir, { recursive: true }),
          run('npm', ['install'], {
            cwd,
          }),
        ]);
        await Promise.all([
          run('npm', ['run build'], {
            cwd,
          }),
          fsPromises.mkdir(docsExampleDir, {
            recursive: true,
          }),
        ]);
        await fsPromises.cp(sourceBuildDir, targetBuildDir, {
          recursive: true,
        });
      })()
    )
  );
}
