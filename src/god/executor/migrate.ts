import * as fs from "fs";
import path from "path";
import {DB, DBSingleton} from "../database";

export enum MigrateState {
    Up = "up",
    Down = "down",
    Rollback = "rollback"
}

async function migrate(state: string, step: number = 1) {
    await DBSingleton.initMigration();
    const files = fs.readdirSync(path.join(__dirname, "/../../database/migrations"))
        .filter(file => {
            return (
                file.indexOf('.') !== 0 &&
                file.slice(-3) === '.ts'
            );
        });
    if (state === MigrateState.Rollback) {
        console.log("rollback last migration");
        const lastMigrations = await DBSingleton.get().getLastMigration();
        if (lastMigrations.length > 0) {
            for (const lastMigration of lastMigrations.slice(0, step)) {
                const file: string = lastMigration["migration"];
                const migration = await import(path.join(__dirname, "../../database/migrations/", file + ".ts"));
                const migrator = new migration.default(file);
                console.log(`=== rollback ${file}`);
                await migrator.migrate_down();
            }
        }
        return;
    }
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
    state: unknown,
    step: number | undefined
};
export default async function Execute(params: ExecuteParam) {
    if (typeof params.state == "string") {
        await migrate(params.state, params.step);
        await DB().close();
    } else {
        console.warn("state is not provided");
    }
}