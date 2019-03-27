import {
    Module,
    component_constructor
} from "../classes/Module";
import {
    RoleComponent,
    RoleComponentOptions
} from "../components/RoleComponent.component";

export class RoleModule extends Module<RoleComponentOptions> {

    get name(): string {
        return "Role";
    }

    get component(): component_constructor<RoleModule, RoleComponentOptions> {
        return RoleComponent;
    }

    async clean(): Promise<void> {

    }

}