import { Endrun } from "./";

const PORT = process.env.PORT || 3030;

new Endrun((router, db) => [
  router.get("/", (req, res) => {
    const result = db.product.findFirst();
    res.json(result);
  }),
  router.get("/", async (req, res) => {
    const result = db.product.create({
      data: await req.body,
    });
    res.json(result);
  }),
]).startServer(PORT);
