import signale from "signale";
import simpleGit, { SimpleGit } from "simple-git";

export default async function addAll() {
	const git: SimpleGit = simpleGit(process.cwd());

	if (!(await git.checkIsRepo())) {
		return false;
	}

	const result = await git
		.add(".")
		.then((result) => {
			signale.success("File(s) added successfully");
			if (result) console.log(result);
			return true;
		})
		.catch((e) => {
			signale.error("Could not add file(s) to the index");
			console.log(e);
			return false;
		});

	return result;
}
