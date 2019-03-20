import { Module } from "../classes/Module";
import { Guild } from "discord.js";
import { Component } from "../classes/Component";

type component_constructor<module, options, cache> = new (module: module, options: options, cache: cache) => Component<module, options, cache>

export abstract class ChannelModule<options, cache> extends Module<options, cache> {

    private _component: component_constructor<ChannelModule<options, cache>, options, cache>;
    private type: string;

    constructor(component: component_constructor<ChannelModule<options, cache>, options, cache>, type: string) {
        super();

        this._component = component;
        this.type = type;
    }

    get component(): component_constructor<ChannelModule<options, cache>, options, cache> {
        return this._component;
    }

    async cleanup(guild: Guild): Promise<void> {
        for (const channel of guild.channels.array()) {
            if (channel.type == this.type) {
                let cleanup: boolean = true;

                for (const id in this.components) {
                    const channel_component: Component<any, any, any> = this.components[id];

                    if (channel_component.cache && channel_component.cache.id == channel.id) {
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