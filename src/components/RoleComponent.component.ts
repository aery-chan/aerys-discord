import { Component } from "../classes/Component";
import { RoleModule } from "../modules/RoleModule.module";
import { Guild } from "discord.js";

export type RoleComponentOptions = {
    name: string
}

export type RoleComponentCache = {
    id: string
}

export class RoleComponent extends Component<RoleModule, RoleComponentOptions, RoleComponentCache> {

    async init(guild: Guild): Promise<void> {

    }

    get passes(): {} {
        return {

        };
    }

}