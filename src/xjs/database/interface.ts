import {Structure} from "../../god/database/schema/blueprint";

export type DropTableOpt = {
    ifExists: boolean | undefined
}
export default interface DBInterface {
    query(sql: string, param: any[] = []);
    execute(sql: string, param: any[] = []);
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