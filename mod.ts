import { delay } from "https://deno.land/std@0.191.0/async/mod.ts";
import { NostrFetcher } from "nostr-fetch";
import { relayInit } from "nostr-tools";
import { publishToRelay } from "./src/relay.ts";

type MigrateEventsParams = {
  srcRelayUrls: string[];
  dstRelayUrl: string;
};

export const migrateEvents = async ({
  srcRelayUrls,
  dstRelayUrl,
}: MigrateEventsParams): Promise<void> => {
  const dstRelay = relayInit(dstRelayUrl);
  await dstRelay.connect();

  const fetcher = NostrFetcher.init();
  const iter = await fetcher.allEventsIterator(
    srcRelayUrls,
    {},
    {},
    {
      skipVerification: true,
    }
  );

  for await (const ev of iter) {
    try {
      await publishToRelay(dstRelay, ev);
    } catch (err) {
      console.error(err.message);
    }
  }

  console.log("migration finished");
  fetcher.shutdown();
  dstRelay.close();

  await delay(1000);
};
