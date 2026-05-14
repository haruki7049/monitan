import { Hono } from "@hono/hono";
import { Index } from "./components/index.tsx";
import { startup } from "./startup.ts";

const app = new Hono();
const kv = await Deno.openKv();
startup(kv);

app.get("/", (c) => c.html(<Index database={kv} />));

export default app;
