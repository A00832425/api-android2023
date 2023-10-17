const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for the "Orgs" model
const orgSchema = Schema({
  // Define the fields and their types for your "Orgs" model
  name: String,
  // other fields...
});

// Create the "Orgs" model
const Org = mongoose.model("Orgs", orgSchema);

// Define the schema for the "arrOrgs" model
const arrOrgSchema = Schema({
  arr: [{ type: Schema.Types.ObjectId, ref: 'Orgs' }],
});

module.exports = mongoose.model("arrOrgs", arrOrgSchema);
