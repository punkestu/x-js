import Yargs from "yargs";
import Execute from "./god/executor/migrate";
import CreateDb from "./god/executor/createDb";

Yargs
    .scriptName("xjs")
    .usage("Usage: $0 <cmd> [args]")
    .command("db:migrate [state]", "Migrate on database",
        yargs => {
            return yargs.positional("state", {
                describe: "migration state",
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
    .help()
    .command({
        command: '*',
        handler() {
            Yargs.showHelp()
        }
    })
    .argv;