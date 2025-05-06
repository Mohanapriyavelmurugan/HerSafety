import mysql from 'mysql2';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create connection without database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'teddybear@2006'
});

// Read and execute the schema.sql file
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

// Split the schema into individual statements
const statements = schema.split(';').filter(statement => statement.trim());

// Execute each statement
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL server');

  // Execute each statement
  statements.forEach((statement) => {
    if (statement.trim()) {
      connection.query(statement, (err) => {
        if (err) {
          console.error('Error executing statement:', err);
          console.error('Statement:', statement);
        }
      });
    }
  });

  console.log('Database and tables created successfully');
  connection.end();
}); 