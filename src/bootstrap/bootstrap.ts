import {DBSingleton} from "../god/database";
import MysqlXjs from "../xjs-lib/mysql-xjs";
import Mocker from "../xjs-lib/mocker";

export default function Init() {
    if (process.env.NODE_ENV === 'test') {
        DBSingleton.open(new Mocker());
        return;
    }
    DBSingleton.open(new MysqlXjs());
}
