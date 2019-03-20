import { Component } from "../classes/Component";
import { Guild, TextChannel } from "discord.js";

export type TextChannelComponentOptions = {
    parent?: string,
    name: string,
    index?: number
}

export type TextChannelComponentCache = {
    id?: string
}

export class TextChannelComponent extends Component<TextChannelComponentOptions, TextChannelComponentCache> {

    async init(guild: Guild): Promise<void> {
        if (!guild.channels.has(this.cache.id)) {
            const channel: TextChannel = <TextChannel>await guild.createChannel(this.options.name, "text");

            this.cache.id = channel.id;
        }
    }

    render(): (() => Promise<void>)[] {
        return [];
    }

}