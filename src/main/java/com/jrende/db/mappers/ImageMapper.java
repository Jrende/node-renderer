package com.jrende.db.mappers;

import com.jrende.core.Image;
import org.jdbi.v3.core.mapper.RowMapper;
import org.jdbi.v3.core.statement.StatementContext;

import java.sql.ResultSet;
import java.sql.SQLException;

public class ImageMapper implements RowMapper<Image> {
    public ImageMapper() {
    }

    @Override
    public Image map(ResultSet rs, StatementContext ctx) throws SQLException {
        Image image = new Image();
        image.setImageId(rs.getInt("image_id"));
        image.setSource(rs.getString("source"));
        image.setUserId(rs.getString("user_id"));
        return image;
    }
}
