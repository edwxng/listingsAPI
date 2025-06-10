const mongoose = require('mongoose');
const Listing  = require('./listingSchema.js');

class ListingsDB {
  async initialize(connString) {
    await mongoose.connect(connString, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }

  async getAllListings(page = 1, perPage = 10, name = '') {
    const filter = name
      ? { name: { $regex: name, $options: 'i' } }
      : {};
    const skip = (page - 1) * perPage;
    return Listing.find(filter).skip(skip).limit(perPage).exec();
  }

  async getListingById(id) {
    return Listing.findById(id).exec();
  }

  async addNewListing(data) {
    return Listing.create(data);
  }

  async updateListingById(data, id) {
    return Listing.findByIdAndUpdate(id, data).exec();
  }

  async deleteListingById(id) {
    return Listing.findByIdAndDelete(id).exec();
  }
}

module.exports = ListingsDB;