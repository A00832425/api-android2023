const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Org = require("../model/org");

// Define the schema for the "arrOrgs" model
const arrOrgSchema = Schema({
  arr: [{ type: Schema.Types.ObjectId, ref: 'Org' }],
});

module.exports = mongoose.model("arrOrgs", arrOrgSchema);
