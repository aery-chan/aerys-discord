import {
    Format,
    FormatReturnObject
} from "@aery/mlc";
import * as toml from "@iarna/toml";

export class TOMLFormat implements Format {

    read(data: Buffer, default_content?: any, default_options?: null): FormatReturnObject {
        if (data) {
            return {
                content: toml.parse(data.toString()),
                defaulted: false
            };
        } else {
            if (default_content) {
                return {
                    content: default_content,
                    defaulted: true
                };
            } else {
                return {
                    content: data,
                    defaulted: false
                };
            }
        }
    }

    write(content: any): string {
        return toml.stringify(content);
    }

}