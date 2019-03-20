import { ChannelModule } from "../classes/ChannelModule";
import {
    ChannelComponentOptions,
    ChannelComponentCache
} from "../classes/ChannelComponent";
import { VoiceChannelComponent } from "../components/VoiceChannelComponent.component";

export class VoiceChannelModule extends ChannelModule<ChannelComponentOptions, ChannelComponentCache> {

    constructor() {
        super(VoiceChannelComponent, "voice");
    }

    get name(): string {
        return "VoiceChannel";
    }

}