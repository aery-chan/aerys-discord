import { ChannelModule } from "../classes/ChannelModule";
import {
    ChannelComponent,
    ChannelComponentOptions,
    ChannelComponentCache
} from "../classes/ChannelComponent";

export class TextChannelComponent extends ChannelComponent<ChannelModule<ChannelComponentOptions, ChannelComponentCache>, ChannelComponentOptions, ChannelComponentCache> {

    constructor(module: ChannelModule<ChannelComponentOptions, ChannelComponentCache>, options: ChannelComponentOptions, cache: ChannelComponentCache) {
        super(module, options, cache, "text");
    }

}