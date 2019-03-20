import { Component } from "./Component";
import { Guild } from "discord.js";

export abstract class Module<options, cache> {

    components: {} = {};

    abstract get name(): string
    abstract get component(): new (module: Module<options, cache>, options: options, cache: cache) => Component<Module<options, cache>, options, cache>

    async init(guild: Guild): Promise<void> {
        for (const id in this.components) {
            const component: Component<Module<options, cache>, options, cache> = this.components[id];
            const result: Promise<void> | void = component.init(guild);

            if (result instanceof Promise) {
                await result;
            }
        }
    }

    abstract cleanup(guild: Guild): Promise<void> | void

}