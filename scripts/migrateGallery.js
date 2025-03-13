/**
 * Migration script to convert old gallery structure to new categorized structure
 * Run this script with: node scripts/migrateGallery.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected for migration'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Define old and new schemas
const oldGallerySchema = new mongoose.Schema({
  images: [
    {
      url: String,
      _id: mongoose.Schema.Types.ObjectId
    },
  ],
});

const newGallerySchema = new mongoose.Schema({
  categories: [
    {
      title: String,
      images: [
        {
          url: String,
          caption: String,
          _id: mongoose.Schema.Types.ObjectId
        }
      ]
    }
  ]
});

// Create models using the schemas
const OldGallery = mongoose.model('OldGallery', oldGallerySchema, 'galleries');
const NewGallery = mongoose.model('Gallery', newGallerySchema, 'galleries');

async function migrateGallery() {
  try {
    // Get the old gallery data
    const oldGallery = await OldGallery.findOne();
    
    if (!oldGallery) {
      console.log('No gallery data found to migrate');
      return;
    }
    
    console.log(`Found ${oldGallery.images.length} images to migrate`);
    
    // Create new gallery with "OTHER" category containing all old images
    const newGallery = new NewGallery({
      categories: [
        {
          title: "OTHER",
          images: oldGallery.images.map(img => ({
            url: img.url,
            caption: ""
          }))
        }
      ]
    });
    
    // Save the new gallery structure
    await newGallery.save();
    
    console.log('Migration completed successfully');
    console.log('All images have been moved to the "OTHER" category');
    console.log('You can now move images to specific categories through the admin interface');
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the migration
migrateGallery();