import path from 'path'

/**
 * Resolves the name under which a given Module should be made available, based on the flat, prfix and position relative to root.
 * @param rootPath - The root directory from which names should be resolved
 * @param modulePath - The path to the module file, for which a name is needed
 * @param namingStrategy - The naming strategy to use
 * @param prefix - A string with which the module name should be prefixed
 * @returns - A module name for the given path, standardized to CamelCase
 */
export function getComponentName(rootPath: string, modulePath: string, namingStrategy: "flat" | "namespaced" | "directory", prefix: string) {
    let moduleName: string;
    
    if (namingStrategy == "flat") {
        let parsed = path.parse(modulePath);
        if (parsed.name === 'index') {
            moduleName = camelize(getLastDir(parsed.dir)); //Use the name of the directory, if the module is called "index"
        } else {
            moduleName = camelize(parsed.name);
        }
    } 
    else if (namingStrategy == "directory"){
        let parsed = (rootPath === modulePath)
            ? path.parse(path.parse(modulePath).base)
            : path.parse(path.relative(rootPath, modulePath));
        moduleName = camelize(parsed.dir + '_' + parsed.name);
        if (parsed.name === 'index') { 
            moduleName = camelize(parsed.dir);
        }
    }
    else if ( namingStrategy == "namespaced") {
        throw new Error("Namespaced naming strategy is not yet implemented");
    }

    if (prefix) {
        moduleName = camelize(prefix) + moduleName;
    }
    return moduleName;
}


function camelize(name) {
    return name
        .replace(/[-_\/\\]+(.{1})/g, toUpperCase)
        .replace(/^(.{1})/, toUpperCase);
}



function toUpperCase(_, c) {
    return String(c).toUpperCase();
}

function getLastDir(dir) {
    let dirs = dir.split(path.sep).filter(n => n !== 'index');
    return dirs[dirs.length - 1];
}
