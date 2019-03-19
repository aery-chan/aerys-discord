import { Component } from "./Component";

export abstract class Module<options, cache> {

    components: {}

    constructor(components: {}){
        this.components = components;
    }

    abstract get name(): string

    init(guild): void {
        console.log("Initializing");

        for (const id in this.components) {
            console.log(`Intializing <${id}>`);

            const component: Component<options, cache> = this.components[id];

            component.init(guild);
        }
    }

    render(): void {
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
                    pass();
                }
            }

            i++;
        }
    }

    abstract cleanup(): void

}