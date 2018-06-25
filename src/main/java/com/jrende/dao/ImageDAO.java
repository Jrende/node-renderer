package com.jrende.dao;

import com.jrende.model.Image;
import org.skife.jdbi.v2.sqlobject.SqlUpdate;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public interface ImageDAO {
    @SqlUpdate("INSERT INTO images (source, user_id) VALUES (:source, :userId) RETURNING image_id")
    int saveImage(String source, String userId);


    /*
    private DBAccessor dbAccessor;
    private static ImageDAO instance;
    private final PreparedStatement getImages;
    private final PreparedStatement getImageById;
    private final PreparedStatement saveImage;
    private final PreparedStatement getAllImages;
    private final PreparedStatement updateImage;

    private ImageDAO(DBAccessor dbAccessor) throws SQLException {
        this.dbAccessor = dbAccessor;
        getImages = dbAccessor.createQueryFromResource("getImages");
        getImageById = dbAccessor.createQueryFromResource("getImageById");
        getAllImages = dbAccessor.createQueryFromResource("getAllImages");
        updateImage = dbAccessor.createQueryFromResource("updateImage");
        saveImage = dbAccessor.createQueryFromResource("saveImage");
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
        String userId = resultSet.getString("user_id");
        return new Image(id, source, userId);
    }

    public List<Image> getImages() {
        List<Image> images = Collections.emptyList();
        try {
            ResultSet resultSet = getAllImages.executeQuery();
            images = new ArrayList<>();
            while (resultSet.next()) {
                images.add(getImageFromResultsSet(resultSet));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return images;
    }

    public List<Image> getImagesByUserId(String userId) {
        List<Image> images = Collections.emptyList();
        try {
            getImages.setString(1, userId);
            ResultSet resultSet = getImages.executeQuery();
            images = new ArrayList<>();
            while (resultSet.next()) {
                images.add(getImageFromResultsSet(resultSet));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return images;
    }

    public Image saveImage(String source, String userId) {
        try {
            saveImage.setString(1, source);
            saveImage.setString(2, userId);
            ResultSet result = saveImage.executeQuery();
            result.next();
            long id = result.getLong("image_id");
            return new Image(id, source, userId);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public Image getImage(long imageId) {
        Image image = null;
        try {
            getImageById.setLong(1, imageId);
            ResultSet resultSet = getImageById.executeQuery();
            while (resultSet.next()) {
                image = getImageFromResultsSet(resultSet);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return image;
    }

    public void updateImage(long imageId, String source) {
        try {
            updateImage.setString(1, source);
            updateImage.setLong(2, imageId);
            updateImage.execute();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
    */
}
