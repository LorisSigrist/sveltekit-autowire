import path from 'path'

interface ComponentPath {
    namespaces: string[],
    componentName: string
}

/**
 * Resolves the name and namespaces under which a given Module should be made available
 * @param rootPath - The root directory from which names should be resolved
 * @param modulePath - The path to the module file, for which a name is needed
 * @param namingStrategy - The naming strategy to use
 * @param namespace - The base namespace from which to import
 * @returns - A list of namespaces, ending with the component name. ["NameSpace2", "NameSpace1", "Component"]
 */
export function getComponentName(rootPath: string, modulePath: string, namingStrategy: "flat" | "namespaced" | "directory", namespace: string): ComponentPath {
    let namespaces: string[] = [];
    let componentName: string;

    if (namingStrategy == "flat") {
        let parsed = path.parse(modulePath);
        if (parsed.name === 'index') {
            componentName = camelize(getLastDir(parsed.dir)); //Use the name of the directory, if the module is called "index"
        } else {
            componentName = camelize(parsed.name);
        }
    }
    else if (namingStrategy == "directory") {
        const parsed = (rootPath === modulePath)
            ? path.parse(path.parse(modulePath).base)
            : path.parse(path.relative(rootPath, modulePath));

        if (parsed.name === 'index') {
            componentName = camelize(parsed.dir);
        } else {
            componentName = camelize(parsed.dir) + camelize(parsed.name);
        }
    }

    else if (namingStrategy == "namespaced") {
        const parsed = (rootPath === modulePath)
            ? path.parse(path.parse(modulePath).base)
            : path.parse(path.relative(rootPath, modulePath));

        const camelizedPath = parsed.dir.split("/").map(camelize)

        if (parsed.name === 'index') {
            componentName = camelizedPath.at(-1);
            namespaces.push(...camelizedPath.slice(0, camelizedPath.length - 2))
        } else {
            componentName = camelize(parsed.name);
            namespaces.push(...camelizedPath)
        }
    }

    //If a base namespace is specified, add it at the start
    if (namespace)
        namespaces.unshift(namespace)

    return {
        namespaces,
        componentName
    };
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
