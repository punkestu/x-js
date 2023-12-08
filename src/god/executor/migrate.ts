import * as fs from "fs";
import path from "path";
import MysqlXjs from "../../xjs/mysql-xjs";

export enum MigrateState {
    Up = "up",
    Down = "down"
}

async function migrate(state: string) {
    await MysqlXjs.initMigration();
    const files = fs.readdirSync(path.join(__dirname, "/../../database/migrations"))
        .filter(file => {
            return (
                file.indexOf('.') !== 0 &&
                file.slice(-3) === '.ts'
            );
        });
    for (const file of files) {
        const migration = await import(path.join(__dirname, "../../database/migrations/", file));
        const migrator = new migration.default(file.slice(0, -3));
        switch (state) {
            case MigrateState.Up:
                console.log(`running up migration: ${file.slice(0, -3)}`);
                await migrator.migrate_up();
                break;
            case MigrateState.Down:
                console.log(`running down migration: ${file.slice(0, -3)}`);
                await migrator.migrate_down();
                break;
        }
    }
}

type ExecuteParam = {
    state: unknown
};
export default async function Execute(params: ExecuteParam) {
    if (typeof params.state == "string") {
        await MysqlXjs.open();
        await migrate(params.state);
        await MysqlXjs.close();
    } else {
        console.warn("state is not provided");
    }
}