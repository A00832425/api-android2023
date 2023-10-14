const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const Org = require("../model/org");
const verifyToken = require("../middleware/verify");

app.post("/add", async (req, res) => {
  try {
    const { email, name, description } = req.body;

    const newOrg = new Org({ email, name, description });
    await newOrg.save().then(savedObject => {
    console.log('Object saved with ID:', savedObject._id.toString());
    // You can access the ObjectId via savedObject._id
  }
      );

    res.status(201).json({ message: "Registro exitoso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error" });
  }
});

app.get("/getOrgs", async (req, res) => {
  // []
  const newOrg = await Org.find();
  return res.json(newOrg);
  //const identificador = req.params.id;
  //return res.send("Peticion GET recibida" + "id: " + identificador);
});


module.exports = app;
