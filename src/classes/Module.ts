import { Component } from "./Component";
import { Guild } from "discord.js";

export abstract class Module<options, cache> {

    components: {} = {};

    private name: string;

    constructor(name: string) {
        this.name = name;
    }

    abstract get component(): new (options: options, cache: cache) => Component<options, cache>;

    async init(guild: Guild): Promise<void> {
        for (const id in this.components) {
            const component: Component<options, cache> = this.components[id];
            const result: Promise<void> | void = component.init(guild);

            if (result instanceof Promise) {
                await result;
            }
        }
    }

    abstract cleanup(guild: Guild): Promise<void> | void

    passes(): {} {
        const passes: {} = {};

        for (const id in this.components) {
            const component = this.components[id];
            passes[id] = component.passes;
        }

        return passes;
    }

}