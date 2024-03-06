const pool = require('../db/db');

// Student schema
const studentSchema = {
  roll: {
    type: 'integer',
    unique: true,
  },
  name: 'text',
  dob: 'date',
  score: 'integer',
};

// Create table query
const createTableQuery = `
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'students')
BEGIN
    CREATE TABLE students (
        roll INT PRIMARY KEY IDENTITY(1,1),
        name NVARCHAR(255) NOT NULL,
        dob DATE,
        score INT
    );
END;

`;

// Function to create the table
async function createTable() {
  try {
    const poolConnect = await pool.connect(); // Ensure that the pool is connected before executing queries
    console.log('Connected to database');
    
    const request = poolConnect.request(); // Use the request object from the poolConnect
    const result = await request.query(createTableQuery); // Execute the query

    console.log('Table created successfully');
    poolConnect.close(); // Close the connection after executing the query
  } catch (error) {
    console.error('Error creating table:', error);
  }
}

// Call the function to create the table
createTable();

module.exports = {
  studentSchema,
};
