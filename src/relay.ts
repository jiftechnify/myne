import { delay } from "https://deno.land/std@0.191.0/async/mod.ts";
import { NostrEvent } from "nostr-fetch";
import { Relay } from "nostr-tools";

export const publishToRelay = (relay: Relay, ev: NostrEvent): Promise<void> => {
  const p = new Promise<void>((resolve, reject) => {
    const pub = relay.publish(ev);
    pub.on("ok", () => {
      resolve();
    });
    pub.on("failed", (reason: string) => {
      reject(Error(`failed to publish: ${ev.id} reason=${reason}`));
    });
  });
  return Promise.race([p, delay(1000).then(() => Promise.reject("timeout!"))]);
};
