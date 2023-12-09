import DBInterface from "../../xjs/database/interface";

class Database {
    private static instance: DBInterface;
    static open(context: DBInterface) {
        if (!this.instance) {
            this.instance = context;
        }
    }

    static async close() {
        await this.instance.close();
    }

    static get(): DBInterface {
        return this.instance;
    }

    static async initDB() {
        await this.instance.initDB();
    }

    static async initMigration() {
        await this.instance.initMigration();
    }
}

export const DBSingleton = Database;
export const DB = () => Database.get();