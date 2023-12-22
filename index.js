const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.POST || 4321;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://task-hub-client.web.app'],
  credentials: true,
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('task hub is running')
})


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jrqljyn.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const taskCollection = client.db("taskHub").collection("task");
    const bookingCollection = client.db("taskHub").collection("booking");


    // task related api
    app.get("/task", async (req, res) => {
      const result = await taskCollection.find().toArray();
      res.send(result);
    })

    app.post('/task', async (req, res) => {
      const taskItem = req.body;
      const result = await taskCollection.insertOne(taskItem);
      res.send(result);
    })

    app.delete('/task/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    })


    // booking tasks api
    app.post("/booking", async (req, res) => {
      const query = req.body;
      const result = await bookingCollection.insertOne(query);
      res.send(result);
    })

    app.get("/booking", async (req, res) => {
      const result = await bookingCollection.find().toArray();
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`task hub is running on port: ${port}`)
})