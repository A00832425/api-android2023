const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrgSchema = Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, default: "" },
  orgTags: [{type: String}]
});

module.exports = mongoose.model("orgs", OrgSchema);
