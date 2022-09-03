const express = require("express");
const verifyJWT = require("../../middleware/verifyJWT");
const dbConnect = require("../../utils/dbConnect");
const { ObjectId } = require("mongodb");
const orderRouter = express.Router();

const dbClient = dbConnect();

async function run() {
  try {
    dbClient.connect();
    const orderCollection = await dbClient.db("Bycycle-Soul-DB").collection("orders");

    orderRouter.post("/", verifyJWT, async (req, res) => {
      const postItem = await req.body;
      const result = await orderCollection.insertOne(postItem);
      return res.send({ success: true, message: "Order placed successfully" });
    });
    orderRouter.get("/", async (req, res) => {
      const result = await orderCollection.find().toArray();
      res.send(result);
    });

    orderRouter.delete("/:id", async (req, res) => {
      const id = req.params.id;
      const deleteItem = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(deleteItem);
      res.send(result);
    });

    
  } finally {
  }
}
run().catch(console.dir);

module.exports = orderRouter;
