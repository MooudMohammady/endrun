import { Endrun } from "./";

const PORT = process.env.PORT || 3030;

new Endrun((router, db) => [
  router.get("/products", async (req, res) => {
    const result = await db.product.findFirst();
    res.json(result);
  }),
  router.post("/", async (req, res) => {
    const result = await db.product.create({
      data: await req.body,
    });
    res.json(result);
  }),
]).startServer(PORT);
