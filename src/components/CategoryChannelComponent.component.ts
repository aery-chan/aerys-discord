import { CategoryChannelModule } from "../modules/CategoryChannelModule.module";
import {
    ChannelComponent,
    ChannelComponentOptions,
    ChannelComponentCache
} from "../classes/ChannelComponent";

export class CategoryChannelComponent extends ChannelComponent<CategoryChannelModule, ChannelComponentOptions, ChannelComponentCache> {

    constructor(module: CategoryChannelModule, options: ChannelComponentOptions, cache: ChannelComponentCache) {
        super(module, options, cache, "category");
    }

    get passes(): {} {
        return {
            index: () => this.render_index(),
            name: () => this.render_name()
        }
    }

}