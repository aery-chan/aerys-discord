import { Module } from "../classes/Module";
import {
    TextChannelComponentOptions,
    TextChannelComponentCache,
    TextChannelComponent
} from "../components/TextChannelComponent.component";
import { Guild } from "discord.js";

class TextChannelModule extends Module<TextChannelComponentOptions, TextChannelComponentCache> {

    get name(): string {
        return "TextChannel";
    }

    async cleanup(guild: Guild): Promise<void> {
        for (const channel of guild.channels.array()) {
            if (channel.type == "text") {
                let cleanup: boolean = true;

                for (const id in this.components) {
                    const channel_component: TextChannelComponent = this.components[id];

                    if (channel_component.cache.id == channel.id) {
                        cleanup = false;
                    }
                }

                if (cleanup) {
                    await channel.delete();
                }
            }
        }
    }

}