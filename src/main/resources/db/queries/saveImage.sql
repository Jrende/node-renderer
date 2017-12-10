INSERT INTO images (source, user_id)
	VALUES (?, CAST(? as uuid))
	RETURNING link_id;