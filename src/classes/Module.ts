import { Component } from "./Component";
import { Guild } from "discord.js";

export abstract class Module<options, cache> {

    components: {} = {};

    abstract get component(): new (options: options, cache: cache) => Component<options, cache>;

    async init(guild: Guild): Promise<void> {
        console.log("Initializing");

        for (const id in this.components) {
            console.log(`Intializing <${id}>`);

            const component: Component<options, cache> = this.components[id];
            const result: Promise<void> | void = component.init(guild);

            if (result instanceof Promise) {
                await result;
            }
        }
    }

    abstract cleanup(guild: Guild): Promise<void> | void

    async render(): Promise<void> {
        const passes: {} = {};

        console.log("[Preparing rendering]");

        for (const id in this.components) {
            console.log(`Preparing rendering for <${id}>`);
            const component = this.components[id];
            passes[id] = component.passes;
        }

        let had_pass: boolean = true;
        let i: number = 0;

        console.log("[Rendering]");

        while (had_pass) {
            had_pass = false;

            console.log(`[Pass <${i + 1}>]`);

            for (const id in this.components) {
                console.log(`Rendering <${id}>`);

                const pass = passes[id][i];

                if (pass) {
                    had_pass = true;

                    const result: Promise<void> | void = pass();

                    if (result instanceof Promise) {
                        await result;
                    }
                }
            }

            i++;
        }
    }

}