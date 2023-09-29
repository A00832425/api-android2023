const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const Pag = require("../model/pag");
const verifyToken = require("../middleware/verify");

app.post("/add", async (req, res) => {
  try {
    const { email, name, description } = req.body;

    const newPag = new Pag({ email, name, description });
    await newPag.save();

    res.status(201).json({ message: "Registro exitoso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error" });
  }
});

app.get("/getPag", async (req, res) => {
  // []
  const newPag = await Pag.find();
  return res.json(newPag);
  //const identificador = req.params.id;
  //return res.send("Peticion GET recibida" + "id: " + identificador);
});


module.exports = app;
