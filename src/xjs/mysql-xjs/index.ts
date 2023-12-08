import DbConfig from "../../config/db";
import Mysql, {Pool, ResultSetHeader} from "mysql2/promise";

class MysqlXjs {
    private static instance: MysqlXjs;
    private pool: Pool;

    private constructor() {
        this.pool = Mysql.createPool({
            user: DbConfig.username,
            password: DbConfig.password,
            host: DbConfig.host,
            port: parseInt(DbConfig.port || ""),
            database: DbConfig.dbName
        });
    }

    query(sql: string, param: any[] = []) {
        return this.pool.query(sql, param);
    }

    execute(sql: string, param: any[] = []) {
        return this.pool.execute(sql, param);
    }

    static open() {
        if (!MysqlXjs.instance) {
            MysqlXjs.instance = new MysqlXjs();
        }
    }

    static async close() {
        await MysqlXjs.instance.pool.end();
    }

    static get(): MysqlXjs {
        MysqlXjs.open();
        return this.instance;
    }

    static async initDB() {
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

    static async initMigration() {
        try {
            const [result] = await MysqlXjs.instance.pool.query<ResultSetHeader[]>(`SHOW TABLES LIKE 'xjs_migrations'`);
            if (result.length === 0) {
                console.log(`=== creating table migrations`);
                await MysqlXjs.instance.pool.query("CREATE TABLE " +
                    `xjs_migrations (` +
                    "migration VARCHAR(255) NOT NULL," +
                    "batch INT NOT NULL" +
                    ")");
            } else {
                console.log(`=== table migrations was created`);
            }
        } catch (err) {
            console.error(err);
        }
    }
}

export const Context = MysqlXjs.get();
export default MysqlXjs;