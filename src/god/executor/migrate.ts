import * as fs from "fs";
import path from "path";
import {CloseDB, OpenDB} from "../../xjs/mysql-xjs";

export enum MigrateState {
    Up = "up",
    Down = "down"
}

async function migrate(state: string) {
    const files = fs.readdirSync(path.join(__dirname, "/../../database/migrations"))
        .filter(file => {
            return (
                file.indexOf('.') !== 0 &&
                file.slice(-3) === '.ts'
            );
        });
    switch (state) {
        case MigrateState.Up:
            for (const file of files) {
                console.log(`running up migration: ${file}`);
                const migration = await import(path.join(__dirname, "../../database/migrations/", file));
                await migration.default.up();
            }
            break;
        case MigrateState.Down:
            for (const file of files) {
                console.log(`running up migration: ${file}`);
                const migration = await import(path.join(__dirname, "../../database/migrations/", file));
                await migration.default.down();
            }
            break;
    }
}

type ExecuteParam = {
    state: unknown
};
export default async function Execute(params: ExecuteParam) {
    if (typeof params.state == "string") {
        OpenDB();
        await migrate(params.state);
        CloseDB();
    } else {
        console.warn("state is not provided");
    }
}