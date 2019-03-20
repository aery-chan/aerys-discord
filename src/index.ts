import * as mlc from "@aery/mlc";
import * as Discord from "discord.js";

import { TOMLFormat } from "./classes/TOMLFormat";
import * as modules from "./modules";

mlc.formats.register_format(TOMLFormat, [ "toml" ]);

const config: mlc.ConfigFile = mlc.file("config.toml")
    .defaults({
        token: "",
        guild: ""
    });
const client: Discord.Client = new Discord.Client();

client.on("ready", async () => {
    const guild: Discord.Guild = client.guilds.get(config.content.guild);

    if (!guild) {
        throw new Error("Invalid guild");
    }
    
    await modules.init(guild);
    await modules.render();
    await modules.cleanup(guild);
});

async function main(): Promise<void> {
    await config.read({ write_if_defaulted: true });
    await modules.load();

    try {
        await client.login(config.content.token);
    } catch (error) {
        throw new Error("Invalid token");
    }
}

setTimeout(main, 2000);