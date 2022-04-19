"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
// add commands
const init_1 = __importDefault(require("./commands/init"));
(0, init_1.default)(commander_1.program);
const add_1 = __importDefault(require("./commands/add"));
(0, add_1.default)(commander_1.program);
const commit_1 = __importDefault(require("./commands/commit"));
(0, commit_1.default)(commander_1.program);
// execute
commander_1.program.parse();
