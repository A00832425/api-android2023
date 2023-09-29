const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const Pag = require("../model/pag");
const verifyToken = require("../middleware/verify");

app.post("/add", async (req, res) => {
  try {
    const { titulo, desc, img, orgId } = req.body;

    const newPag = new Pag({ titulo, desc, img, orgId });
    await newPag.save();

    res.status(201).json({ message: "Registro exitoso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error" });
  }
});

app.get("/getPag", async (req, res) => {
  // []
  const id = req.body.id;
  const newPag = await Pag.find({"orgId" : id});
  return res.json(newPag);
  //const identificador = req.params.id;
  //return res.send("Peticion GET recibida" + "id: " + identificador);
});


module.exports = app;
