import * as path from "path";

import * as mlc from "@aery/mlc";
import { Guild } from "discord.js";
import chalk from "chalk";

import { Module } from "./classes/Module";
import { TextChannelModule } from "./modules/TextChannelModule.module";
import { VoiceChannelModule } from "./modules/VoiceChannelModule.module";
import { CategoryChannelModule } from "./modules/CategoryChannelModule.module";

import { TOMLFormat } from "./classes/TOMLFormat";
import { Component } from "./classes/Component";

const discord_directory: mlc.ConfigDirectory = mlc.directory("discord", new TOMLFormat());
const cache_file: mlc.ConfigFile = mlc.file("cache", new mlc.formats.JSONFormat())
    .defaults({});

export const modules: any = {
    TextChannel: new TextChannelModule(),
    VoiceChannel: new VoiceChannelModule(),
    CategoryChannel: new CategoryChannelModule()
};
const passes: string[] = [
    "parent",
    "index",
    "name"
];

let cache: {};

function clean_cache(): void {
    for (const module_name in cache) {
        if (modules[module_name] === undefined) {
            delete cache[module_name];
        } else {
            const module: Module<any, any> = modules[module_name];
            const components: {} = cache[module_name];
    
            for (const id in components) {
                if (module.components[id] === undefined) {
                    delete components[id];
                }
            }
        }
    }
}

async function write_cache(): Promise<void> {
    cache_file.content = cache;
    await cache_file.write();
}

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

                    module.components[id] = new module.component(module, file.content[module_name], component_cache);
                }
            }
        } else {
            await load_directory(file);
        }
    }
}

export async function load(): Promise<void> {
    await discord_directory.read({
        read_directories: true,
        recursive: true
    });

    await cache_file.read();

    cache = cache_file.content;

    for (const module_name in modules) {
        if (!cache[module_name]) {
            cache[module_name] = {};
        }
    }

    await load_directory(discord_directory);
    clean_cache();
    await write_cache();
}

export async function init(guild: Guild): Promise<void> {
    for (const module_name in modules) {
        const module: Module<any, any> = modules[module_name];

        await module.init(guild);
    }
    
    write_cache();
}

export async function render(): Promise<void> {
    for (let i = 0; i < passes.length; i++) {
        const pass: string = passes[i];

        console.log(chalk.cyan(`[Pass: ${pass}]`));

        for (const module_name in modules) {
            console.log(chalk.gray(`[${module_name}]`));

            const module: Module<any, any> = modules[module_name];

            for (const id in module.components) {
                const component: Component<any, any, any> = module.components[id];
                const render: () => Promise<void> | void = component.passes[pass];

                if (render) {
                    console.log(`Rendering <${id}>`);

                    const result: Promise<void> | void = render();

                    if (result instanceof Promise) {
                        await result;
                    }
                }
            }
        }
    }

    write_cache();
}

export async function cleanup(guild: Guild): Promise<void> {
    for (const module_name in modules) {
        const module: Module<any, any> = modules[module_name];

        await module.cleanup(guild);
    }
}