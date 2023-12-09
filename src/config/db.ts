import dotenv from "dotenv";
import MysqlXjs from "../xjs/mysql-xjs";
dotenv.config();

export default {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || "3306",
    dbName: process.env.DB_NAME
}