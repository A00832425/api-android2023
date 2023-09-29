const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PageSchema = Schema({
  titulo: String,
  desc: String,
  img: { type: String, default: "" },
  orgId: String
});

module.exports = mongoose.model("pag", PageSchema);
