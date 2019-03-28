import { Component } from "./Component";
import { ConfigFile } from "@aery/mlc";
import { Guild } from "discord.js";

export type component_constructor<module, options> = new (module: module, options: options, cache: ConfigFile) => Component<module, options>

export abstract class Module<options> {

    components: {} = {};

    abstract get name(): string
    abstract get component(): component_constructor<Module<options>, options>

    async init(guild: Guild): Promise<void> {
        for (const id in this.components) {
            const component: Component<Module<options>, options> = this.components[id];
            const result: Promise<void> | void = component.init(guild);

            if (result instanceof Promise) {
                await result;
            }
        }
    }

    abstract clean(guild: Guild): Promise<void> | void

}