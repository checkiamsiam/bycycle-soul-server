const express = require("express");
const verifyJWT = require("../../middleware/verifyJWT");
const dbConnect = require("../../utils/dbConnect");
const reviewRouter = express.Router();

const dbClient = dbConnect();

async function run() {
  try {
    dbClient.connect();
    const reviewCollection = await dbClient.db("Bycycle-Soul-DB").collection("reviews");
    reviewRouter.get("/", async (req, res) => {
      const query = await req.query;
      const cursor = await reviewCollection.find(query);
      const reviewData = await cursor.toArray();
      const result = reviewData.reverse();
      res.send(result);
    });

    reviewRouter.post("/", verifyJWT, async (req, res) => {
      const postItem = await req.body;
      const result = await reviewCollection.insertOne(postItem);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

module.exports = reviewRouter;
