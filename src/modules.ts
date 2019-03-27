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

export const modules: any = {
    TextChannel: new TextChannelModule(),
    VoiceChannel: new VoiceChannelModule(),
    CategoryChannel: new CategoryChannelModule()
};
const passes: string[] = [
    "parent",
    "index",
    "name",
    "nsfw",
    "max"
];

const discord_directory: mlc.ConfigDirectory = mlc.directory("discord", new TOMLFormat());
const cache_directory: mlc.ConfigDirectory = mlc.directory("cache", new mlc.formats.JSONFormat());

async function load_component(module: Module<any>, id: string, options: any): Promise<void> {
    let module_cache: mlc.ConfigDirectory = cache_directory.files[module.name];
    
    if (!module_cache) {
        module_cache = cache_directory.files[module.name] = await new mlc.ConfigDirectory(
            path.resolve(cache_directory.directory_path, module.name),
            cache_directory.format
        ).read();
    }

    let component_cache: mlc.ConfigFile = module_cache.files[id];
        
    if (!component_cache) {
        component_cache = module_cache.files[id] = await new mlc.ConfigFile(
            path.resolve(module_cache.directory_path, id),
            module_cache.format
        ).read();
    }

    let component: Component<typeof module, any> = module.components[id];

    if (component) {
        component.cache = component_cache;
        component.options = options;
    } else {
        component = module.components[id] = new module.component(module, options, component_cache);
    }
}

async function load_file(file: mlc.ConfigFile): Promise<void> {
    const id: string = path.basename(file.file_path, path.extname(file.file_path));

    for (const module_name in modules) {
        const module: Module<any> = modules[module_name];

        if (file.content[module.name]) {
            await load_component(module, id, file.content[module.name]);
        }
    }
}

async function load_directory(directory: mlc.ConfigDirectory): Promise<void> {
    for (const file_name in directory.files) {
        const file: mlc.ConfigFile | mlc.ConfigDirectory = directory.files[file_name];

        if (file instanceof mlc.ConfigFile) {
            await load_file(file);
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
    await cache_directory.read({
        read_directories: true,
        recursive: true
    });

    load_directory(discord_directory);
}

export async function init(guild: Guild): Promise<void> {
    for (const module_name in modules) {
        const module: Module<any> = modules[module_name];

        await module.init(guild);
    }
}

export async function render(): Promise<void> {
    for (let i = 0; i < passes.length; i++) {
        const pass: string = passes[i];

        console.log(chalk.cyan(`[Pass: ${pass}]`));

        for (const module_name in modules) {
            const module: Module<any> = modules[module_name];
            const module_passes: {} = {};

            let has_pass: boolean = false;

            for (const id in module.components) {
                const component: Component<any, any> = module.components[id];
                const render: () => Promise<void> | void = component.passes[pass];

                if (render) {
                    has_pass = true;
                    module_passes[id] = render;
                }
            }

            if (has_pass) {
                console.log(chalk.gray(`[${module_name}]`));

                for (const id in module.components) {
                    console.log(`Rendering <${id}>`);

                    const render: () => Promise<void> | void = module_passes[id];
                    const result: Promise<void> | void = render();

                    if (result instanceof Promise) {
                        await result;
                    }
                }
            }
        }
    }
}

export async function clean(guild: Guild): Promise<void> {
    for (const module_name in modules) {
        const module: Module<any> = modules[module_name];

        await module.clean(guild);
    }
}