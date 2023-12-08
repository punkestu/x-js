import {Context as DB} from "../../../xjs/mysql-xjs";
import Blueprint, {Attribute, ColType} from "../../database/schema/blueprint";

function generateColumn(name: string, attr: Attribute): string {
    let column_str = "";
    column_str += name + " ";
    switch (attr.type) {
        case ColType.Int:
            column_str += "INT ";
            break;
        case ColType.String:
            column_str += "VARCHAR(";
            if (attr.length) {
                column_str += `${attr.length}`;
            } else {
                column_str += "255";
            }
            column_str += ") ";
            break;
    }
    if (attr.notNull) {
        column_str += "NOT NULL ";
    }
    if (attr.primary) {
        column_str += "PRIMARY KEY ";
    }
    return column_str;
}

class Schema {
    async create(name: string, builder: (table: Blueprint) => void) {
        const dbBuilder = new Blueprint();
        builder(dbBuilder);
        const columns_name = Object.keys(dbBuilder.structure);
        let columns: string[] = [];
        columns_name.forEach(column_name => {
            const column = dbBuilder.structure[column_name];
            let column_str = generateColumn(column_name, column);
            columns.push(column_str);
        })
        console.log(`--- creating table: ${name}`);
        await DB.execute("CREATE TABLE " + name + "(" + columns.join(",") + ");");
    }

    async dropIfExists(name: string) {
        console.log(`--- dropping table: ${name}`);
        await DB.execute("DROP TABLE IF EXISTS " + name + ";");
    }
}

export default new Schema();