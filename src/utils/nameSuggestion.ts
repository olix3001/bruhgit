import signale from "signale";
import simpleGit, { SimpleGit } from "simple-git";

export default async function generate(header?: string) {
	const git: SimpleGit = simpleGit(process.cwd());

	if (!(await git.checkIsRepo())) {
		return [];
	}

	var message: string[] = [];
	if (header) message.push(header);

	// initial commit
	if (
		await git
			.log({ maxCount: 1 })
			.then(() => false)
			.catch(() => true)
	) {
		message.push("🎉 Initial commit");
	}

	// added files
	const addedFiles = (await git.status()).created;
	if (addedFiles.length <= 3) {
		for (let file of addedFiles) {
			message.push(`➕ Created ${file}`);
		}
	} else {
		if (addedFiles.length != 0)
			message.push(`➕ Created ${addedFiles.length} files`);
	}

	// changed files
	const changedFiles = (await git.status()).modified;
	if (changedFiles.length <= 3) {
		for (let file of changedFiles) {
			message.push(`🔨 Changed ${file}`);
		}
	} else {
		if (changedFiles.length != 0)
			message.push(`🔨 Changed ${changedFiles.length} files`);
	}

	// removed files
	const removedFiles = (await git.status()).deleted;
	if (removedFiles.length <= 3) {
		for (let file of removedFiles) {
			message.push(`➖ Removed ${file}`);
		}
	} else {
		if (removedFiles.length != 0)
			message.push(`➖ Removed ${removedFiles.length} files`);
	}

	// renamed files
	const renamedFiles = (await git.status()).renamed;
	if (renamedFiles.length <= 3) {
		for (let file of renamedFiles) {
			message.push(`🏷️ Renamed ${file.from} to ${file.to}`);
		}
	} else {
		if (renamedFiles.length != 0)
			message.push(`🏷️ Renamed ${renamedFiles.length} files`);
	}

	return message;
}
