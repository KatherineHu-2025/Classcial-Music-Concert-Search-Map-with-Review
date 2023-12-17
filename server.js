const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;


// Set up the database connection
const db = mysql.createConnection({
    host: '127.0.0.1',
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
app.use(express.json());

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

app.get('/search_comment/:perform_id', (req, res) => {
	const perform_id = req.params.perform_id;
	let baseQuery = `SELECT b.content, b.rate FROM Performance_post as a JOIN Comment as b ON a.comment_id = b.comment_id
    WHERE perform_id = ?`;
	
    db.query(baseQuery,[perform_id],(error, results) => {
        if (error) {
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(results);
    });
});


app.post('/insert_comment', (req, res) => {
    let {content, rate, perform_id} = req.body;
    console.log(content);
    // Insert into Comment table
    let commentQuery = `INSERT INTO Comment (content, rate) VALUES (?, ?);`;
    db.query(commentQuery, [content, rate], (error, commentResults) => {
        if (error) {
            res.status(500).send('Error inserting comment');
            console.error(error);
            return;
        }

        // Get the last inserted ID
        let lastId = commentResults.insertId;

        // Insert into Performance_post table
        let performancePostQuery = `INSERT INTO Performance_post (perform_id, comment_id) VALUES (?, ?);`;
        db.query(performancePostQuery, [perform_id, lastId], (error, performancePostResults) => {
            if (error) {
                res.status(500).send('Error linking comment to performance');
                console.error(error);
                return;
            }

            res.json(performancePostResults);
        });
    });
});

app.get('/search_piece/:concert_id', (req, res) => {
    const concert_id = req.params.concert_id;
    console.log(concert_id)
	let baseQuery = `SELECT concert_id, b.composer, b.title FROM Performance_piece as a JOIN Piece as b ON a.piece_id = b.piece_id
    WHERE concert_id = ?`;

    db.query(baseQuery, [concert_id],(error, results) => {
        if (error) {
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(results);
    });
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
        conditions.push("c.name = '" + location + "'");
    }
    if (performer) {
        conditions.push("a.org = '" + performer + "'");
    }

    let baseQuery = `SELECT DISTINCT d.perform_id, a.concert_id, a.title, a.org as organization, a.details, a.url, d.pretty_datetime as time, c.name as venue_name, c.address, c.lattitude, c.longtitude, c.time_zone, d.date_time
	FROM Concert AS a, Piece AS b, Venue AS c, Performance as d, Performance_piece as e 
    WHERE a.concert_id=d.concert_id 
    AND a.concert_id=e.concert_id 
    AND b.piece_id=e.piece_id 
    AND d.venue_id=c.venue_id`;

    if (conditions.length > 0) {
        baseQuery += " AND " + conditions.join(" AND ");
    }

    baseQuery += "ORDER BY d.date_time"

    db.query(baseQuery, (error, results) => {
        if (error) {
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(results);
    });
});

app.get('/composerdata', (req, res) => {
    db.query('SELECT DISTINCT composer FROM Piece', (err, results) => {
        if (err) {
            res.status(500).send('Internal Server Error');
        } else {
            res.json(results);
        }
    });
});

app.get('/piecedata', (req, res) => {
    db.query('SELECT DISTINCT title FROM Piece;', (err, results) => {
        if (err) {
            res.status(500).send('Internal Server Error');
        } else {
            res.json(results);
        }
    });
});

app.get('/venuedata', (req, res) => {
    db.query('SELECT DISTINCT name FROM Venue;', (err, results) => {
        if (err) {
            res.status(500).send('Internal Server Error');
        } else {
            res.json(results);
        }
    });
});

app.get('/orgdata', (req, res) => {
    db.query('SELECT DISTINCT org FROM Concert;', (err, results) => {
        if (err) {
            res.status(500).send('Internal Server Error');
        } else {
            res.json(results);
        }
    });
});


