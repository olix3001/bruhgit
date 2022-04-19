import { Command } from "commander";
import path from "path";
import simpleGit, { SimpleGit } from "simple-git";
import signale from "signale";
import fs from "fs";
import { sign } from "crypto";
import chalk from "chalk";

export default (program: Command) => {
	program
		.command("init [dir]")
		.description("Initialize new git repository here or in specified directory")
		.option("-t, --template <name>", "Template for .gitignore")
		.action(async (dir: string, options: { template?: string }) => {
			dir = dir ? path.join(process.cwd(), dir) : process.cwd();

			const git: SimpleGit = simpleGit(dir);

			if (await git.checkIsRepo()) {
				signale.error("There is already a repository in this directory");
				return;
			}

			if (options.template === "list") {
				signale.info("Available templates are:");
				console.log(
					fs.readdirSync(path.join(__dirname, "init-templates")).join(", ")
				);
				return;
			}

			if (options.template) {
				if (
					fs
						.readdirSync(path.join(__dirname, "init-templates"))
						.includes(options.template)
				) {
					if (fs.existsSync(path.join(dir, ".gitignore"))) {
						signale.warn(
							"Could not create the .gitignore file because it already exists"
						);
					} else {
						fs.copyFileSync(
							path.join(__dirname, "init-templates", options.template),
							path.join(dir, ".gitignore")
						);
						signale.success(
							`Created .gitignore from template ${chalk.yellow(
								options.template
							)}`
						);
					}
				}
			}

			git
				.init()
				.then(() => {
					signale.success("Created new git repository");
				})
				.catch((e) => {
					signale.error("Could not initialize new git repository");
					console.log(e);
				});
		});
};
