const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());


// Define your routes and business logic here

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://maruf509:EgDDbb4NuCdukZGs@cluster0.usnrx4f.mongodb.net/?retryWrites=true&w=majority";

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
    await client.connect();

 const database =client.db("collageVerse");

const userCollection = database.collection("users");
const collageCollection=database.collection("collage-collection")
const appliedCollage=database.collection("appliedCollage");
const reviewCollages=database.collection("reviewCollages");
// user collection
app.post("/users", async (req, res) => {
    const user = req.body;
    const query = { email: user.email };
    const existingUser = await userCollection.findOne(query);
    if (existingUser) {
      return res.send({ message: "account already exist" });
    }
    const result = await userCollection.insertOne(user);
    res.send(result);
  });



  
  
  
  //   collage collection
  
  app.get("/collages", async (req, res) => {
  try {
    const result = await collageCollection.find().toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching colleges:", error);
    res.status(500).send("Error fetching colleges");
  }
});

app.get("/profile/:email", async (req, res)=> {
  const email = req.params.email;
  const query ={email: email}
  const result = await userCollection.findOne(query);
  res.send(result);


})

app.put("/update-profile/:email", async (req, res)=> {
  const email = req.params.email;
  console.log(email);
  const query ={email: email};
  const body =req.body;
  console.log(body);
  const updateDoc ={
    $set: {
      name:body.name,
    imgurl:body.imgurl
    },
  }


  const result = await userCollection.updateOne(query, updateDoc);
  res.send(result)

})



app.get("/collage/:id", async (req, res) => {
  const id=req.params.id;
  const query ={_id: new ObjectId(id)}
  const result=await collageCollection.findOne(query);
  res.send(result);
})


app.get("/get-users", async (req, res)=> {
const result = await userCollection.find().toArray();
res.send(result);
});


app.post("/apply-collages", async (req, res)=> {
  const newCollages = req.body;
  const result = await appliedCollage.insertOne(newCollages);
  res.send(result);

});

app.post("/send-review", async (req, res)=> {
  const review = req.body;
  const result = await reviewCollages.insertOne(review);
  res.send(result);

});

app.get('/search', async (req, res) => {
  const { q } = req.query;
  console.log(q);
  try {
    // Perform the search operation using MongoDB query
    const colleges = await collageCollection.find(
      {
        college_name:{ $regex: new RegExp(q, 'i') }, // Case-insensitive search
    }
    ).toArray();

    res.send(colleges);
  } catch (error) {
    console.error('Error searching colleges:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});


app.get("/get-reviews",async(req,res)=>{
  const result = await reviewCollages.find().toArray();
  res.send(result);
})


app.get('/get-applied-collages/:email',async (req, res) => {
const email = req.params.email
const query={candidateEmail: email}
const result = await appliedCollage.find(query).toArray()
res.send(result)
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










app.get("/", (req, res) => {
  res.send("sports pro academy is running");
});


app.listen(port, () => {
  console.log(`sports pro academy is running on port ${port}`);
});
