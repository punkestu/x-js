import MysqlXjs from "../../../xjs/mysql-xjs";
import Blueprint, {ColType} from "../../database/schema/blueprint";

class Schema {
    async create(name: string, builder: (table: Blueprint) => void) {
        const dbBuilder = new Blueprint();
        builder(dbBuilder);
        console.log(`--- creating table: ${name}`);
        const columns_name = Object.keys(dbBuilder.structure);
        let columns: string[] = [];
        columns_name.forEach(column_name => {
            const column = dbBuilder.structure[column_name];
            let column_str = "";
            column_str += column_name + " ";
            switch (column.type) {
                case ColType.Int:
                    column_str += "INT ";
                    break;
                case ColType.String:
                    column_str += "VARCHAR(";
                    if (column.length) {
                        column_str += `${column.length}`;
                    } else {
                        column_str += "255";
                    }
                    column_str += ") ";
                    break;
            }
            if (column.notNull) {
                column_str += "NOT NULL ";
            }
            if (column.primary) {
                column_str += "PRIMARY KEY ";
            }
            columns.push(column_str);
        })
        await MysqlXjs.execute("CREATE TABLE " + name + "(" + columns.join(",") + ")");
        console.log(`--- created table: ${name}`);
    }

    async dropIfExists(name: string) {
        console.log(`--- dropping table: ${name}`);
        await MysqlXjs.execute("DROP TABLE IF EXISTS " + name);
        console.log(`--- dropped table: ${name}`);
    }
}

export default new Schema();