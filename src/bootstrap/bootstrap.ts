import {DBSingleton} from "../god/database";
import MysqlXjs from "../xjs-lib/mysql-xjs";

export default function Init() {
    DBSingleton.open(new MysqlXjs());
}
