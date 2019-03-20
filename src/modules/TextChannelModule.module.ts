import { ChannelModule } from "../classes/ChannelModule";
import {
    ChannelComponentOptions,
    ChannelComponentCache
} from "../classes/ChannelComponent";
import { TextChannelComponent } from "../components/TextChannelComponent.component";

export class TextChannelModule extends ChannelModule<ChannelComponentOptions, ChannelComponentCache> {

    constructor() {
        super(TextChannelComponent, "text");
    }

}