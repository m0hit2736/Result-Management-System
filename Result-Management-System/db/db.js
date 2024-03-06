//connecting psql database
const { ConnectionPool } = require('mssql'); // Import ConnectionPool from mssql library

const config = {
    user: 'mohitgupta',
    password: 'mohitgupt@123',
    server: 'db-server-new.database.windows.net',
    database: 'SQLDB',
    options: {
        encrypt: true // For Azure SQL Database, set this option to true for enhanced security
    }
};

const pool = new ConnectionPool(config); // Use ConnectionPool from mssql library
const poolConnect = pool.connect();

poolConnect.then(() => {
    console.log('Connected to database');
}).catch(err => {
    console.error('Database connection failed:', err);
});

module.exports = pool;
