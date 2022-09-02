const express = require("express");
const verifyJWT = require("../../middleware/verifyJWT");
const dbConnect = require("../../utils/dbConnect");
const jwt = require("jsonwebtoken");
const usersRouter = express.Router();

const dbClient = dbConnect();

async function run() {
  try {
    dbClient.connect();
    const userCollection = await dbClient.db("Bycycle-Soul-DB").collection("users");

    usersRouter.get("/", verifyJWT, async (req, res) => {
      const users = await userCollection.find().toArray();
      res.send(users);
    });

    usersRouter.put("/:email", verifyJWT, async (req, res) => {
      const email = await req.params.email;
      const filter = { email };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          role: "admin",
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    usersRouter.put("/", verifyJWT, async (req, res) => {
      const email = await req.query.email;
      const body = await req.body;
      const filter = { email };
      const options = { upsert: true };
      const updateDoc = {
        $set: body,
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    usersRouter.post("/", async (req, res) => {
      const postItem = await req.body;
      const query = { email: postItem.email };
      const alreadyUser = await userCollection.findOne(query);
      var token = jwt.sign(query, process.env.TOKEN_SECRET, { expiresIn: "1h" });
      if (alreadyUser) {
        return res.send({ message: "already added", accessToken: token });
      }
      const result = await userCollection.insertOne({ email: postItem.email, role: "member" });
      res.send({ accessToken: token });
    });
  } finally {
  }
}
run().catch(console.dir);

module.exports = usersRouter;
