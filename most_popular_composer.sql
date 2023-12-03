SELECT com FROM 
	(SELECT a.composer AS com, COUNT(a.composer) AS ct FROM Piece AS a, Performance_piece AS b, Performance AS c 
		WHERE  a.piece_id=b.piece_id AND b.concert_id=c.concert_id AND  c.date_time>='1985-01-01' AND c.date_time<='2025-01-01'
		GROUP BY a.composer) AS d 
WHERE d.ct = (SELECT MAX(ctx) from 
	(SELECT COUNT(ax.composer) AS ctx FROM Piece AS ax, Performance_piece AS bx, Performance AS cx 
		WHERE  ax.piece_id=bx.piece_id AND bx.concert_id=cx.concert_id AND  cx.date_time>='1985-01-01' AND cx.date_time<='2025-01-01'
		GROUP BY ax.composer) AS dx)
		
