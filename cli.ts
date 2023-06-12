import Ask from "https://deno.land/x/ask@1.0.6/mod.ts";
import { Command } from "https://deno.land/x/cliffy@v0.25.7/mod.ts";
import { migrateEvents } from "./mod.ts";

const {
  options: { src, dst },
} = await new Command()
  .name("myne")
  .version("0.0.0")
  .description("Migrate Your Nostr Events from relay to relay")
  .option(
    "-s, --src <relay-url:string[]>",
    "source relay URLs, separated by comma",
    { required: true }
  )
  .option("-d, --dst <relay-url:string>", "destination relay URL", {
    required: true,
  })
  .parse(Deno.args);

console.log("Source:", src.join(", "));
console.log("Destination:", dst);

const ask = new Ask();
const { proceed } = await ask.confirm({
  type: "confirm",
  name: "proceed",
  message: "Are you sure you want to proceed?",
});
if (!proceed) {
  console.error("aborting");
  Deno.exit(1);
}

await migrateEvents({ srcRelayUrls: src, dstRelayUrl: dst });

Deno.exit(0);
