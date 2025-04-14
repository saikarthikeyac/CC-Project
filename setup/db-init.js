/**
 * Database initialization script
 * This script imports the faculty data into MongoDB
 */
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Paths to the database files
const FACULTY_DB_PATH = path.join(__dirname, '..', 'faculty-service', 'database', 'faculties.json');

// Check if the database files exist
if (!fs.existsSync(FACULTY_DB_PATH)) {
  console.error('Error: Faculty database file not found at:', FACULTY_DB_PATH);
  process.exit(1);
}

console.log('Starting database initialization...');

// Function to run mongoimport
function importCollection(dbName, collection, filePath) {
  return new Promise((resolve, reject) => {
    console.log(`Importing ${collection} from ${filePath} into ${dbName}...`);
    
    const mongoimport = spawn('mongoimport', [
      '--db', dbName,
      '--collection', collection,
      '--file', filePath,
      '--jsonArray'
    ]);

    mongoimport.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    mongoimport.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    mongoimport.on('close', (code) => {
      if (code === 0) {
        console.log(`Successfully imported ${collection} into ${dbName}`);
        resolve();
      } else {
        console.error(`mongoimport process exited with code ${code}`);
        reject(new Error(`Failed to import ${collection}`));
      }
    });
  });
}

// Run the imports
async function initializeDatabase() {
  try {
    await importCollection('faculty_db', 'faculties', FACULTY_DB_PATH);
    console.log('Database initialization completed successfully!');
  } catch (error) {
    console.error('Error initializing database:', error.message);
    console.log('\nIf mongoimport is not found, please ensure MongoDB tools are installed and in your PATH.');
    console.log('You can manually import the data using:');
    console.log(`mongoimport --db faculty_db --collection faculties --file "${FACULTY_DB_PATH}" --jsonArray`);
  }
}

initializeDatabase();
