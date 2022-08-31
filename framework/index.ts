import 'reflect-metadata';
import { register } from 'tsconfig-paths';
import { ArtusApplication, Scanner } from '@artus/core';
register();

interface AppOption {
  baseDir?: string;
}

export async function startApp(options: AppOption = {}) {
  const baseDir = options.baseDir || process.cwd();
  const scanner = new Scanner({
    needWriteFile: false,
    configDir: 'config',
    extensions: [ '.ts' ],
  });

  const manifest = await scanner.scan(baseDir);
  const app = new ArtusApplication();
  await app.load(manifest.default, baseDir);
  await app.run();
}
