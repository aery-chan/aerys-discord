import { ConfigFile } from "@aery/mlc";
import { Guild } from "discord.js";

export abstract class Component<module, options> {

    module: module;
    options: options;
    cache: ConfigFile;

    constructor(module: module, options: options, cache: ConfigFile) {
        this.module = module;
        this.options = options;
        this.cache = cache;
    }

    abstract get passes(): {}

    abstract init(guild: Guild): Promise<void> | void

}