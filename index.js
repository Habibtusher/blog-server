const express = require('express')
const app = express()
const port = 5000

const objectId =require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;


const cors = require('cors');
const bodyParser = require('body-parser')
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());



console.log(process.env.DB_USER);
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.avdod.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const allBlogs = client.db("blog").collection("allBlog");
  const admin = client.db("blog").collection("admin");
  console.log('Database Connected');


  app.post('/addBlog',(req, res)=>{
    const newBlog = req.body;
    console.log('adding new product',newBlog);
    allBlogs.insertOne(newBlog)
    .then(result => {
      console.log('in',result.insertedCount);
      res.send(result.insertedCount > 0 )
    })
})

app.get('/allBlogs', (req,res)=>{

  allBlogs.find()
  .toArray((err,items) => {
    res.send(items);
    
  })
})

app.get("/blog/:id", (req, res) => {
  allBlogs.find({_id: objectId(req.params.id)})
  .toArray((err,documents) => {
    res.send(documents[0]);
  })
})

app.delete('/deleteBlog/:id', (req, res) => {
  const id = objectId(req.params.id);
  console.log('delete this',id);
  allBlogs.findOneAndDelete({_id: id})
  .then(documents => {res.send(documents)})
 .catch(err =>console.log(err))
 })

//   client.close();
});




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port);