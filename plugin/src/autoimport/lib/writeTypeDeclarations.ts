import path from 'path'
import { writeFileSync, mkdirSync } from 'fs'
import { TypeDeclarationMapping } from '../types.js'
import crypto from 'crypto'

const DTS_DIR = './.svelte-kit/'
const DTS_NAME = 'autowire.d.ts'

export function writeTypeDeclarations(typeDeclarations: TypeDeclarationMapping) {
    const declarationStatements: string[] = [];
    const aliasStatements = [];
    const aliases = {};


    Object.entries(typeDeclarations).forEach(([name, typeDeclaration]) => {
        if (typeDeclaration.namespaces.length === 0) {
            const statement = typeDeclaration.typeDefinitionFactory(DTS_DIR);
            declarationStatements.push(statement);
        } else {
            const importAs = name + "_AUTOWIRE_" + crypto.createHash("md5").update(name).digest("hex").toUpperCase();
            const statement = typeDeclaration.typeDefinitionFactory(DTS_DIR, importAs);
            declarationStatements.push(statement);

            let currentAliasLevel = aliases;
            for (const ns of typeDeclaration.namespaces) {
                if (currentAliasLevel[ns] === undefined) {
                    currentAliasLevel[ns] = {};
                }
                currentAliasLevel = currentAliasLevel[ns];
            }
            currentAliasLevel[name] = importAs;
        }
    })

    Object.entries(aliases).forEach(([name, aliases]) => {
        aliasStatements.push(`declare const ${name} : ${createAliasObjectLiteral(aliases)};`)
    })



    const blocks = [];

    const typeDeclarationBlock = declarationStatements.join('\n');
    const aliasStatementBlock = aliasStatements.join('\n');

    if (typeDeclarationBlock) blocks.push(typeDeclarationBlock);
    if (aliasStatementBlock) blocks.push(aliasStatementBlock);

    const importStatements = blocks.join('\n');
    console.log(importStatements);

    //Creating the directory, if it does not already exist. This is harmless in case it already does exist
    mkdirSync(path.resolve(DTS_DIR), { recursive: true });
    writeFileSync(path.resolve(DTS_DIR + DTS_NAME), importStatements)
}


export function createAliasObjectLiteral(aliases): string {
    if (typeof aliases === "string") {
        return `typeof ${aliases}`
    }

    let literal = "{\n"

    Object.entries(aliases).forEach(([name, alias]) => {
        literal += `"${name}" : ${createAliasObjectLiteral(alias)},${"\n"}`
    })
    literal += "}"
    return literal;
}