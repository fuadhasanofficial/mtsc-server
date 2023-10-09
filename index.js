const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const multer = require("multer");
var jwt = require("jsonwebtoken");

require("dotenv").config();
app.use(cors());
app.use(express.json());
const UPLOADS_FOLDER = "./uploads/";

var upload = multer({
  dest: UPLOADS_FOLDER,
});

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authoraization;
  if (!authHeader) {
    return res.status(401).send({ message: "Un authoraized" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCSESS_TOKEN, function (err, decoded) {
    if (err) {
      return res.status(401).send({ message: "Un authoraized" });
    }

    req.decoded = decoded;
    next();
  });
};

const uri = `mongodb+srv://admintsc:P2H0FpE9Hida9KF6@cluster0.dwawdta.mongodb.net/?retryWrites=true&w=majority`;

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
  try {
    app.post("/upload", upload.single("avatar"), (req, res) => {
      res.send("hello");
    });
    app.post("/jwt", (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCSESS_TOKEN, {
        expiresIn: "1h",
      });
      res.send({ token });
    });
    app.get("/notice/", async (req, res) => {
      const query = {};
      const cursor = noticeCollection.find(query);
      const noticeData = await cursor.toArray();
      const count = await noticeCollection.estimatedDocumentCount();

      res.send({ noticeData, count });
    });
    app.get("/notice/home-page", async (req, res) => {
      const query = {};
      const count = await noticeCollection.estimatedDocumentCount();
      let skip = 0;
      if (count > 5) {
        const cursor = noticeCollection.find(query);
        const noticeData = await cursor.toArray();
        skip = count - 5;
        return res.send({ noticeData });
      }
      const cursor = noticeCollection.find(query);

      const noticeData = await cursor.skip(skip).toArray();

      res.send({ noticeData });
    });
    app.get("/notice/all", async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      const query = {};
      const cursor = noticeCollection.find(query);
      const noticeData = await cursor
        .skip(page * size)
        .limit(size)
        .toArray();
      const count = await noticeCollection.estimatedDocumentCount();

      res.send({ count, noticeData });
    });
    app.post("/notice/upload", verifyJWT, async (req, res) => {
      const decoded = req.decoded;

      const noticeData = req.body;
      const result = await noticeCollection.insertOne(noticeData);
      res.send(result);
    });

    app.get("/teachers", verifyJWT, async (req, res) => {
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
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("server is running");
});

// কি ঠিক আছে তো ?
