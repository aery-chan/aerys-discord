export abstract class Component<options, cache> {

    options: options;
    cache: cache;

    constructor(options: options, cache: cache) {
        this.options = options;
        this.cache = cache;
    }

    abstract init(guild): void

    abstract render(): (() => void)[]

}