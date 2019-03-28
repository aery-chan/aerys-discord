import { Module } from "./Module";
import { Component } from "../classes/Component";
import { ConfigFile } from "@aery/mlc";
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

export abstract class ChannelComponent<module extends Module<any>, options extends ChannelComponentOptions> extends Component<module, options> {

    protected type: type;
    protected channel: GuildChannel;

    constructor(module: module, options: options, cache: ConfigFile, type: type) {
        super(module, options, cache);

        this.type = type;
    }

    async init(guild: Guild): Promise<void> {
        let channel: GuildChannel = guild.channels.get(this.cache.content);

        if (channel) {
            this.channel = channel;
        } else {            
            this.channel = await guild.createChannel(this.options.name, this.type);
            this.cache.content = this.channel.id;
            await this.cache.write();
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
        let expected_index: number = 0;
        let actual_index: number = 0;

        const grouped_expected_components: ChannelComponent<module, options>[] = [];
        const grouped_actual_channels: GuildChannel[] = [];

        for (const id in this.module.components) {
            const component: ChannelComponent<module, options> = this.module.components[id];

            if (component.options.parent == this.options.parent) {
                grouped_expected_components.push(component);
            }

            if (component.channel.parent == this.channel.parent) {
                grouped_actual_channels.push(component.channel);
            }
        }

        for (const component of grouped_expected_components) {
            if (this.options.index > component.options.index) {
                expected_index++;
            }
        }

        for (const channel of grouped_actual_channels) {
            if (this.channel.position > channel.position) {
                actual_index++;
            }
        }

        if (expected_index != actual_index) {
            await this.channel.setPosition(expected_index);
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