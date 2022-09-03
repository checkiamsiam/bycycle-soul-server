const express = require("express");
const verifyJWT = require("../../middleware/verifyJWT");
const dbConnect = require("../../utils/dbConnect");
const partsRouter = express.Router();

const dbClient = dbConnect();

async function run() {
  try {
    dbClient.connect();
    const partsCollection = await dbClient.db("Bycycle-Soul-DB").collection("Parts");

    partsRouter.post("/", verifyJWT, async (req, res) => {
      const postItem = await req.body;
      const result = await partsCollection.insertOne(postItem);
      res.send(result);
    });

    partsRouter.get("/", async (req, res) => {
      const query = await req.query;
      const cursor = await partsCollection.find(query);
      const results = await cursor.toArray();
      res.send(results);
    });
    partsRouter.get("/reverse", async (req, res) => {
      const query = await req.query;
      const cursor = await partsCollection.find(query);
      const partsData = await cursor.toArray();
      const results = partsData.reverse();
      res.send(results);
    });

    
  } finally {
  }
}
run().catch(console.dir);

module.exports = partsRouter;
