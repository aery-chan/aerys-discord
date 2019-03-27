import {
    Module,
    component_constructor
} from "../classes/Module";
import { RoleComponent } from "../components/RoleComponent.component";

type RoleComponentOptions = {
    name: string
}

type RoleComponentCache = {
    id: string
}

export class RoleModule extends Module<RoleComponentOptions, RoleComponentCache> {

    get name(): string {
        return "Role";
    }

    get component(): component_constructor<RoleModule, RoleComponentOptions, RoleComponentCache> {
        return RoleComponent;
    }

    async cleanup(): Promise<void> {

    }

}