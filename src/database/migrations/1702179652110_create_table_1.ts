import Migration from "../../god/database/migrations/migration";
import Blueprint from "../../god/database/schema/blueprint";
import Schema from "../../god/support/facades/schema";

class m extends Migration {
    async up() {
        await Schema.create("table_1", (table: Blueprint) => {
            table.id();
        });
    }

    async down() {
        await Schema.dropIfExists("table_1");
    }
}

export default m;