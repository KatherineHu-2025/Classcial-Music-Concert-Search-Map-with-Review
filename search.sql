SELECT DISTINCT a.title, a.concert_id FROM Concert AS a, Piece AS b, Venue AS c, Performance as d, Performance_piece as e
WHERE a.concert_id=d.concert_id AND 
	  a.concert_id=e.concert_id AND
	  b.piece_id=e.piece_id AND
	  d.venue_id=c.venue_id AND
	  b.composer="Bach"
