import { Hono } from "@hono/hono";
import { Index } from "./components/index.tsx";
const app = new Hono();

app.get("/", (c) => c.html(<Index />));

export default app;
