import Migration from "../../god/database/migrations/migration";
import Blueprint from "../../god/database/schema/blueprint";
import Schema from "../../god/support/facades/schema";

class CreateDb2 extends Migration {
    async up() {
        await super.up();
        await Schema.create("db2", (table: Blueprint) => {
            table.id();
            table.string("data1").maxLength(10).isNotNull();
        });
    }
    async down() {
        await super.down();
        await Schema.dropIfExists("db2");
    }
}

export default new CreateDb2();