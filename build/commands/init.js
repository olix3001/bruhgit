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
const path_1 = __importDefault(require("path"));
const simple_git_1 = __importDefault(require("simple-git"));
const signale_1 = __importDefault(require("signale"));
const fs_1 = __importDefault(require("fs"));
const chalk_1 = __importDefault(require("chalk"));
exports.default = (program) => {
    program
        .command("init [dir]")
        .description("Initialize new git repository here or in specified directory")
        .option("-t, --template <name>", "Template for .gitignore")
        .action((dir, options) => __awaiter(void 0, void 0, void 0, function* () {
        dir = dir ? path_1.default.join(process.cwd(), dir) : process.cwd();
        const git = (0, simple_git_1.default)(dir);
        if (yield git.checkIsRepo()) {
            signale_1.default.error("There is already a repository in this directory");
            return;
        }
        if (options.template === "list") {
            signale_1.default.info("Available templates are:");
            console.log(fs_1.default
                .readdirSync(path_1.default.join(__dirname, "init-templates"))
                .join(", "));
            return;
        }
        if (options.template) {
            if (fs_1.default
                .readdirSync(path_1.default.join(__dirname, "init-templates"))
                .includes(options.template)) {
                if (fs_1.default.existsSync(path_1.default.join(dir, ".gitignore"))) {
                    signale_1.default.warn("Could not create the .gitignore file because it already exists");
                }
                else {
                    fs_1.default.copyFileSync(path_1.default.join(__dirname, "init-templates", options.template), path_1.default.join(dir, ".gitignore"));
                    signale_1.default.success(`Created .gitignore from template ${chalk_1.default.yellow(options.template)}`);
                }
            }
        }
        git.init()
            .then(() => {
            signale_1.default.success("Created new git repository");
        })
            .catch((e) => {
            signale_1.default.error("Could not initialize new git repository");
            console.log(e);
        });
    }));
};
