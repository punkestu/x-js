import Schema from "../../support/facades/schema";

export default class Migration {
    private readonly name: string;

    constructor(name: string) {
        this.name = name;
    }

    async migrate_up() {
        await this.up();
        await Schema.migrate_up(this.name);
    }

    async migrate_down() {
        await this.down();
        await Schema.migrate_down(this.name);
    }

    async up() {
    }

    async down() {
    }
}