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
exports.default = (program) => {
    program
        .command("add <files...>")
        .description('Add files to the index ("." for all)')
        .action((files) => __awaiter(void 0, void 0, void 0, function* () {
        const git = (0, simple_git_1.default)(process.cwd());
        if (!(yield git.checkIsRepo())) {
            signale_1.default.error("There is no repository in current directory");
            return;
        }
        git
            .add(files)
            .then((result) => {
            signale_1.default.success("File(s) added successfully");
            console.log(result);
        })
            .catch((e) => {
            signale_1.default.error("Could not add file(s) to the index");
            console.log(e);
        });
    }));
};
