import DbConfig from "../../config/db";
import Mysql, {Pool, ResultSetHeader, RowDataPacket} from "mysql2/promise";
import {Attribute, ColType, Structure} from "../../god/database/schema/blueprint";
import DBInterface, {DropTableOpt, ExecResult, RowData} from "../../god/database/interface";

function generateColumn(name: string, attr: Attribute): string {
    let column_str = "";
    column_str += name + " ";
    switch (attr.type) {
        case ColType.Int:
            column_str += "INT ";
            break;
        case ColType.String:
            column_str += "VARCHAR(";
            if (attr.length) {
                column_str += `${attr.length}`;
            } else {
                column_str += "255";
            }
            column_str += ") ";
            break;
    }
    if (attr.notNull) {
        column_str += "NOT NULL ";
    }
    if (attr.primary) {
        column_str += "PRIMARY KEY ";
    }
    return column_str;
}

class MysqlXjs implements DBInterface{
    private pool: Pool;

    constructor() {
        this.pool = Mysql.createPool({
            user: DbConfig.username,
            password: DbConfig.password,
            host: DbConfig.host,
            port: parseInt(DbConfig.port || ""),
            database: DbConfig.dbName
        });
    }

    async query(sql: string, param: any[] = []): Promise<RowData[]> {
        const [result, _] = await this.pool.query<RowDataPacket[]>(sql, param);
        return result;
    }

    async execute(sql: string, param: any[] = []): Promise<ExecResult> {
        const [result] = await this.pool.execute<ResultSetHeader>(sql, param);
        return result;
    }

    async createTable(name: string, attribute: Structure): Promise<boolean> {
        const [result] = await this.pool.query<ResultSetHeader[]>(`SHOW TABLES LIKE '${name}'`);
        const columns_name = Object.keys(attribute);
        if (result.length > 0) {
            const [result] = await this.pool.query<RowDataPacket[]>(`SHOW COLUMNS FROM ${name}`);
            let updated: boolean = false;
            if (result.length != columns_name.length) {
                updated = true;
            } else {
                for (const column_name of columns_name) {
                    const column = attribute[column_name];
                    const dbColumn = result.find(col => col["Field"] === column_name);
                    if (
                        !dbColumn ||
                        (
                            dbColumn &&
                            !((column.primary === true) === (dbColumn["Key"] === "PRI"))
                        ) ||
                        (
                            dbColumn &&
                            !((column.notNull === true) === (dbColumn["Null"] === "NO"))
                        )
                    ) {
                        updated = true;
                        break;
                    }
                    switch (column.type) {
                        case ColType.String:
                            if (
                                !dbColumn["Type"].includes("varchar") ||
                                (column.length &&
                                    parseInt(dbColumn["Type"].replace(/[^0-9]/g, "")) !== column.length
                                )
                            ) {
                                updated = true;
                                break;
                            }
                            break;
                        case ColType.Int:
                            if (dbColumn["Type"] !== "int") {
                                updated = true;
                            }
                            break;
                    }
                    if (updated) {
                        break;
                    }
                }
            }
            if (updated) {
                await this.pool.execute("DROP TABLE " + name + ";");
            } else {
                return updated;
            }
        }
        let columns: string[] = [];
        columns_name.forEach(column_name => {
            const column = attribute[column_name];
            let column_str = generateColumn(column_name, column);
            columns.push(column_str);
        })
        await this.pool.execute("CREATE TABLE " + name + "(" + columns.join(",") + ");");
        return true;
    }

    async dropTable(name: string, opt: DropTableOpt | null = null) {
        if (opt && opt.ifExists) {
            await this.pool.execute("DROP TABLE IF EXISTS " + name + ";");
        }
    }

    async initDB() {
        const conn = await Mysql.createConnection({
            user: DbConfig.username,
            password: DbConfig.password
        });
        try {
            const [result] = await conn.query<ResultSetHeader[]>(`SHOW DATABASES LIKE '${DbConfig.dbName}'`);
            if (result.length === 0) {
                console.log(`=== creating database ${DbConfig.dbName}`);
                await conn.query(`CREATE DATABASE ${DbConfig.dbName}`);
            } else {
                console.log(`=== database ${DbConfig.dbName} was created`);
            }
        } catch (err) {
            console.error(err);
        }
        await conn.end();
    }

    async initMigration() {
        try {
            const [result] = await this.pool.query<ResultSetHeader[]>(`SHOW TABLES LIKE 'xjs_migrations'`);
            if (result.length === 0) {
                console.log(`=== creating table migrations`);
                await this.pool.query("CREATE TABLE " +
                    `xjs_migrations (` +
                    "migration VARCHAR(255) NOT NULL UNIQUE," +
                    "batch INT NOT NULL," +
                    "createdAt TIMESTAMP DEFAULT NOW()" +
                    ")");
            }
        } catch (err) {
            console.error(err);
        }
    }

    async getLastBatch(): Promise<number> {
        const [result] = await this.pool.query<RowDataPacket[]>("SELECT IFNULL(MAX(batch),0) + 1 as last_batch FROM xjs_migrations")
        return result[0]["last_batch"];
    }

    async trackMigration(name: string, batch: number) {
        await this.pool.execute("INSERT INTO xjs_migrations VALUES (?, ?, DEFAULT)\n" +
            "ON DUPLICATE KEY UPDATE batch = ?, createdAt = NOW();", [name, batch, batch]);
    }

    async dropMigration(name: string) {
        await this.pool.execute("DELETE FROM xjs_migrations WHERE migration=?", [
            name
        ]);
    }

    async getLastMigration() {
        const [result] = await this.pool.query<RowDataPacket[]>("SELECT migration FROM xjs_migrations ORDER BY createdAt DESC, migration DESC");
        return result;
    }

    async close() {
        await this.pool.end();
    }
}

export default MysqlXjs;