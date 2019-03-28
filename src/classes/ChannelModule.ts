import {
    Module,
    component_constructor
} from "../classes/Module";
import { Guild } from "discord.js";
import { Component } from "../classes/Component";

export abstract class ChannelModule<options> extends Module<options> {

    private _component: component_constructor<ChannelModule<options>, options>;
    private type: string;

    constructor(component: component_constructor<ChannelModule<options>, options>, type: string) {
        super();

        this._component = component;
        this.type = type;
    }

    get component(): component_constructor<ChannelModule<options>, options> {
        return this._component;
    }

    async clean(guild: Guild): Promise<void> {
        for (const channel of guild.channels.array()) {
            if (channel.type == this.type) {
                let cleanup: boolean = true;

                for (const id in this.components) {
                    const channel_component: Component<any, any> = this.components[id];

                    if (channel_component.cache && channel_component.cache.content == channel.id) {
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