import * as path from "path";

import * as mlc from "@aery/mlc";

import { Module } from "./classes/Module";
import { TextChannelModule } from "./modules/TextChannelModule.module";
import { TOMLFormat } from "./classes/TOMLFormat";

const discord_directory: mlc.ConfigDirectory = mlc.directory("discord", new TOMLFormat());

let cache: {};

export const modules: {} = { TextChannel: new TextChannelModule() };

async function load_directory(directory: mlc.ConfigDirectory): Promise<void> {
    for (const file_name in directory.files) {
        const file: mlc.ConfigFile | mlc.ConfigDirectory = directory.files[file_name];
        
        if (file instanceof mlc.ConfigFile) {
            const id: string = path.basename(file_name, path.extname(file_name));
    
            for (const module_name in modules) {
                const module: Module<any, any> = modules[module_name];

                if (file.content[module_name]) {
                    let component_cache: {} = cache[module_name][id];

                    if (!component_cache) {
                        component_cache = cache[module_name][id] = {};
                    }

                    module.components[id] = new module.component(file.content, component_cache);
                }
            }
        } else {
            await load_directory(file);
        }
    }
}

function clean_cache(): void {
    for (const module_name in cache) {
        if (modules[module_name] === undefined) {
            delete cache[module_name];
        } else {
            const module: Module<any, any> = modules[module_name];
            const components: {} = cache[module_name];
    
            for (const id in components) {
                if (module.component[id] === undefined) {
                    delete components[id];
                }
            }
        }
    }
}

export async function load(): Promise<void> {
    await discord_directory.read({
        read_directories: true,
        recursive: true
    });

    const cache_file: mlc.ConfigFile = await mlc.file("cache", new mlc.formats.JSONFormat())
        .defaults({})
        .read();

    cache = cache_file.content;

    for (const module_name in modules) {
        if (!cache[module_name]) {
            cache[module_name] = {};
        }
    }

    await load_directory(discord_directory);
    clean_cache();

    cache_file.content = cache;

    await cache_file.write();
}

export async function init(): Promise<void> {

}

export async function render(): Promise<void> {

}

export async function cleanup(): Promise<void> {

}