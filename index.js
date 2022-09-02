const express = require("express");
const cors = require("cors");
const { ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
const dbConnect = require("./utils/dbConnect");
const reviewRouter = require("./routes/reviewRoute/review.route");
const partsRouter = require("./routes/partsRoute/parts.route");
const verifyJWT = require("./middleware/verifyJWT");

app.use(cors());
app.use(express.json());

const dbClient = dbConnect();

async function run() {
  try {
    await dbClient.connect();
    
    const userCollection = await dbClient.db("Bycycle-Soul-DB").collection("users");
    const orderCollection = await dbClient.db("Bycycle-Soul-DB").collection("orders");

    app.use("/reviews", reviewRouter);

    app.use('/parts' , partsRouter)

    app.get("/users", async (req, res) => {
      const users = await userCollection.find().toArray();
      res.send(users);
    });

    app.put("/users/:email", verifyJWT, async (req, res) => {
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

    app.put("/users", verifyJWT, async (req, res) => {
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

    app.post("/users", async (req, res) => {
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

    app.post("/orders", verifyJWT, async (req, res) => {
      const postItem = await req.body;
      const result = await orderCollection.insertOne(postItem);
      return res.send({ success: true, message: "Order placed successfully" });
    });
    app.get("/orders", async (req, res) => {
      const result = await orderCollection.find().toArray();
      res.send(result);
    });

    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const deleteItem = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(deleteItem);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is Running");
});

app.listen(port);
