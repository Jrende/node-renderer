CREATE TABLE images (
    image_id SERIAL PRIMARY KEY,
    source text NOT NULL,
    user_id text NOT NULL
);