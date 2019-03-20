import { ChannelModule } from "../classes/ChannelModule";
import {
    ChannelComponentOptions,
    ChannelComponentCache
} from "../classes/ChannelComponent";
import { CategoryChannelComponent } from "../components/CategoryChannelComponent.component";

export class CategoryChannelModule extends ChannelModule<ChannelComponentOptions, ChannelComponentCache> {

    constructor() {
        super(CategoryChannelComponent, "category");
    }

    get name(): string {
        return "CategoryChannel";
    }

}