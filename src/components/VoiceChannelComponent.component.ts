import { ChannelModule } from "../classes/ChannelModule";
import {
    ChannelComponent,
    ChannelComponentOptions,
    ChannelComponentCache
} from "../classes/ChannelComponent";
import { VoiceChannel } from "discord.js";

type VoiceChannelOptions = ChannelComponentOptions & {
    max?: number
}

export class VoiceChannelComponent extends ChannelComponent<ChannelModule<VoiceChannelOptions, ChannelComponentCache>, VoiceChannelOptions, ChannelComponentCache> {

    constructor(module: ChannelModule<VoiceChannelOptions, ChannelComponentCache>, options: VoiceChannelOptions, cache: ChannelComponentCache) {
        super(module, options, cache, "voice");
    }

    get passes(): {} {
        return {
            parent: () => this.render_parent(),
            index: () => this.render_index(),
            name: () => this.render_name(),
            max: () => this.render_max()
        }
    }

    private async render_max(): Promise<void> {
        const channel: VoiceChannel = <VoiceChannel>this.channel;

        if (this.options.max) {
            if (channel.userLimit != this.options.max) {
                channel.setUserLimit(this.options.max);
                console.log("Changed user limit");
            }
        } else {
            if (channel.userLimit) {
                channel.setUserLimit(0);
                console.log("Removed user limit");
            }
        }
    }

}