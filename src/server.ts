import { Endrun } from "./";

const PORT = process.env.PORT || 3030;

new Endrun((router, db) => [
  router.get("/products", async (req, res) => {
    const result = await db.product.findMany();
    res.json(result);
  }),
  router.post("/products", async (req, res) => {
    const result = await db.product.create({
      data: await req.body, // An error is returned because we added that path to the withoutBodyParser !
    });
    res.json(result);
  }),
],{
  searchableModels : ["Product"],
  withoutBodyParser: ["/products"]
}).startServer(PORT);
