import dotenv from "dotenv";
dotenv.config();

export default {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || "3306",
    dbName: process.env.DB_NAME
}