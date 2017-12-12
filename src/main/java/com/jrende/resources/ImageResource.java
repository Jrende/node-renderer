package com.jrende.resources;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.jrende.dao.ImageDAO;
import com.jrende.model.Image;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.IOException;
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
    public long saveImage(String source, @Context HttpServletRequest req, @Context HttpServletResponse res) {
        //TODO: Sanity check, has at least one finalOutput node, etc.
        Image image = ImageDAO.getInstance().saveImage(source, req.getSession().getId());
        res.setStatus(Status.CREATED.getStatusCode());
        return image.getId();
    }

    @GET
    @Path("/{id}/source")
    @Produces(MediaType.APPLICATION_JSON)
    public String getImageSource(@PathParam("id") long id, @Context HttpServletRequest req, @Context HttpServletResponse res) {
        Image image = ImageDAO.getInstance().getImage(id);
        if (image == null) {
            res.setStatus(404);
            try {
                res.getWriter().println("Image with id " + id + " not found");
            } catch (IOException e) {
                e.printStackTrace();
            }
            return null;
        }
        return image.getSource();
    }

    @POST
    @Path("/{id}/source")
    @Produces(MediaType.APPLICATION_JSON)
    public void updateImageSource(@PathParam("id") long id, String source, @Context HttpServletRequest req, @Context HttpServletResponse res) {
        Image image = ImageDAO.getInstance().getImage(id);
        if (image == null) {
            respond(res, Status.NOT_FOUND, "Image with id " + id + " not found");
            return;
        }
        if (req.getSession().getId().equals(image.getUserId())) {
            ImageDAO.getInstance().updateImage(id, source);
        } else {
            res.setStatus(Status.FORBIDDEN.getStatusCode());
        }
    }

    private void respond(HttpServletResponse response, Status status, String message) {
        response.setStatus(status.getStatusCode());
        try {
            response.getWriter().println(message);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


}
