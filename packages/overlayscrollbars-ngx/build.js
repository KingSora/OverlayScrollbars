const packageName = 'overlayscrollbars-ngx';
const rollupUmdName = 'OverlayScrollbarsNgx';
const filesInfo = {
    fileName: packageName,
    srcFolder: './src',
    distFolder: './dist',
    typingsFolder: './dist/types',
    exampleFolder: './example',
    ngcFolder: './ngc',
    tsconfigJsonPath: './tsconfig.json',
    packageJsonPath: './package.json',
    cache: [
        './ngc'
    ]
}
const packagePaths = {
    main: `${filesInfo.distFolder}/${filesInfo.fileName}.js`,
    module: `${filesInfo.distFolder}/${filesInfo.fileName}.esm.js`,
    typings: `${filesInfo.typingsFolder}/index.d.ts`
}
const rollupUmdGlobals = {
    '@angular/core': 'ng.core',
    'rxjs': 'rxjs',
    'overlayscrollbars': 'OverlayScrollbars'
};

const packageJson = require(filesInfo.packageJsonPath);
const tsconfigJson = require(filesInfo.tsconfigJsonPath);

const path = require('path');
const sh = require('shelljs');
const chalk = require('chalk');
const gulp = require('gulp');
const rollup = require('rollup');
const rollupCommonJs = require('rollup-plugin-commonjs');
const rollupTypeScript = require('rollup-plugin-typescript2');
const rollupResolve = require('rollup-plugin-node-resolve');
const rollupInputConfig = {
    input: `${filesInfo.ngcFolder}/${filesInfo.srcFolder}/index.js`,
    external: [...Object.keys(packageJson.devDependencies), ...Object.keys(packageJson.peerDependencies)],
    plugins: [
        rollupResolve(),
        rollupCommonJs()
    ]
};
const rollupOutputConfig = {
    exports: 'named',
    sourcemap: true
};




sh.echo(chalk.cyanBright('Start building:'));

gulp.task('prepare', function (done) {
    sh.echo(`> Removing ${filesInfo.distFolder}`);
    sh.rm('-rf', filesInfo.distFolder);
    done();
});

gulp.task('ngc', function (done) {
    sh.echo('> Compile with "ngc"');

    // aot compile .metadata.json: https://github.com/ng-packagr/ng-packagr/blob/master/docs/DESIGN.md#build-artefacts
    /*
     * make sure metadata.json origins paths are correct, to do that
     * create a aotEntry dummy file which for that purpose
    */
    let aotEntryFile = `${filesInfo.typingsFolder}/index.ts`;
    let srcEntryFile = `${filesInfo.srcFolder}/index.ts`;
    let aotImportPath = path.relative(path.dirname(path.resolve(aotEntryFile)), path.dirname(path.resolve(srcEntryFile)));
    sh.mkdir('-p', path.dirname(aotEntryFile));
    sh.ShellString(`export * from '${aotImportPath.split(path.sep).join('/')}/index'`).to(aotEntryFile);

    let newTsconfigJson = {
        ...tsconfigJson,
        // https://github.com/angular/angular/blob/master/packages/compiler-cli/src/transformers/api.ts#L40
        angularCompilerOptions: {
            ...tsconfigJson.angularCompilerOptions,
            skipMetadataEmit: false,
            strictMetadataEmit: true,
            fullTemplateTypeCheck: true,
            flatModuleOutFile: `${packageName}.js`,
            flatModuleId: packageName
        },
        compilerOptions: {
            ...tsconfigJson.compilerOptions,
            declarationDir: filesInfo.ngcFolder,
            outDir: filesInfo.ngcFolder,
        },
        files: [aotEntryFile],
        include: undefined,
        exclude: [filesInfo.distFolder, filesInfo.exampleFolder, 'node_modules']
    };
    sh.ShellString(JSON.stringify(newTsconfigJson, null, 4)).to(filesInfo.tsconfigJsonPath);
    sh.exec('npx ngc -p tsconfig.json');
    
    // delete the aotEntry dummy file 
    sh.rm('-f', aotEntryFile);

    // rename and move metadata.json to correct folder
    let aotMetadataJsonPath = path.normalize(`${filesInfo.ngcFolder}/${filesInfo.typingsFolder}/${packageName}.metadata.json`);
    let aotMetadataJsonPathNew = path.normalize(`${filesInfo.typingsFolder}/index.metadata.json`);
    if (sh.test('-f', aotMetadataJsonPath)) {
        sh.echo(chalk.yellowBright('  [metadata.json]: ') + chalk.greenBright(`${aotMetadataJsonPath} → ${aotMetadataJsonPathNew}`));
        sh.mv(aotMetadataJsonPath, aotMetadataJsonPathNew);
    }
    else {
        sh.echo(chalk.redBright(`Couldn't find metadata.json: "${aotMetadataJsonPath}"`));
        return;
    }

    done();
});

