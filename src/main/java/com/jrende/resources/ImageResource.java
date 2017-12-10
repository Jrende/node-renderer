package com.jrende.resources;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.jrende.dao.ImageDAO;
import com.jrende.model.Image;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import java.util.stream.Collectors;

@Path("images")
public class ImageResource {

    private final Gson gson;

    public ImageResource() {
        gson = new GsonBuilder().disableHtmlEscaping().create();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Long> getImages() throws SQLException {
        List<Image> images = ImageDAO.getInstance().getImages();
        return images.stream().map(Image::getId).collect(Collectors.toList());
    }

    @POST
    public void saveImage(String source, @Context HttpServletRequest req, @Context HttpServletResponse res) throws SQLException {
        //TODO: Sanity check, final output node exists etc.
        ImageDAO.getInstance().saveImage(source, req.getSession().getId());
        res.setStatus(Response.Status.CREATED.getStatusCode());
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public String getImageSource(@PathParam("id") long id, @Context HttpServletRequest req, @Context HttpServletResponse res) throws SQLException {
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
}
