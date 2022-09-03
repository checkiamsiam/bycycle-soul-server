const { MongoClient, ServerApiVersion } = require("mongodb");

const dbConnect = () => {
  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rpw5n.mongodb.net/?retryWrites=true&w=majority`;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  return client
};

module.exports = dbConnect ;
