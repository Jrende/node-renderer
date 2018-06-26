package com.jrende.views;


import com.jrende.db.ImageDAO;
import io.dropwizard.views.View;
import org.jdbi.v3.core.Jdbi;

import java.nio.charset.Charset;

public class EditorView extends View {

    private String imageSource;

    public EditorView(String imageSource) {
        super("editor.ftl", Charset.forName("utf-8"));
        this.imageSource = imageSource;
    }

    public String getImageSource() {
        return imageSource;
    }
}
