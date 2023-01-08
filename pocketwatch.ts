import * as cliffy from "https://deno.land/x/cliffy@v0.25.7/mod.ts";
import { format } from "https://deno.land/std@0.171.0/datetime/mod.ts";

function writeJson(path: string, data: object) : string {
  try {
    Deno.writeTextFileSync(path, JSON.stringify(data));
    return "Written to " + path;
  }
  catch (e) {
    return e.message;
  }
}

await new cliffy.Command()
  .name("pocketwatch")
  .version("0.1.0")
  .description("A command line time tracker written in Deno. Powered by Cliffy.io");
