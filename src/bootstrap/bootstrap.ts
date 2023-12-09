import {DBSingleton} from "../god/database";
import MysqlXjs from "../xjs/mysql-xjs";

export default function Init() {
    DBSingleton.open(new MysqlXjs());
}
