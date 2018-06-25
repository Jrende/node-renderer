package com.jrende.resources;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.time.LocalDate;

@Path("/editor")
@Produces(MediaType.TEXT_HTML)
public class EditorResource {
    @GET
    public EditorView getPerson() {
        return new EditorView(LocalDate.now().toString());
    }

}
