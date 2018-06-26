package com.jrende.db;

import com.jrende.core.Image;
import com.jrende.db.mappers.ImageMapper;
import org.jdbi.v3.sqlobject.config.RegisterRowMapper;
import org.jdbi.v3.sqlobject.config.RegisterRowMapperFactory;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;

import java.util.List;
import java.util.Optional;

public interface ImageDAO {
    @SqlQuery("INSERT INTO images (source, user_id) VALUES (:source, :userId) RETURNING id")
    int saveImage(@Bind("source") String source, @Bind("userId") String userId);

    @SqlQuery("SELECT * FROM images")
    @RegisterRowMapper(ImageMapper.class)
    List<Image> getAllImages();

    @SqlQuery("SELECT * FROM images WHERE id = :imageId")
    @RegisterRowMapper(ImageMapper.class)
    Optional<Image> getImageById(@Bind("imageId") long imageId);

    @SqlQuery("SELECT * FROM images WHERE user_id = :userId")
    @RegisterRowMapper(ImageMapper.class)
    List<Image> getImagesByUserId(@Bind("userId") String userId);

    @SqlUpdate("UPDATE images SET source = :source WHERE id = :imageId")
    @RegisterRowMapper(ImageMapper.class)
    void updateImage(@Bind("source") String source, @Bind("imageId") long imageId);
}
