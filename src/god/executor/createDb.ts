import MysqlXjs from "../../xjs/mysql-xjs";

export default async function CreateDb() {
    await MysqlXjs.initDB();
}