package com.jrende.dao;

import com.jrende.model.Image;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ImageDAO {
    private DBAccessor dbAccessor;
    private static ImageDAO instance;
    private final PreparedStatement getImagesStatement;
    private final PreparedStatement getImageByIdStatement;
    private final PreparedStatement saveImageStatement;
    private final PreparedStatement getAllImagesStatement;

    private ImageDAO(DBAccessor dbAccessor) throws SQLException {
        this.dbAccessor = dbAccessor;
        getImagesStatement = dbAccessor.createQueryFromResource("getImages");
        getImageByIdStatement = dbAccessor.createQueryFromResource("getImageById");
        getAllImagesStatement = dbAccessor.createQueryFromResource("getAllImages");
        saveImageStatement = dbAccessor.createQueryFromResource("saveImage");
    }

    public static ImageDAO getInstance() {
        return instance;
    }

    public static void init(DBAccessor dbAccessor) throws SQLException {
        instance = new ImageDAO(dbAccessor);
    }

    private Image getImageFromResultsSet(ResultSet resultSet) throws SQLException {
        String source = resultSet.getString("source");
        long id = resultSet.getLong("image_id");
        return new Image(id, source);
    }

    public List<Image> getImages() throws SQLException {
        ResultSet resultSet = getAllImagesStatement.executeQuery();
        List<Image> images = new ArrayList<>();
        while (resultSet.next()) {
            images.add(getImageFromResultsSet(resultSet));
        }
        return images;
    }

    public List<Image> getImageByUserId(String userId) throws SQLException {
        getImagesStatement.setString(1, userId);
        ResultSet resultSet = getImagesStatement.executeQuery();
        List<Image> images = new ArrayList<>();
        while (resultSet.next()) {
            images.add(getImageFromResultsSet(resultSet));
        }
        return images;
    }

    public void saveImage(String source, String userId) throws SQLException {
        saveImageStatement.setString(1, source);
        saveImageStatement.setString(2, userId);
        saveImageStatement.execute();
    }

    public Image getImage(long imageId) throws SQLException {
        getImageByIdStatement.setLong(1, imageId);
        ResultSet resultSet = getImageByIdStatement.executeQuery();
        Image image = null;
        while (resultSet.next()) {
            image = getImageFromResultsSet(resultSet);
        }
        return image;
    }
}
