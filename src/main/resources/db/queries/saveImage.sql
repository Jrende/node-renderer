INSERT INTO images (source, user_id) VALUES (?, ?)
	RETURNING image_id;