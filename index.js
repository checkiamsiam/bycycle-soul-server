const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
const routes = require("./routes/root.route");

app.use(cors());
app.use(express.json());

app.use("/", routes);

app.get("/", (req, res) => {
  res.send("Server is Running");
});

app.all("*", (req, res) => {
  res.send("route doesn't exist");
});

app.use((err, req, res, next) => {
  if (err) {
    res.send("there is an error");
  }
});

app.listen(port, () => {
  console.log(`server is running at ${port} port`);
});
