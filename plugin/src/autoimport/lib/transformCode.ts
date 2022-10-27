import { walkAST } from "./parsing/walkAST.js";
import MagicString from 'magic-string';
import path from 'path';
import { Ast, ImportMapping } from "../types.js";
import crypto from 'crypto'

export function transformCode(code: string, ast: Ast | undefined, filePath: string, importMapping: ImportMapping) {
    const { imported, maybeUsed, declared } = walkAST(ast);

    /* A list of import statements that need to be added to the current file */
    const usedImports: ImportMapping = {}
    Object.entries(importMapping).forEach(([name, importDescription]) => {

        if (/\W/.test(name)) return;    //If the ModuleName contains whitespace, it's invalid
        if (imported.has(name)) return; //If the module is already imported in this file, skip adding the import
        if (declared.has(name)) return; //If the module is declared in this file, don't add an import
        if (!maybeUsed.has(name)) return; //If there is no way for this module to be used in this file, don't import it

        usedImports[name] = importDescription;
    });

    const s = new MagicString(code, { filename: filePath });

    const importStatementBlock = generateImportStatements(filePath, usedImports);

    if (importStatementBlock) {
        const hasScriptTag = !!ast.instance;
        if (hasScriptTag) {

            const scriptTagStart = ast.instance.start;
            const scriptTagEnd = scriptTagStart + (code.slice(scriptTagStart).indexOf('>'));

            s.prependLeft(scriptTagEnd + 1, importStatementBlock);
        } else {
            const importScriptTag = `\n<script>${importStatementBlock}</script>`
            s.append(importScriptTag);
        }
    }

    return {
        code: s.toString(),
        map: s.generateMap(),
    }
}

function generateImportStatements(filePath: string, importMapping: ImportMapping): string {
    const importStatements = [];
    const aliasStatements = [];
    const aliases = {};
    Object.entries(importMapping).forEach(([name, importDescription]) => {
        let importAs = name;
        if(importDescription.namespaces.length !== 0) {
            importAs = "AUTOWIRE_" + name + "_" + crypto.createHash("md5").update(name + filePath).digest("hex").toUpperCase();
            aliases[name] = importAs;
        }
        
        importStatements.push(importDescription.importFactory(path.dirname(filePath), importAs))
    })

    Object.entries(aliases).forEach(([name, aliases]) => {
        aliasStatements.push(`const ${name} = ${aliasesObject(aliases)};`)
    })

    const importStatementBlock = importStatements.join("\n");
    const aliasStatementBlock = aliasStatements.join("\n");

    const blocks: string[] = [];

    if (importStatementBlock) blocks.push(importStatementBlock);
    if (aliasStatementBlock) blocks.push(aliasStatementBlock);

    const importBlock = blocks.join("\n\n");
    console.log(importBlock);
    return importBlock;
}

function aliasesObject(aliases) : string {
    if(typeof aliases === "string") {
        return `${aliases}`
    }

    Object.entries(aliases).forEach(([name, alias]) => {
        return `{"${name}" : ${aliasesObject(alias)}}`
    })
}