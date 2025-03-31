# MongoDB Migration Script

This document explains how to use the MongoDB migration script to populate your database with initial data from the JavaScript files.

## Overview

The migration script (`script/migrateToMongoDB.js`) is designed to:

1. Import data from the following source files:
   - `/src/app/data/siteContent.js` - Contains website content like banner, about section, etc.
   - `/src/app/data/techelonsData.js` - Contains data for the Techelons event

2. Create MongoDB collections with this data if they don't already exist.

## Prerequisites

- Ensure MongoDB connection string is set up in your `.env` file:
  ```
  MONGODB_URI=your_mongodb_connection_string
  ```

- Make sure all dependencies are installed:
  ```bash
  npm install
  ```

## Running the Migration

To run the migration script:

```bash
npm run migrate
```

The script will:
1. Connect to your MongoDB database using the connection string from your `.env` file
2. Check if the collections already have data
3. If data doesn't exist, it will create new documents with the content from the JS files
4. Skip migration if data already exists in the collections

## Expected Output

When running the script, you should see output like:

```
Data files imported successfully
Connected to MongoDB successfully
Site content data migrated successfully
Techelons data migrated successfully
Migration complete
```

If the data already exists:

```
Data files imported successfully
Connected to MongoDB successfully
Site content data already exists in the database. Skipping migration.
Techelons data already exists in the database. Skipping migration.
Migration complete
```

## Troubleshooting

If you encounter any errors:

1. Check your MongoDB connection string in the `.env` file
2. Ensure MongoDB server is running and accessible
3. Verify that the data files exist in the correct locations
4. Check the console for specific error messages

## Manual Reset

If you need to reset the data:

1. Connect to your MongoDB database using a tool like MongoDB Compass
2. Delete the `siteContents` and `techelonsData` collections
3. Run the migration script again 