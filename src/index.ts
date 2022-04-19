import { program } from "commander";

// add commands
import init from "./commands/init";
init(program);

import add from "./commands/add";
add(program);

import commit from "./commands/commit";
commit(program);

// execute
program.parse();
