package com.jrende.resources;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.jrende.core.Image;
import com.jrende.db.ImageDAO;
import com.jrende.core.ImageOptimizer;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.jdbi.v3.core.Jdbi;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

import static javax.ws.rs.core.Response.Status;

@Path("api/images")
public class ImageResource {

    private ImageDAO imageDAO;
    private String thumbnailsFolder;
    private String thumbnailsPath;
    private boolean readThumbnailFromDisk;

    public ImageResource(Jdbi jdbi, String thumbnailsFolder, String thumbnailsPath, boolean readThumbnailFromDisk) {
        this.thumbnailsFolder = thumbnailsFolder;
        this.thumbnailsPath = thumbnailsPath;
        this.readThumbnailFromDisk = readThumbnailFromDisk;
        imageDAO = jdbi.onDemand(ImageDAO.class);
    }


    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Long> getImages() {
        return imageDAO.getAllImages().stream().map(Image::getId).collect(Collectors.toList());
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public String getImage(@PathParam("id") long id) {
        Image image = imageDAO.getImageById(id)
                .orElseThrow(() -> new NotFoundException("Image with id " + id + " not found"));
        JsonObject imageData = new JsonObject();
        imageData.addProperty("id", image.getId());
        imageData.addProperty("source", "/api/" + image.getId() + "/source");
        imageData.addProperty("thumbnail", "/static/thumbnails/thumb-" + image.getId() + ".png");
        imageData.addProperty("forks", "/api/" + image.getId() + "/forks");
        return imageData.toString();
    }


    @POST
    @Consumes("multipart/form-data")
    public long createNewImage(
            @FormDataParam("source") String source,
            @FormDataParam("thumbnail") String thumbnail,
            @Context HttpServletRequest req,
            @Context HttpServletResponse res
    ) throws IOException {
        //TODO: Sanity check, has at least one finalOutput node, etc.
        Image image = new Image();
        image.setSource(ImageOptimizer.optimizeGraph(source));
        //TODO: Implement session management
        image.setUserId("0");
        long imageId = imageDAO.saveImage(image.getSource(), image.getUserId());
        saveThumbnailToFile(image.getId(), thumbnail);
        res.setStatus(Status.CREATED.getStatusCode());
        return imageId;
    }

    private void saveThumbnailToFile(long id, String thumbnail) throws IOException {
        String str = thumbnail.substring(thumbnail.indexOf(',') + 1);
        byte[] decode = Base64.getDecoder().decode(str);
        Files.write(Paths.get(thumbnailsFolder, "thumb-" + id + ".png"), decode, StandardOpenOption.CREATE);
    }

    @GET
    @Path("/{id}/thumbnail.png")
    @Produces("image/png")
    public void getThumbnail(@PathParam("id") long id, @Context HttpServletResponse res) throws IOException {
        if (readThumbnailFromDisk) {
            var path = Paths.get(thumbnailsFolder, "thumb-" + id + ".png");
            if(!Files.exists(path)) {
                throw new NotFoundException("Thumbnail of image with id " + id + " not found");
            }
            byte[] thumbnails = Files.readAllBytes(path);
            res.setStatus(200);
            res.setContentType("image/png");
            res.setContentLength(thumbnails.length);
            res.getOutputStream().write(thumbnails);
        } else {
            res.sendRedirect(thumbnailsPath + "/thumb-" + id + ".png");
        }
    }

    @POST
    @Path("/{id}/source")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes("multipart/form-data")
    public void updateImageSource(
            @PathParam("id") long id,
            @FormDataParam("source") String source,
            @FormDataParam("thumbnail") String thumbnail,
            @Context HttpServletRequest req,
            @Context HttpServletResponse res) throws IOException {
        var image = imageDAO.getImageById(id)
                .orElseThrow(() -> new NotFoundException("Image with id " + id + " not found"));
//        if (req.getSession().getId().equals(image.getUserId())) {
        image.setSource(source);
        imageDAO.updateImage(image.getSource(), image.getId());
        saveThumbnailToFile(id, thumbnail);
//        } else {
//            res.sendError(Status.FORBIDDEN.getStatusCode());
//        }
    }

    @GET
    @Path("/{id}/source")
    @Produces(MediaType.APPLICATION_JSON)
    public String getImageSource(
            @PathParam("id") long id) {
        var image = imageDAO.getImageById(id)
                .orElseThrow(() -> new NotFoundException("Image with id " + id + " not found"));
        return image.getSource();
    }
}
