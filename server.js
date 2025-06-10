/********************************************************************************
 * WEB422 – Assignment 1
 *
 * I declare that this assignment is my own work...
 *
 * Name: ____________  Student ID: ________  Date: ____________
 * Published URL: ___________________________
 ********************************************************************************/

require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const ListingsDB = require('./modules/listingDB.js');

const app  = express();
const db   = new ListingsDB();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'API Listening' });
});

// Create a new listing
app.post('/api/listings', async (req, res) => {
  try {
    const listing = await db.addNewListing(req.body);
    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read all listings (with paging & optional name filter)
app.get('/api/listings', async (req, res) => {
  try {
    const page    = parseInt(req.query.page, 10) || 1;
    const perPage = parseInt(req.query.perPage, 10) || 10;
    const name    = req.query.name || '';
    const listings = await db.getAllListings(page, perPage, name);
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read one listing by ID
app.get('/api/listings/:id', async (req, res) => {
  try {
    const listing = await db.getListingById(req.params.id);
    listing
      ? res.json(listing)
      : res.status(404).json({ message: 'Not Found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a listing by ID
app.put('/api/listings/:id', async (req, res) => {
  try {
    await db.updateListingById(req.body, req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a listing by ID
app.delete('/api/listings/:id', async (req, res) => {
  try {
    await db.deleteListingById(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Initialize DB and start server
db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    console.log(`Server listening on http://localhost:${PORT}`);
    app.listen(PORT);
  })
  .catch(err => {
    console.error('DB Connection Error:', err);
  });