import Init from "../bootstrap/bootstrap";
import {DB} from "../god/database";
import Mocker from "../xjs-lib/mocker";
import {expect, test} from "@jest/globals";

test("try insert", async () => {
    Init();
    Mocker.bindQuery(
        "SELECT * FROM db",
        [],
        [{id: 1, name: "bima"}]
    );
    const result = await DB().query("SELECT * FROM db");
    expect(result).toMatchObject([{id: 1, name: "bima"}]);
});