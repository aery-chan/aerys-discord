import { ConfigFile } from "@aery/mlc";
import { TextChannel } from "discord.js";

import { TextChannelModule } from "../modules/TextChannelModule.module";
import {
    ChannelComponent,
    ChannelComponentOptions
} from "../classes/ChannelComponent";

type TextChannelOptions = ChannelComponentOptions & {
    nsfw?: boolean
}

export class TextChannelComponent extends ChannelComponent<TextChannelModule, TextChannelOptions> {

    constructor(module: TextChannelModule, options: TextChannelOptions, cache: ConfigFile) {
        super(module, options, cache, "text");
    }

    get passes(): {} {
        return {
            parent: () => this.render_parent(),
            index: () => this.render_index(),
            name: () => this.render_name(),
            nsfw: () => this.render_nsfw()
        };
    }

    private async render_nsfw(): Promise<void> {
        const channel: TextChannel = <TextChannel>this.channel;

        if (this.options.nsfw) {
            if (!channel.nsfw) {
                await channel.setNSFW(true, "");
                console.log("Marked as NSFW");
            }
        } else {
            if (channel.nsfw) {
                await channel.setNSFW(false, "");
                console.log("Unmarked as NSFW");
            }
        }
    }

}