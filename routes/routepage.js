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

app.post("/getPag", async (req, res) => {
  // []
  console.log("Aqui empieza el post");
  const { elS } = req.body;
  console.log(elS);
  const newPag = await Pag.find({"orgId" : elS});
  console.log(newPag);
  return res.json(newPag);
  //const identificador = req.params.id;
  //return res.send("Peticion GET recibida" + "id: " + identificador);
});


module.exports = app;
