import { Module } from "../classes/Module";
import { Guild } from "discord.js";
import { Component } from "../classes/Component";

type component_constructor<options, cache> = new (options: options, cache: cache) => Component<options, cache>

export class ChannelModule<options, cache> extends Module<options, cache> {

    private _component: component_constructor<options, cache>;
    private type: string;

    constructor(name: string, component: component_constructor<options, cache>, type: string) {
        super(name);

        this._component = component;
        this.type = type;
    }

    get component(): component_constructor<options, cache> {
        return this._component;
    }

    async cleanup(guild: Guild): Promise<void> {
        for (const channel of guild.channels.array()) {
            if (channel.type == this.type) {
                let cleanup: boolean = true;

                for (const id in this.components) {
                    const channel_component: Component<any, any> = this.components[id];

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