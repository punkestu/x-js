import {Structure} from "./schema/blueprint";

export type DropTableOpt = {
    ifExists: boolean | undefined
}

export type RowData = {
    [columnName: string]: any
}

export type ExecResult = {
    affectedRows: number;
    fieldCount: number;
    info: string;
    insertId: number;
    serverStatus: number;
    warningStatus: number;
}

export default interface DBInterface {
    query(sql: string, param: any[] = []): Promise<RowData[]>;

    execute(sql: string, param: any[] = []): Promise<ExecResult>;

    createTable(name: string, attribute: Structure): Promise<boolean>;

    dropTable(name: string, opt: DropTableOpt | null = null);

    trackMigration(name: string, batch: number);

    dropMigration(name: string);

    getLastBatch(): Promise<number>;

    getLastMigration();

    close();

    initDB();

    initMigration();
}