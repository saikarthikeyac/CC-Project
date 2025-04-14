#!/bin/bash
echo "Importing faculty data into MongoDB..."
mongoimport --db faculty_db --collection faculties --file ../faculty-service/database/faculties.json --jsonArray
echo "Database import completed."
