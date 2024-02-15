import { serve } from "@hono/node-server";
import { Context, Hono } from "hono";
import { readFileSync } from "fs";

const app = new Hono();

const configData = readFileSync("endrun.config.json", "utf-8");
const config = JSON.parse(configData);

config.endpoints.forEach((endpoint: { method: string; route: any }) => {
  //@ts-ignore
  app[endpoint.method.toLowerCase()](endpoint.route, (c: Context) => {
    if (c.req.method === "GET") {
      
      return c.text("hello");
    } else if (c.req.method === "POST") {
    } else if (c.req.method === "PUT") {
    } else if (c.req.method === "DELETE") {
    }

    return c.text("Endpoint is working!");
  });
});

app.get("*", (c) => {
  return c.text("404 not found!");
});

const port = 3030;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
