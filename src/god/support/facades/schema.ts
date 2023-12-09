import Blueprint from "../../database/schema/blueprint";
import {DB} from "../../database";

class Schema {
    private updated: boolean = false;
    private batch: number = 0;
    constructor() {
        DB().getLastBatch().then(batch=>this.batch = batch);
    }

    async migrate_up(name: string) {
        if (this.updated) {
            await DB().trackMigration(name, this.batch);
        } else {
            console.log(`--- ${name} is up to date`);
        }
        this.updated = false;
    }

    async migrate_down(name: string) {
        await DB().dropMigration(name);
    }

    async create(name: string, builder: (table: Blueprint) => void) {
        const dbBuilder = new Blueprint();
        builder(dbBuilder);
        this.updated = await DB().createTable(name, dbBuilder.structure);
        if (this.updated) {
            console.log(`--- created table: ${name}`);
        }
    }

    async dropIfExists(name: string) {
        console.log(`--- dropping table: ${name}`);
        await DB().dropTable(name, {ifExists: true});
    }
}

export default new Schema();