"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const simple_git_1 = __importDefault(require("simple-git"));
const signale_1 = __importDefault(require("signale"));
const addAll_1 = __importDefault(require("../utils/addAll"));
const chalk_1 = __importDefault(require("chalk"));
const nameSuggestion_1 = __importDefault(require("../utils/nameSuggestion"));
const inquirer_1 = __importDefault(require("inquirer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.default = (program) => {
    program
        .command("commit")
        .description("Commit changes in the index")
        .option("-A, --add", "Add all files to the index (eg. 'git add .')")
        .option("-S, --sign [key]", "Sign commit using SSH key")
        .option("-H, --header <header>", "Commit header for suggested name (works only without message option and commits uses suggestion automatically)")
        .option("-m, --message <message>", "Commit message / description")
        .action((options) => __awaiter(void 0, void 0, void 0, function* () {
        const git = (0, simple_git_1.default)(process.cwd());
        // check if repository exists
        if (!(yield git.checkIsRepo())) {
            signale_1.default.error("There is no repository in current directory");
            return;
        }
        // add files to the index
        if (options.add) {
            if (!(yield (0, addAll_1.default)())) {
                signale_1.default.error("Could not add files to the index");
                return;
            }
        }
        var message = options.message;
        if (!message) {
            var header = options.header;
            if (!options.header) {
                signale_1.default.info("You have not provided a message nor header for this commit, so here is a suggestion:");
                console.log((yield (0, nameSuggestion_1.default)()).join("\n"));
                const r = yield inquirer_1.default.prompt([
                    {
                        type: "input",
                        name: "header",
                        message: "Header for your commit ('-' to provide custom commit message, '$' for random message or empty for no custom header)",
                    },
                ]);
                header = r.header;
                if (r.header === "-") {
                    message = (yield inquirer_1.default.prompt([
                        {
                            type: "editor",
                            name: "message",
                            message: "Message for your commit",
                        },
                    ])).message;
                    header = null;
                }
                if (r.header === "$") {
                    let content = fs_1.default
                        .readFileSync(path_1.default.join(__dirname, "commit_messages.txt"))
                        .toString()
                        .split("\n");
                    header =
                        content[Math.floor(Math.random() * content.length)];
                    signale_1.default.info(`Your commit header is: ${chalk_1.default.blue(header)}`);
                }
            }
            if (header !== null) {
                message = yield (0, nameSuggestion_1.default)(header === "" ? undefined : header);
                if (message.length > 1) {
                    message = [message[0], message.slice(1).join("\n")];
                }
            }
        }
        // commit changes
        git.commit(message)
            .then((result) => {
            signale_1.default.success("Commit successful!\n");
            signale_1.default.info(`Changes:    ${chalk_1.default.yellow(result.summary.changes)}`);
            signale_1.default.info(`Insertions: ${chalk_1.default.green(result.summary.insertions)}`);
            signale_1.default.info(`Deletions:  ${chalk_1.default.red(result.summary.deletions)}`);
        })
            .catch((e) => {
            signale_1.default.error("Could not commit changes");
            console.log(e);
        });
    }));
};
