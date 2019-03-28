import { ChannelModule } from "../classes/ChannelModule";
import { ChannelComponentOptions } from "../classes/ChannelComponent";
import { VoiceChannelComponent } from "../components/VoiceChannelComponent.component";

export class VoiceChannelModule extends ChannelModule<ChannelComponentOptions> {

    constructor() {
        super(VoiceChannelComponent, "voice");
    }

    get name(): string {
        return "VoiceChannel";
    }

}