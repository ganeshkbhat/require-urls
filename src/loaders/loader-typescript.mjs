/**
 * 
 * Package: require-urls
 * Author: Ganesh B
 * Description: Nodejs npm module to traverse folder using code or cli or use glob patterns
 * Install: npm i require-urls --save
 * Github: https://github.com/ganeshkbhat/requireurl
 * npmjs Link: https://www.npmjs.com/package/require-urls
 * File: loader-typescript.mjs
 * File Description: Using require-urls instead of require to fetch files from git repositories like Github or Bitbucket like repository directly
 * 
 * git-rest: https://www.softwaretestinghelp.com/github-rest-api-tutorial/#:~:text=Log%20in%20to%20your%20GitHub,and%20click%20on%20Create%20Token.
 * 
*/

/* eslint no-console: 0 */

'use strict';

import { readFile } from 'node:fs/promises';
import { dirname, extname, resolve as resolvePath } from 'node:path';
import { cwd } from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
// tsc compiler function - Check function type
// Add support for https/http
import * as ts from "typescript";

const extensionsRegex = /\.ts$/;

// // 
// // Getting a dts file from javascript file
// //
// // https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API
// // Getting the DTS from a JavaScript file
// //
// // 
// function compile(fileNames: string[], options: ts.CompilerOptions): void {
//     // Create a Program with an in-memory emit
//     const createdFiles = {}
//     const host = ts.createCompilerHost(options);
//     host.writeFile = (fileName: string, contents: string) => createdFiles[fileName] = contents
//
//     // Prepare and emit the d.ts files
//     const program = ts.createProgram(fileNames, options, host);
//     program.emit();
//
//     // Loop through all the input files
//     fileNames.forEach(file => {
//         console.log("### JavaScript\n")
//         console.log(host.readFile(file))
//
//         console.log("### Type Definition\n")
//         const dts = file.replace(".js", ".d.ts")
//         console.log(createdFiles[dts])
//     })
// }

// // Run the compiler
// compile(process.argv.slice(2), {
//     allowJs: true,
//     declaration: true,
//     emitDeclarationOnly: true,
// });
//


function tsCompile(source, options = null) {
    // Default options -- you could also perform a merge, or use the project tsconfig.json
    if (null === options) {
        options = { compilerOptions: { module: ts.ModuleKind.CommonJS } };
    }
    return ts.transpileModule(source, options).outputText;
}


// //
// //https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API
// //
// // A simple transform function
// // 
// import * as ts from "typescript";
// const source = "let x: string  = 'string'";
// let result = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS }});
// console.log(JSON.stringify(result));
//

// //
// // https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API
// // 
// // A minimal compiler
// // 
// function compile(fileNames: string[], options: ts.CompilerOptions): void {
//     let program = ts.createProgram(fileNames, options);
//     let emitResult = program.emit();
//
//     let allDiagnostics = ts
//         .getPreEmitDiagnostics(program)
//         .concat(emitResult.diagnostics);
//
//     allDiagnostics.forEach(diagnostic => {
//         if (diagnostic.file) {
//             let { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start!);
//             let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
//             console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
//         } else {
//             console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
//         }
//     });
//
//     let exitCode = emitResult.emitSkipped ? 1 : 0;
//     console.log(`Process exiting with code '${exitCode}'.`);
//     process.exit(exitCode);
// }
//
// compile(process.argv.slice(2), {
//     noEmitOnError: true,
//     noImplicitAny: true,
//     target: ts.ScriptTarget.ES5,
//     module: ts.ModuleKind.CommonJS
// });
//

//
// https://stackoverflow.com/questions/17965572/compile-a-typescript-string-to-a-javascript-string-programmatically
//
// function tsCompile(source: string, options: ts.TranspileOptions = null): string {
//     // Default options -- you could also perform a merge, or use the project tsconfig.json
//     if (null === options) {
//         options = { compilerOptions: { module: ts.ModuleKind.CommonJS } };
//     }
//     return ts.transpileModule(source, options).outputText;
// }
//

// loader-typescript.mjs
export function resolve(specifier, context, nextResolve) {
    if (extensionsRegex.test(specifier)) {
        const { parentURL = baseURL } = context;

        // Node.js normally errors on unknown file extensions, so return a URL for
        // specifiers ending in the TypeScript file extensions.
        return {
            shortCircuit: true,
            url: new URL(specifier, parentURL).href
        };
    }

    // Let Node.js handle all other specifiers.
    return nextResolve(specifier);
}

export function load(url, context, nextLoad) {
    if (extensionsRegex.test(url)) {
        // Now that we patched resolve to let TypeScript URLs through, we need to
        // tell Node.js what format such URLs should be interpreted as. Because
        // TypeScript transpiles into JavaScript, it should be one of the two
        // JavaScript formats: 'commonjs' or 'module'.

        // TypeScript files can be either CommonJS or ES modules, so we want any
        // TypeScript file to be treated by Node.js the same as a .js file at the
        // same location. To determine how Node.js would interpret an arbitrary .js
        // file, search up the file system for the nearest parent package.json file
        // and read its "type" field.
        const format = await getPackageType(url);
        // When a hook returns a format of 'commonjs', `source` is be ignored.
        // To handle CommonJS files, a handler needs to be registered with
        // `require.extensions` in order to process the files with the CommonJS
        // loader. Avoiding the need for a separate CommonJS handler is a future
        // enhancement planned for ES module loaders.
        if (format === 'commonjs') {
            return {
                format,
                shortCircuit: true,
            };
        }

        const { source: rawSource } = await nextLoad(url, { ...context, format });
        // This hook converts TypeScript source code into JavaScript source code
        // for all imported typescript files.
        const transformedSource = tsCompile(rawSource.toString(), url);

        return {
            format,
            shortCircuit: true,
            source: transformedSource,
        };
    }

    // Let Node.js handle all other URLs.
    return nextLoad(url);
}

async function getPackageType(url) {
    // `url` is only a file path during the first iteration when passed the
    // resolved url from the load() hook
    // an actual file path from load() will contain a file extension as it's
    // required by the spec
    // this simple truthy check for whether `url` contains a file extension will
    // work for most projects but does not cover some edge-cases (such as
    // extensionless files or a url ending in a trailing space)
    const isFilePath = !!extname(url);
    // If it is a file path, get the directory it's in
    const dir = isFilePath ?
        dirname(fileURLToPath(url)) :
        url;
    // Compose a file path to a package.json in the same directory,
    // which may or may not exist
    const packagePath = resolvePath(dir, 'package.json');
    // Try to read the possibly nonexistent package.json
    const type = await readFile(packagePath, { encoding: 'utf8' })
        .then((filestring) => JSON.parse(filestring).type)
        .catch((err) => {
            if (err?.code !== 'ENOENT') console.error(err);
        });
    // Ff package.json existed and contained a `type` field with a value, voila
    if (type) return type;
    // Otherwise, (if not at the root) continue checking the next directory up
    // If at the root, stop and return false
    return dir.length > 1 && getPackageType(resolvePath(dir, '..'));
}
