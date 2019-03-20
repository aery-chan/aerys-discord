import {
    ChannelComponent,
    ChannelComponentOptions,
    ChannelComponentCache
} from "../classes/ChannelComponent";

export class CategoryChannelComponent extends ChannelComponent<ChannelComponentOptions, ChannelComponentCache> {

    constructor(options: ChannelComponentOptions, cache: ChannelComponentCache) {
        super(options, cache, "category");
    }

}