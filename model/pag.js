const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PageSchema = Schema({
  titulo: String,
  desc: String,
  img: { type: String, default: "" },
  orgId: String,
  linkb1: String,
  linkb2: String,
  linkb4: String,
  selectedIndices: [String],
});

module.exports = mongoose.model("pag", PageSchema);
