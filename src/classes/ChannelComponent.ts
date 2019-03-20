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

export class ChannelComponent<options extends ChannelComponentOptions, cache extends ChannelComponentCache> extends Component<options, cache> {

    private type: type;
    private channel: GuildChannel;

    constructor(options: options, cache: cache, type: type) {
        super(options, cache);

        this.type = type;
    }
    
    get passes(): (() => Promise<void>)[] {
        return [
            () => this.render_parent(),
            () => this.render_name()
        ];
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

    private async render_parent(): Promise<void> {
        if (this.type != "category") {
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
    }

    private async render_name(): Promise<void> {
        if (this.channel.name != this.options.name) {
            await this.channel.setName(this.options.name);
            console.log("Renamed");
        }
    }

}