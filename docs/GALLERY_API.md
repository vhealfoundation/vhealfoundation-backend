# Gallery API Documentation

The Gallery API has been updated to support categorized images. This document outlines the available endpoints and their usage.

## Available Categories

The gallery supports the following predefined categories:
- COUNSELLING SERVICES
- ASSESSMENTS
- TRAINING
- COACHING
- REHABILITATION OF PRISONERS
- LATEST BLOGS

## API Endpoints

### Get All Gallery Data
- **URL**: `/api/v1/gallery`
- **Method**: `GET`
- **Description**: Retrieves all gallery data including all categories and their images.
- **Response**: 
  ```json
  {
    "success": true,
    "data": {
      "categories": [
        {
          "title": "COUNSELLING SERVICES",
          "images": [
            {
              "url": "https://example.com/image1.jpg",
              "caption": "Counselling session",
              "_id": "60d21b4667d0d8992e610c85"
            }
          ],
          "_id": "60d21b4667d0d8992e610c84"
        }
      ]
    }
  }
  ```

### Get Images by Category
- **URL**: `/api/v1/gallery/category/:category`
- **Method**: `GET`
- **URL Params**: `category=[string]` (one of the predefined categories)
- **Description**: Retrieves images for a specific category.
- **Response**: 
  ```json
  {
    "success": true,
    "data": {
      "title": "COUNSELLING SERVICES",
      "images": [
        {
          "url": "https://example.com/image1.jpg",
          "caption": "Counselling session",
          "_id": "60d21b4667d0d8992e610c85"
        }
      ]
    }
  }
  ```

### Add a New Category
- **URL**: `/api/v1/gallery/category`
- **Method**: `POST`
- **Body**: 
  ```json
  {
    "title": "COUNSELLING SERVICES"
  }
  ```
- **Description**: Adds a new category to the gallery (must be one of the predefined categories).
- **Response**: 
  ```json
  {
    "success": true,
    "data": {
      "categories": [
        {
          "title": "COUNSELLING SERVICES",
          "images": [],
          "_id": "60d21b4667d0d8992e610c84"
        }
      ]
    }
  }
  ```

### Add Images to a Category
- **URL**: `/api/v1/gallery/category/:category/images`
- **Method**: `POST`
- **URL Params**: `category=[string]` (one of the predefined categories)
- **Body**: 
  ```json
  {
    "images": [
      {
        "url": "https://example.com/image1.jpg",
        "caption": "Counselling session"
      },
      {
        "url": "https://example.com/image2.jpg",
        "caption": "Group therapy"
      }
    ]
  }
  ```
- **Description**: Adds one or more images to a specific category.
- **Response**: Full gallery object with all categories and images.

### Delete an Image from a Category
- **URL**: `/api/v1/gallery/category/:category/image/:imageId`
- **Method**: `DELETE`
- **URL Params**: 
  - `category=[string]` (one of the predefined categories)
  - `imageId=[string]` (MongoDB ObjectId of the image)
- **Description**: Deletes a specific image from a category.
- **Response**: Full gallery object with all categories and images.

### Delete an Entire Category
- **URL**: `/api/v1/gallery/category/:category`
- **Method**: `DELETE`
- **URL Params**: `category=[string]` (one of the predefined categories)
- **Description**: Deletes an entire category and all its images.
- **Response**: 
  ```json
  {
    "success": true,
    "message": "Category 'COUNSELLING SERVICES' deleted successfully",
    "data": {
      "categories": [
        // remaining categories
      ]
    }
  }
  ```

### Delete the Entire Gallery
- **URL**: `/api/v1/gallery`
- **Method**: `DELETE`
- **Description**: Deletes the entire gallery including all categories and images.
- **Response**: 
  ```json
  {
    "success": true,
    "message": "Gallery deleted successfully"
  }
  ```

## Migration from Old Gallery Structure

If you're upgrading from the previous gallery implementation, run the migration script to convert your existing gallery data to the new categorized structure:

```bash
node scripts/migrateGallery.js
```

This will move all existing images to the "OTHER" category, from where you can redistribute them to the appropriate categories using the API or admin interface.