const express = require('express');
const mongoose = require('mongoose');
const cors=require("cors");
const app = express();
const PORT = 4000;

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB

    mongoose.connect('mongodb+srv://satish141r:VEhfbLaTQqiC0cnn@cluster0.gxzobbt.mongodb.net/electrifyit',{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })
    .then(()=>console.log("DB connection succesfully"))
    .catch((error)=>{
        console.log("Db connection Failed")
        console.error(error);
        process.exit(1);
    })
    app.get('/', (req, res) => {
      res.send('Welcome to the ElectrifyIt API!');
  });
  
// Define a schema for the vehicle
const vehicleSchema = new mongoose.Schema({
    License_Plate: {
        type: String,
        required: true,
        unique: true
      },
      Make: String,
      VIN: {
        type: String,
        required: true,
        unique: true
      },
      Model: String,
      Type: String,
      Date: {
        type: Date,

      },
      Miles_Driven: {
        type: Number,
        default: 0
      }
    });
    app.use(
        cors({
            origin: "*",
            credentials: true,
        })
    );
// Create a model from the schema
const Vehicle = mongoose.model('Vehicle', vehicleSchema);

// Define a route to get vehicle data
app.get('/vehicles', async (req, res) => {
  const vehicles = await Vehicle.find(); // Fetch all vehicles
  res.json(vehicles);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
