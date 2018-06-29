package com.jrende.views;


import com.jrende.db.ImageDAO;
import io.dropwizard.views.View;
import org.jdbi.v3.core.Jdbi;

import java.nio.charset.Charset;

public class EditorView extends View {

    private String imageSource;
    private String basePath;
    private String thumbnailsFolder;


    public EditorView(String imageSource, String basePath) {
        super("editor.ftl", Charset.forName("utf-8"));
        this.imageSource = imageSource;
        this.basePath = basePath;
        this.thumbnailsFolder = thumbnailsFolder;
    }

    public String getImageSource() {
        return imageSource;
    }

    public String getBasePath() {
        return basePath;
    }
}
