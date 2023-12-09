import {DBSingleton} from "../database";

export default async function CreateDb() {
    await DBSingleton.initDB();
}