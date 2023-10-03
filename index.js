const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");

require("dotenv").config();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.65qq53i.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const noticeCollection = client.db("mtsc").collection("notice");
const teacherCollection = client.db("mtsc").collection("teacher");
const sectionCollection = client.db("mtsc").collection("sectiondata");
async function run() {
  app.get("/notice/", async (req, res) => {
    const query = {};
    const cursor = noticeCollection.find(query);
    const noticeData = await cursor.toArray();
    console.log(noticeData);
    res.send(noticeData);
  });
  app.get("/notice/count", async (req, res) => {
    const count = await noticeCollection.estimatedDocumentCount();
    res.send({ count });
  });
  app.post("/notice/upload", async (req, res) => {
    const noticeData = req.body;
    const result = await noticeCollection.insertOne(noticeData);
    res.send(result);
  });

  app.get("/teachers", async (req, res) => {
    const query = {};
    const cursor = teacherCollection.find(query);
    const teacherData = await cursor.toArray();
    res.send(teacherData);
  });
  app.get("/section", async (req, res) => {
    const query = {};
    const cursor = sectionCollection.find(query);
    const sectionData = await cursor.toArray();
    res.send(sectionData);
  });
  try {
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("server is running");
});

// কি ঠিক আছে তো ?
