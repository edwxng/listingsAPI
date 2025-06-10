const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  summary:      String,
  property_type:String,
  bedrooms:     Number,
  bathrooms:    Number,
  beds:         Number,
  // add other fields as needed
});

module.exports = mongoose.model('Listing', listingSchema);