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
function generate(header) {
    return __awaiter(this, void 0, void 0, function* () {
        const git = (0, simple_git_1.default)(process.cwd());
        if (!(yield git.checkIsRepo())) {
            return [];
        }
        var message = [];
        if (header)
            message.push(header);
        // initial commit
        if (yield git
            .log({ maxCount: 1 })
            .then(() => false)
            .catch(() => true)) {
            message.push("🎉 Initial commit");
        }
        // added files
        const addedFiles = (yield git.status()).created;
        if (addedFiles.length <= 3) {
            for (let file of addedFiles) {
                message.push(`➕ Created ${file}`);
            }
        }
        else {
            if (addedFiles.length != 0)
                message.push(`➕ Created ${addedFiles.length} files`);
        }
        // changed files
        const changedFiles = (yield git.status()).modified;
        if (changedFiles.length <= 3) {
            for (let file of changedFiles) {
                message.push(`🔨 Changed ${file}`);
            }
        }
        else {
            if (changedFiles.length != 0)
                message.push(`🔨 Changed ${changedFiles.length} files`);
        }
        // removed files
        const removedFiles = (yield git.status()).deleted;
        if (removedFiles.length <= 3) {
            for (let file of removedFiles) {
                message.push(`➖ Removed ${file}`);
            }
        }
        else {
            if (removedFiles.length != 0)
                message.push(`➖ Removed ${removedFiles.length} files`);
        }
        // renamed files
        const renamedFiles = (yield git.status()).renamed;
        if (renamedFiles.length <= 3) {
            for (let file of renamedFiles) {
                message.push(`🏷️ Renamed ${file.from} to ${file.to}`);
            }
        }
        else {
            if (renamedFiles.length != 0)
                message.push(`🏷️ Renamed ${renamedFiles.length} files`);
        }
        return message;
    });
}
exports.default = generate;
