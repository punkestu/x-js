import Yargs from "yargs";
import Execute from "./god/executor/migrate";
import CreateDb from "./god/executor/createDb";
import Init from "./bootstrap/bootstrap";
import genMigration from "./god/executor/genMigration";

Init()
Yargs
    .scriptName("xjs-lib")
    .usage("Usage: $0 <cmd> [args]")
    .command("db:migrate [state]", "Migrate on database",
        yargs => {
            return yargs.positional("state", {
                describe: "migration state",
            }).option("step", {
                alias: "s",
                describe: "step of rollback",
                type: "number",
                default: 1
            });
        },
        async args => {
            await Execute(args);
        }
    )
    .command("db:create", "Create database", () => {
    }, async () => {
        await CreateDb();
    })
    .command("make:migration [name]", "Create migration file",
        (yargs) => {
            return yargs.positional("name", {
                describe: "migration name",
                type: "string",
                demandOption: true
            });
        }, async (args) => {
            await genMigration(<string>args.name);
        })
    .help()
    .command({
        command: '*',
        handler() {
            Yargs.showHelp()
        }
    })
    .argv;
