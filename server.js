// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan=require('morgan')
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors('*'));
app.use(morgan("dev"))
// Replace with your MongoDB connection string
const mongoURI = 'mongodb://localhost:27017/crud';
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB database connected'))
  .catch(err => console.error(err));

// Define your Mongoose model (replace with your data structure)
const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String
});

const Item = mongoose.model('Item', ItemSchema);

// CRUD API endpoints

// Create
app.post('/create', async (req, res) => {
  try {
    const newItem = new Item(req.body);
    const savedItem = await newItem.save();
    res.json(savedItem);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});
// Read
app.get('/getItem', async (req, res) => {
    try {
        
      const items = await Item.find();
      res.json(items);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });

  app.get('/edititem/:id',async(req,res)=>{
   
    try{
        console.log("edit in backend")
  const item=await Item.findById(req.params.id)
   res.json(item)
    }catch(err){
        console.log(err)
        res.status(500).send('Server Error');
    }
  })

  app.patch('/updateItem/:id',async(req,res)=>{
    try{
       const updatedItem=await Item.findByIdAndUpdate(req.params.id,req.body)
       res.json(updatedItem)
    }catch(err){
      console.log(err)
      res.status(500).send("server error")
    }
  })
  app.delete('/deleteItem/:id', async (req, res) => {
    try {
      const deletedItem = await Item.findByIdAndDelete(req.params.id);
      if (!deletedItem) {
        return res.status(404).send('Item not found');
      }
      res.json({ message: 'Item deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });
app.listen(port, () => console.log(`Server running on port ${port}`));