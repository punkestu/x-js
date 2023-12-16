import DBInterface, {DropTableOpt, ExecResult, RowData} from "../../god/database/interface";
import {Structure} from "../../god/database/schema/blueprint";

type CommandList<T> = {
    [command: string]: [{
        params: any[],
        result: T
    }]
}

class Mocker implements DBInterface {
    private static queryCommands: CommandList<RowData[]> = {};
    private static execCommands: CommandList<ExecResult> = {};

    static bindQuery(command: string, params: any[] = [], result: RowData[]) {
        if (this.queryCommands[command]) {
            this.queryCommands[command].push({
                params,
                result
            });
        } else {
            this.queryCommands[command] = [{
                params,
                result
            }];
        }
    }

    static bindExecute(command: string, params: any[] = [], result: ExecResult) {
        this.execCommands[command].push({
            params,
            result
        });
    }

    static cleanUp() {
        this.queryCommands = {};
        this.execCommands = {};
    }

    close() {
    }

    createTable(name: string, attribute: Structure): Promise<boolean> {
        return Promise.resolve(false);
    }

    dropMigration(name: string) {
    }

    dropTable(name: string, opt?: DropTableOpt | null) {
    }

    getLastBatch(): Promise<number> {
        return Promise.resolve(0);
    }

    getLastMigration() {
    }

    initDB() {
    }

    initMigration() {
    }

    trackMigration(name: string, batch: number) {
    }


    async query(sql: string, param: any[] = []): Promise<RowData[]> {
        const command = Mocker.queryCommands[sql]
            .find(
                command =>
                    JSON.stringify(command.params) === JSON.stringify(param)
            );
        if (!command) {
            throw new Error("command not bound");
        }
        return command.result;
    }

    async execute(sql: string, param: any[] = []): Promise<ExecResult> {
        const command = Mocker.execCommands[sql]
            .find(
                command =>
                    JSON.stringify(command.params) === JSON.stringify(param)
            );
        if (!command) {
            throw new Error("command not bound");
        }
        return command.result;
    }
}

export default Mocker;