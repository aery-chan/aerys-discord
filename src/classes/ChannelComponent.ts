import { Component } from "../classes/Component";
import {
    Guild,
    TextChannel,
    CategoryChannel,
    VoiceChannel
} from "discord.js";

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

    constructor(options: options, cache: cache, type: type) {
        super(options, cache);

        this.type = type;
    }

    async init(guild: Guild): Promise<void> {
        if (!guild.channels.has(this.cache.id)) {
            const channel: TextChannel | VoiceChannel | CategoryChannel = <TextChannel>await guild.createChannel(this.options.name, this.type);

            this.cache.id = channel.id;
        }
    }

    render(): (() => Promise<void>)[] {
        return [];
    }

}