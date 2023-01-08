import { colors } from "https://deno.land/x/cliffy@v0.25.7/ansi/colors.ts";
import { Command } from "https://deno.land/x/cliffy@v0.25.7/command/mod.ts";
import { Table } from "https://deno.land/x/cliffy@v0.25.7/table/mod.ts";
import { Input, Confirm, Number, prompt } from "https://deno.land/x/cliffy@v0.25.7/prompt/mod.ts";


// Define cliffy ansi theme
const header = colors.bold.underline;
const error = colors.bold.red;
const info = colors.bold.blue;

let projects : Record<string, unknown>;
try {
  const projects_json = await Deno.readTextFile("./projects.json");
  projects = JSON.parse(projects_json);
}
catch (e) {
  console.log(error("[[ERROR]]"), e.message);
  console.log(info("[[INFO]]"), "Creating projects.json...");
  writeJson("./projects.json", {});
  console.log(info("[[INFO]]"), "Run pocketwatch again and everything should work!");
}

if (projects) {
  console.log(header("pocketwatch"));
  const result = await prompt([
    {
      name: "new_project",
      type: Input,
      message: "Create a new project: ",
      before: async({ new_project }, next) => {
        if (Object.keys(projects).length != 0) {
          await next("menu_option");
        }
        else { await next(); }
      },
      after: async({ new_project }, next) => {
        const path = new_project.replace(/\s+/, '').toLowerCase(); 
        console.log({path});
        if (projects.hasOwnProperty(path)) {
          console.log(error("[[ERROR]]"), "Already used as project name")
          await next("new_project");
        }
        else {
          console.log({new_project});
          projects[`${path}`] = new_project;
          writeJson("./projects.json", projects);
          await next("menu_option");
        }
      },
    },
    {
      name: "menu_option",
      type: Input,
      message: "Which project: ",
      before: async({ menu_option }, next) => {
        console.clear();
        console.log(header("pocketwatch"));
        displayJson(projects);
        await next();
      },
      after: async({ menu_option }, next) => {
        console.log("You chose", colors.bold.yellow(menu_option));
      },
    }
  ]);
}

function writeJson(path : string, data: object) {
  try {
    Deno.writeTextFileSync(path, JSON.stringify(data));
    console.log(info("Written to " + path));
  }
  catch (e) {
    console.log(error(e.message));
    console.log(error("Program will stop"));
  }
}

function displayJson(data : object) {
  const table : Table = new Table();
  Object.keys(data).forEach( key => {
    table.push([key, data[key]]);
  });
  console.log(table.toString());
}

await new Command()
  .name("pocketwatch")
  .version("0.1.1")
  .description("A Deno CLI time tracker. Powered by Cliffy.io")
  .parse(Deno.args);
