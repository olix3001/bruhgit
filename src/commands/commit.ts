import { Command } from "commander";
import simpleGit, { SimpleGit } from "simple-git";
import signale from "signale";
import addAll from "../utils/addAll";
import chalk from "chalk";
import nameSuggestion from "../utils/nameSuggestion";
import inquirer from "inquirer";
import fs from "fs";
import path from "path";

export default (program: Command) => {
    program
        .command("commit")
        .description("Commit changes in the index")
        .option("-A, --add", "Add all files to the index (eg. 'git add .')")
        .option("-S, --sign [key]", "Sign commit using SSH key")
        .option(
            "-H, --header <header>",
            "Commit header for suggested name (works only without message option and commits uses suggestion automatically)"
        )
        .option("-m, --message <message>", "Commit message / description")
        .action(async (options: any) => {
            const git: SimpleGit = simpleGit(process.cwd());

            // check if repository exists
            if (!(await git.checkIsRepo())) {
                signale.error("There is no repository in current directory");
                return;
            }

            // add files to the index
            if (options.add) {
                if (!(await addAll())) {
                    signale.error("Could not add files to the index");
                    return;
                }
            }

            var message = options.message;

            if (!message) {
                var header = options.header;
                if (!options.header) {
                    signale.info(
                        "You have not provided a message nor header for this commit, so here is a suggestion:"
                    );
                    console.log((await nameSuggestion()).join("\n"));

                    const r = await inquirer.prompt([
                        {
                            type: "input",
                            name: "header",
                            message:
                                "Header for your commit ('-' to provide custom commit message, '$' for random message or empty for no custom header)",
                        },
                    ]);

                    header = r.header;

                    if (r.header === "-") {
                        message = (
                            await inquirer.prompt([
                                {
                                    type: "editor",
                                    name: "message",
                                    message: "Message for your commit",
                                },
                            ])
                        ).message;
                        header = null;
                    }

                    if (r.header === "$") {
                        let content = fs
                            .readFileSync(
                                path.join(__dirname, "commit_messages.txt")
                            )
                            .toString()
                            .split("\n");
                        message =
                            content[Math.floor(Math.random() * content.length)];
                        header = null;
                    }
                }

                if (header !== null) {
                    message = await nameSuggestion(
                        header === "" ? undefined : header
                    );

                    if (message.length > 1) {
                        message = [message[0], message.slice(1).join("\n")];
                    }
                }
            }

            // commit changes
            git.commit(message)
                .then((result) => {
                    signale.success("Commit successful!\n");

                    signale.info(
                        `Changes:    ${chalk.yellow(result.summary.changes)}`
                    );
                    signale.info(
                        `Insertions: ${chalk.green(result.summary.insertions)}`
                    );
                    signale.info(
                        `Deletions:  ${chalk.red(result.summary.deletions)}`
                    );
                })
                .catch((e) => {
                    signale.error("Could not commit changes");
                    console.log(e);
                });
        });
};
