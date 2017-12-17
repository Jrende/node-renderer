package com.jrende.resources;

import com.google.gson.*;
import com.jrende.dao.ImageDAO;
import com.jrende.model.Image;
import com.jrende.model.ImageOptimizer;
import org.glassfish.jersey.media.multipart.FormDataParam;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.List;
import java.util.stream.Collectors;

import static javax.ws.rs.core.Response.Status;

@Path("images")
public class ImageResource {

    private final Gson gson;

    public ImageResource() {
        gson = new GsonBuilder().disableHtmlEscaping().create();
    }


    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Long> getImages() {
        return ImageDAO.getInstance().getImages().stream().map(Image::getId).collect(Collectors.toList());
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public String getImage(@PathParam("id") long id) {
        Image image = ImageDAO.getInstance().getImage(id);
        JsonObject imageData = new JsonObject();
        imageData.addProperty("id", image.getId());
        imageData.addProperty("source", "/api/" + image.getId() + "/source");
        imageData.addProperty("thumbnail", "/api/" + image.getId() + "/thumbnail");
        imageData.addProperty("forks", "/api/" + image.getId() + "/forks");
        return imageData.toString();
    }


    @POST
    @Consumes("multipart/form-data")
    public long createNewImage(
            @FormDataParam("source") String source,
            @FormDataParam("thumbnail") String thumbnail,
            @Context HttpServletRequest req,
            @Context HttpServletResponse res) {
        //TODO: Sanity check, has at least one finalOutput node, etc.
        Image image = ImageDAO.getInstance().saveImage(ImageOptimizer.optimizeGraph(source), req.getSession().getId());
        res.setStatus(Status.CREATED.getStatusCode());
        return image.getId();
    }

    @GET
    @Path("/{id}/source")
    @Produces(MediaType.APPLICATION_JSON)
    public String getImageSource(@PathParam("id") long id, @Context HttpServletRequest req, @Context HttpServletResponse res) throws IOException {
        Image image = ImageDAO.getInstance().getImage(id);
        if (image == null || id == 0) {
            res.sendError(404, "Image with id " + id + " not found");
            return null;
        }
        return image.getSource();
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
        Image image = ImageDAO.getInstance().getImage(id);
        if (image == null) {
            res.sendError(404, "Image with id " + id + " not found");
            return;
        }
        if (req.getSession().getId().equals(image.getUserId())) {
            ImageDAO.getInstance().updateImage(id, ImageOptimizer.optimizeGraph(source));
        } else {
            res.sendError(Status.FORBIDDEN.getStatusCode());
        }
    }
}
