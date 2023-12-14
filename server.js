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

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

app.get('/search_comment', (req, res) => {
	let {concert_id, title, organization, details} = req.query;
	let conditions = [];
	if (concert_id) {
		conditions.push("a.concert_id = "+concert_id);
	}
	if(title) {
        conditions.push("a.title = '" + title + "'");
    }
	if(organization) {
        conditions.push("a.org = '" + organization + "'");
    }
	if(details) {
        conditions.push("a.details = '" + details + "'");
    }
	let baseQuery = `SELECT DISTINCT f.comment_id, f.content as comment_content, f.rate
	FROM Concert AS a, Piece AS b, Venue AS c, Performance as d, Performance_piece as e , Comment as f, Performance_post as g
    WHERE a.concert_id=d.concert_id 
    AND a.concert_id=e.concert_id 
    AND b.piece_id=e.piece_id 
	AND f.comment_id=g.comment_id
	AND g.perform_id=d.perform_id
    AND d.venue_id=c.venue_id`;
	
	if (conditions.length > 1) {
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
app.get('/find_incre', (req, res) => {
	let baseQuery = `SELECT 'AUTO_INCREMENT'
	FROM  INFORMATION_SCHEMA.TABLES
	WHERE TABLE_SCHEMA = 'Classical'
	AND   TABLE_NAME   = 'Comment';`;

    db.query(baseQuery, (error, results) => {
        if (error) {
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(results);
    });
});
app.get('/insert_comment', (req, res) => {
	let {content,rate,post_id,incre_id} = req.query;
	
	let baseQuery = `INSERT INTO Performance_post (perform_id,comment_id) VALUES(`;
	baseQuesry+=post_id+","+incre_id+");";
	

    db.query(baseQuery, (error, results) => {
        if (error) {
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(results);
    });
	baseQuery = `INSERT INTO Comment (content,rate) VALUES(`;
	if(content)baseQuery+="'"+content+"',";
	else baseQuery+="NULL,";
	if(rate)baseQuery+=rate;
	else baseQuery+="NULL";
	baseQuery+=");"
	db.query(baseQuery, (error, results) => {
        if (error) {
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(results);
    });
});
app.get('/search_post', (req, res) => {
	let {concert_id, title, organization, details} = req.query;
	let conditions = [];
	if (concert_id) {
		conditions.push("a.concert_id = "+concert_id);
	}
	if(title) {
        conditions.push("a.title = '" + title + "'");
    }
	if(organization) {
        conditions.push("a.org = '" + organization + "'");
    }
	if(details) {
        conditions.push("a.details = '" + details + "'");
    }
	let baseQuery = `SELECT DISTINCT d.perform_id 
	FROM Concert AS a, Piece AS b, Venue AS c, Performance as d, Performance_piece as e 
    WHERE a.concert_id=d.concert_id 
    AND a.concert_id=e.concert_id 
    AND b.piece_id=e.piece_id 
    AND d.venue_id=c.venue_id`;
	
	if (conditions.length > 1) {
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
app.get('/search_piece', (req, res) => {
	let {concert_id, title, organization, time} = req.query;
	let conditions = [];
	if (concert_id) {
		conditions.push("a.concert_id = "+concert_id);
	}
	if(title) {
        conditions.push("a.title = '" + title + "'");
    }
	if(organization) {
        conditions.push("a.org = '" + organization + "'");
    }
	if(time) {
        conditions.push("a.details = '" + time + "'");
    }
	let baseQuery = `SELECT DISTINCT b.piece_id, b.composer, b.title as piece_title
	FROM Concert AS a, Piece AS b, Venue AS c, Performance as d, Performance_piece as e 
    WHERE a.concert_id=d.concert_id 
    AND a.concert_id=e.concert_id 
    AND b.piece_id=e.piece_id 
    AND d.venue_id=c.venue_id`;
	
	if (conditions.length > 1) {
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
// Endpoint to get performance by start/end date, location, performer

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

    let baseQuery = `SELECT DISTINCT a.concert_id, a.title, a.org as organization, a.details, a.url, d.date_time as time, c.name as venue_name, c.address, c.lattitude, c.longtitude, c.time_zone
	FROM Concert AS a, Piece AS b, Venue AS c, Performance as d, Performance_piece as e 
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


