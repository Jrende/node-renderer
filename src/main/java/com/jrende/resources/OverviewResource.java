package com.jrende.resources;

import com.jrende.core.Image;
import com.jrende.db.ImageDAO;
import com.jrende.views.EditorView;
import com.jrende.views.OverviewView;
import org.jdbi.v3.core.Jdbi;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Path("/")
@Produces(MediaType.TEXT_HTML)
public class OverviewResource {
    private ImageDAO imageDAO;

    public OverviewResource(Jdbi jdbi) {
        imageDAO = jdbi.onDemand(ImageDAO.class);
    }

    @GET
    public OverviewView getImages() {
        List<Long> imageIds = imageDAO.getAllImages().stream()
                .map(Image::getId)
                .collect(Collectors.toList());
        return new OverviewView(imageIds);
    }

    private EditorView getEditorView(long imageId) {
        Optional<Image> image = imageDAO.getImageById(imageId);
        String source = image.map(Image::getSource).orElse("{}");
        return new EditorView(source);
    }

    @GET
    @Path("/{imageId}")
    public EditorView getEditorForImage(@PathParam("imageId") long imageId) {
        return getEditorView(imageId);
    }

    @GET
    @Path("/{imageId}/{subPath:.*}")
    public EditorView getEditorForImageWithSubpath(@PathParam("imageId") long imageId, @PathParam("subPath") String subPath) {
        return getEditorView(imageId);
    }
}
