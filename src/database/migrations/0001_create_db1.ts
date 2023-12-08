import Migration from "../../god/database/migrations/migration";
import Blueprint from "../../god/database/schema/blueprint";
import Schema from "../../god/support/facades/schema";

class m extends Migration {
    async up() {
        await Schema.create("db1", (table: Blueprint) => {
            table.id();
            table.string("data1").maxLength(10).isNotNull();
        });
    }
    async down() {
        await Schema.dropIfExists("db1");
    }
}

export default m;