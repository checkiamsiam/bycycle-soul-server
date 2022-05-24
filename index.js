const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config()

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rpw5n.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  try {
    await client.connect();
    const reviewCollection = await client.db("Bycycle-Soul-DB").collection("reviews")

    app.get('/reviews', async (req, res) => {
      const query = await req.query;
      const cursor = await reviewCollection.find(query)
      const result = await cursor.toArray();
      res.send(result);
    })

  } finally {

  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Server is Running')
})


app.listen(port)