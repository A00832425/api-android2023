const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PageSchema = Schema({
  phoneNumber: String,
  password: String,
  isAdmin: { type: Boolean, default: false },
});

module.exports = mongoose.model("pag", PageSchema);
