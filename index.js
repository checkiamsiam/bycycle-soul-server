const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config()
const jwt = require('jsonwebtoken');

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rpw5n.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: 'UnAuthorized access' });
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: 'Forbidden access' })
    }
    req.decoded = decoded;
    next();
  });
}


async function run() {
  try {
    await client.connect();
    const reviewCollection = await client.db("Bycycle-Soul-DB").collection("reviews")
    const partsCollection = await client.db("Bycycle-Soul-DB").collection("Parts")
    const userCollection =  await client.db('Bycycle-Soul-DB').collection('users');
    const orderCollection =  await client.db('Bycycle-Soul-DB').collection('orders');


    app.get('/reviews', async (req, res) => {
      const query = await req.query;
      const cursor = await reviewCollection.find(query)
      const reviewData = await cursor.toArray();
      const result = reviewData.reverse();
      res.send(result);
    })

    app.post('/reviews', verifyJWT , async (req, res) => {
     const postItem = await req.body;
     const result = await reviewCollection.insertOne(postItem);
      res.send(result)
    })

    app.post('/parts', verifyJWT , async (req, res) => {
     const postItem = await req.body;
     const result = await partsCollection.insertOne(postItem);
      res.send(result)
    })

    app.get('/parts', async (req, res) => {
      const query = await req.query;
      const cursor = await partsCollection.find(query)
      const results = await cursor.toArray();
      res.send(results);
    })
    app.get('/partsLatest', async (req, res) => {
      const query = await req.query;
      const cursor = await partsCollection.find(query)
      const partsData = await cursor.toArray();
      const results = partsData.reverse();
      res.send(results);
    })

    

    app.get('/users', verifyJWT, async (req, res) => {
      const users = await userCollection.find().toArray()
      res.send(users)
    })

    
    app.put('/users/:email', verifyJWT, async (req, res) => {
      const email = await req.params.email
      const filter = { email };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          role: 'admin'
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result)
    })
    
    app.put('/users', verifyJWT, async (req, res) => {
      const email = await req.query.email
      const body = await req.body
      const filter = { email };
      const options = { upsert: true };
      const updateDoc = {
        $set: body
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result)
    })
    
    app.post('/users', async (req, res) => {
      const postItem = await req.body;
      const query = { email: postItem.email };
      const alreadyUser = await userCollection.findOne(query);
      var token = jwt.sign(query, process.env.TOKEN_SECRET, { expiresIn: '1h' });
      if (alreadyUser) {
        return res.send({ message: 'already added', accessToken: token })
      }
      const result = await userCollection.insertOne({ email: postItem.email, role: 'member' });
      res.send({ accessToken: token })
    })

    app.post('/orders', verifyJWT , async (req, res) => {
      const postItem = await req.body;
      const result = await orderCollection.insertOne(postItem)
      return res.send({ success: true, message: 'Order placed successfully' })
    })

  } finally {

  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Server is Running')
})


app.listen(port)