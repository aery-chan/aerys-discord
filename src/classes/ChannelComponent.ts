import { Module } from "./Module";
import { Component } from "../classes/Component";
import {
    Guild,
    GuildChannel
} from "discord.js";

import * as modules from "../modules";

type type = "category" | "text" | "voice";

export type ChannelComponentOptions = {
    parent?: string,
    name: string,
    index?: number
}

export type ChannelComponentCache = {
    id?: string
}

export class ChannelComponent<module extends Module<any, any>, options extends ChannelComponentOptions, cache extends ChannelComponentCache> extends Component<module, options, cache> {

    protected type: type;
    protected channel: GuildChannel;

    constructor(module: module, options: options, cache: cache, type: type) {
        super(module, options, cache);

        this.type = type;
    }
    
    get passes(): {} {
        return {
            parent: () => this.render_parent(),
            index: () => this.render_index(),
            name: () => this.render_name()
        };
    }

    async init(guild: Guild): Promise<void> {
        let channel: GuildChannel = guild.channels.get(this.cache.id);

        if (channel) {
            this.channel = channel;
        } else {            
            this.channel = await guild.createChannel(this.options.name, this.type);
            this.cache.id = this.channel.id;
        }
    }

    protected async render_parent(): Promise<void> {
        if (this.options.parent) {
            const parent = modules.modules.CategoryChannel.components[this.options.parent];

            if (this.channel.parent != parent.channel) {
                await this.channel.setParent(parent.channel);
                console.log("Added parent");
            }
        } else {
            if (this.channel.parent) {
                await this.channel.setParent(null);
                console.log("Removed parent");
            }
        }
    }

    protected async render_index(): Promise<void> {
        let index: number = 0;

        for (const id in this.module.components) {
            const component: ChannelComponent<module, options, cache> = this.module.components[id];

            if (this.options.index > component.options.index) {
                index++;
            }
        }

        if (this.channel.position != index) {
            await this.channel.setPosition(index);
            console.log("Moved");
        }
    }

    protected async render_name(): Promise<void> {
        if (this.channel.name != this.options.name) {
            await this.channel.setName(this.options.name);
            console.log("Renamed");
        }
    }

}