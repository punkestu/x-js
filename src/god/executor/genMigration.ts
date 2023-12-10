import {renderFile} from "ejs";
import path from "path";
import * as fs from "fs";

export default async function genMigration(name: string) {
    const fileExists = fs.readdirSync(path.join(__dirname, `/../../database/migrations`)).find(file => name.toLowerCase().replace(/[$-/:-?{-~!"^_`\[\] ]/, '_') === file.slice(14, -3));
    if (fileExists) {
        console.log("migration is exists");
        return;
    }
    const fileName = `${Date.now()}_${name.toLowerCase().replace(/[$-/:-?{-~!"^_`\[\] ]/g, '_')}.ts`;
    fs.writeFileSync(path.join(__dirname, `/../../database/migrations/${fileName}`), await renderFile(path.join(__dirname, "/../templates/migration.ejs"), {}, {}));
    console.log("migration is created");
}