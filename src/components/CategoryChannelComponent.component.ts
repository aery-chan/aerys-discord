import { CategoryChannelModule } from "../modules/CategoryChannelModule.module";
import {
    ChannelComponent,
    ChannelComponentOptions
} from "../classes/ChannelComponent";

import { ConfigFile } from "@aery/mlc";

export class CategoryChannelComponent extends ChannelComponent<CategoryChannelModule, ChannelComponentOptions> {

    constructor(module: CategoryChannelModule, options: ChannelComponentOptions, cache: ConfigFile) {
        super(module, options, cache, "category");
    }

    get passes(): {} {
        return {
            index: () => this.render_index(),
            name: () => this.render_name()
        }
    }

}