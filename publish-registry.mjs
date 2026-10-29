// Publish server.json to the official MCP Registry as rentals.slipstream/*.
// Proves the domain with the ed25519 key whose public half is served at
// https://slipstream.rentals/.well-known/mcp-registry-auth. The private key
// lives in ~/.config/slipstream/mcp-registry-ed25519.key, never in a repo.
// Same exchange as `mcp-publisher login http` + `mcp-publisher publish`.
import { createPrivateKey, sign } from "node:crypto";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";

const REGISTRY = "https://registry.modelcontextprotocol.io/";
const seed = Buffer.from(readFileSync(`${homedir()}/.config/slipstream/mcp-registry-ed25519.key`, "utf8").trim(), "hex");
const key = createPrivateKey({ key: Buffer.concat([Buffer.from("302e020100300506032b657004220420", "hex"), seed]), format: "der", type: "pkcs8" });
const timestamp = new Date().toISOString().replace(/\.\d+Z$/, "Z");
const signed_timestamp = sign(null, Buffer.from(timestamp), key).toString("hex");

const auth = await fetch(REGISTRY + "v0/auth/http", {
  method: "POST",
  headers: { "content-type": "application/json", accept: "application/json" },
  body: JSON.stringify({ domain: "slipstream.rentals", timestamp, signed_timestamp }),
});
if (!auth.ok) throw new Error(`auth ${auth.status}: ${await auth.text()}`);
const { registry_token } = await auth.json();

const res = await fetch(REGISTRY + "v0/publish", {
  method: "POST",
  headers: { "content-type": "application/json", authorization: `Bearer ${registry_token}` },
  body: readFileSync(new URL("./server.json", import.meta.url)),
});
console.log("publish", res.status, (await res.text()).slice(0, 800));
