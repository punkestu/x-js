import Schema from "../../support/facades/schema";
import MysqlXjs from "../../../xjs/mysql-xjs";

export default class Migration {
    private name: string;

    constructor(name: string) {
        this.name = name;
    }

    async migrate_up() {
        //     TODO track migration data
        await this.up();
    }

    async migrate_down() {
        //     TODO track migration data
        await this.down();
    }

    async up() {
    }

    async down() {
    }
}