import * as modules from "./modules";

async function main(): Promise<void> {
    await modules.load();
    console.log(modules.modules);
}

main();