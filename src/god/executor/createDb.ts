import {InitDB} from "../../xjs/mysql-xjs";

export default async function CreateDb() {
    await InitDB();
}