gulp.task('tsconfigJson', function (done) {
    sh.echo(`> Prepare ${filesInfo.tsconfigJsonPath}`);
    let newTsconfigJson = {
        ...tsconfigJson,
        compilerOptions: {
            ...tsconfigJson.compilerOptions,
            declarationDir: filesInfo.typingsFolder,
            outDir: filesInfo.distFolder,
        },
        files: undefined,
        include: [filesInfo.srcFolder],
        exclude: [filesInfo.distFolder, filesInfo.exampleFolder, 'node_modules']
    };
    sh.ShellString(JSON.stringify(newTsconfigJson, null, 4)).to(filesInfo.tsconfigJsonPath);
    done();
});

gulp.task('packageJson', function (done) {
    sh.echo(`> Prepare ${filesInfo.packageJsonPath}`);
    let newPackageJson = {
        ...packageJson,
        ...packagePaths,
        name: packageName,
        files: [
            path.normalize(filesInfo.srcFolder),
            path.normalize(filesInfo.distFolder)
        ]
    };
    sh.ShellString(JSON.stringify(newPackageJson, null, 4)).to(filesInfo.packageJsonPath);
    done();
});

gulp.task('rollup', function (done) {
    sh.echo('> Rollup:');
    (async function () {
        let rollupTsconfig = {
            useTsconfigDeclarationDir: true,
            objectHashIgnoreUnknownHack: true,
            clean: true,
            tsconfig: filesInfo.tsconfigJsonPath,
            tsconfigOverride: {
                compilerOptions: {
                    target: 'es5'
                }
            }
        };

        rollupTsconfig.tsconfigOverride.compilerOptions.target = 'es5';
        let es5umdBundle = await rollup.rollup({
            ...rollupInputConfig,
            plugins: [rollupTypeScript({ ...rollupTsconfig })].concat(rollupInputConfig.plugins)
        });
        await es5umdBundle.write({
            name: rollupUmdName,
            globals: rollupUmdGlobals,
            file: packagePaths.main,
            format: 'umd',
            ...rollupOutputConfig
        });
        sh.echo(chalk.yellowBright(`  [${rollupTsconfig.tsconfigOverride.compilerOptions.target} & umd]: `) + chalk.greenBright(`${rollupInputConfig.input} → ${packagePaths.main}`));

        rollupTsconfig.tsconfigOverride.compilerOptions.target = 'es6';
        let es6esmBundle = await rollup.rollup({
            ...rollupInputConfig,
            plugins: [rollupTypeScript({ ...rollupTsconfig })].concat(rollupInputConfig.plugins)
        });
        await es6esmBundle.write({
            file: packagePaths.module,
            format: 'esm',
            ...rollupOutputConfig
        });
        sh.echo(chalk.yellowBright(`  [${rollupTsconfig.tsconfigOverride.compilerOptions.target} & esm]: `) + chalk.greenBright(`${rollupInputConfig.input} → ${packagePaths.module}`));

        filesInfo.cache.forEach(function (cacheFolder) {
            if (sh.test('-d', cacheFolder)) {
                sh.rm('-rf', cacheFolder);
            }
        });

        sh.echo(chalk.greenBright('Building finished!'));
        done();
    })();
});

gulp.task('example', function (done) {
    sh.echo();
    sh.echo(chalk.cyanBright(`Copy to example → ${filesInfo.exampleFolder}/node_modules/${filesInfo.fileName}`));
    sh.mkdir('-p', `${filesInfo.exampleFolder}/node_modules/${filesInfo.fileName}`);
    sh.cp('-Rf', [filesInfo.srcFolder, filesInfo.distFolder, filesInfo.packageJsonPath], `${filesInfo.exampleFolder}/node_modules/${filesInfo.fileName}`);
    sh.echo(chalk.greenBright('Copying finished!'));
    done();
});

gulp.series('prepare', 'ngc', 'tsconfigJson', 'packageJson', 'rollup', 'example')();