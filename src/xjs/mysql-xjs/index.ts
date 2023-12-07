import DbConfig from "../../config/db";
import Mysql, {FieldPacket, Pool, RowDataPacket} from "mysql2";

class MysqlXjs {
    private static instance: MysqlXjs;
    private pool: Pool;

    private constructor() {
        this.pool = Mysql.createPool({
            user: DbConfig.username,
            password: DbConfig.password,
            host: DbConfig.host || "localhost",
            port: parseInt(DbConfig.port || "3306"),
            database: DbConfig.dbName
        });
    }

    query(sql: string, param: any[] = []) {
        return new Promise((resolve, reject) => {
            this.pool.query(sql, param, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            })
        });
    }

    execute(sql: string, param: any[] = []) {
        return new Promise((resolve, reject) => {
            this.pool.execute(sql, param, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            })
        });
    }

    static open() {
        if (!MysqlXjs.instance) {
            MysqlXjs.instance = new MysqlXjs();
        }
    }
    static close() {
        MysqlXjs.instance.pool.end();
    }

    static get(): MysqlXjs {
        MysqlXjs.open();
        return this.instance;
    }

    static async initDB() {
        const conn = Mysql.createConnection({
            user: DbConfig.username,
            password: DbConfig.password
        });
        conn.query(`CREATE DATABASE ${DbConfig.dbName}`);
        conn.end();
    }
}

export const InitDB = MysqlXjs.initDB;
export const OpenDB = MysqlXjs.open;
export const CloseDB = MysqlXjs.close;

export default MysqlXjs.get();