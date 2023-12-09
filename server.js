const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;


// Set up the database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'Classical'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});

// Serve static files from the "web" directory
app.use(express.static('web'));

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// Endpoint to get performance by start/end date, location, performer

app.get('/search', (req, res) => {
    let { startDate, endDate, composer, piece, location, performer } = req.query;
    let conditions = [];
    
    if (startDate) {
        conditions.push("d.date_time >= '" + startDate + "'");
    }
    if (endDate) {
        conditions.push("d.date_time <= '" + endDate + "'");
    }
    if (composer) {
        conditions.push("b.composer = '" + composer + "'");
    }
    if (piece) {
        conditions.push("b.title = '" + piece + "'");
    }
    if (location) {
        conditions.push("c.location_name = '" + location + "'");
    }
    if (performer) {
        conditions.push("d.performer_name = '" + performer + "'");
    }

    let baseQuery = `SELECT DISTINCT a.concert_id, a.title, d.date_time FROM Concert AS a, Piece AS b, Venue AS c, Performance as d, Performance_piece as e 
    WHERE a.concert_id=d.concert_id 
    AND a.concert_id=e.concert_id 
    AND b.piece_id=e.piece_id 
    AND d.venue_id=c.venue_id`;

    if (conditions.length > 0) {
        baseQuery += " AND " + conditions.join(" AND ");
    }

    db.query(baseQuery, (error, results) => {
        if (error) {
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(results);
    });
});




