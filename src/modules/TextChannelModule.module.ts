import { ChannelModule } from "../classes/ChannelModule";
import { ChannelComponentOptions } from "../classes/ChannelComponent";
import { TextChannelComponent } from "../components/TextChannelComponent.component";

export class TextChannelModule extends ChannelModule<ChannelComponentOptions> {

    constructor() {
        super(TextChannelComponent, "text");
    }

    get name(): string {
        return "TextChannel";
    }

}