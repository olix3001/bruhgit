import { Command } from "commander";
import simpleGit, { SimpleGit } from "simple-git";
import signale from "signale";

export default (program: Command) => {
    program
        .command("add <files...>")
        .description('Add files to the index ("." for all)')
        .action(async (files: string) => {
            const git: SimpleGit = simpleGit(process.cwd());

            if (!(await git.checkIsRepo())) {
                signale.error("There is no repository in current directory");
                return;
            }

            git.add(files)
                .then((result) => {
                    signale.success("File(s) added successfully");
                    console.log(result);
                })
                .catch((e) => {
                    signale.error("Could not add file(s) to the index");
                    console.log(e);
                });
        });
};
