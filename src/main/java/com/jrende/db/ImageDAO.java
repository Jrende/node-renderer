package com.jrende.db;

import com.jrende.core.Image;
import com.jrende.db.mappers.ImageMapper;
import org.jdbi.v3.sqlobject.config.RegisterRowMapper;
import org.jdbi.v3.sqlobject.config.RegisterRowMapperFactory;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;

import java.util.List;

public interface ImageDAO {
    @SqlUpdate("INSERT INTO images (source, user_id) VALUES (:source, :userId) RETURNING image_id")
    int saveImage(String source, String userId);

    @SqlQuery("SELECT * FROM images")
    @RegisterRowMapper(ImageMapper.class)
    List<Image> getAllImages();

    @SqlQuery("SELECT * FROM images WHERE image_id = :imageId")
    @RegisterRowMapper(ImageMapper.class)
    Image getImageById(long imageId);

    @SqlQuery("SELECT * FROM images WHERE user_id = :userId")
    @RegisterRowMapper(ImageMapper.class)
    List<Image> getImagesByUserId(String userId);

    @SqlUpdate("INSERT INTO images (source, user_id) VALUES (:source, :userId) RETURNING image_id;")
    @RegisterRowMapper(ImageMapper.class)
    int createNewImage(String source, String userId);

    @SqlUpdate("UPDATE images SET source = :source WHERE image_id = :imageId")
    @RegisterRowMapper(ImageMapper.class)
    void updateImage(String source, long imageId);
}
