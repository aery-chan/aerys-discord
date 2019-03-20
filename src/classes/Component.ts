import { Guild } from "discord.js";

export abstract class Component<module, options, cache> {

    module: module;
    options: options;
    cache: cache;

    constructor(module: module, options: options, cache: cache) {
        this.module = module;
        this.options = options;
        this.cache = cache;
    }

    abstract get passes(): {}

    abstract init(guild: Guild): Promise<void> | void

}