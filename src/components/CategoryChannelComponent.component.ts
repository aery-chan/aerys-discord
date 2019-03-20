import {
    ChannelComponent,
    ChannelComponentOptions,
    ChannelComponentCache
} from "../classes/ChannelComponent";
import { ChannelModule } from "../classes/ChannelModule";

export class CategoryChannelComponent extends ChannelComponent<ChannelModule<ChannelComponentOptions, ChannelComponentCache>, ChannelComponentOptions, ChannelComponentCache> {

    constructor(module: ChannelModule<ChannelComponentOptions, ChannelComponentCache>, options: ChannelComponentOptions, cache: ChannelComponentCache) {
        super(module, options, cache, "category");
    }

    get passes(): {} {
        return {
            index: () => this.render_index(),
            name: () => this.render_name()
        }
    }

}