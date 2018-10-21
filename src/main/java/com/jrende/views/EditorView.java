package com.jrende.views;


import io.dropwizard.views.View;

import java.nio.charset.Charset;

public class EditorView extends View {

    private String imageSource;
    private String basePath;

    public EditorView(String imageSource, String basePath) {
        super("editor.ftl", Charset.forName("utf-8"));
        this.imageSource = imageSource;
        this.basePath = basePath;
    }

    public String getImageSource() {
        return imageSource;
    }

    public String getBasePath() {
        return basePath;
    }
}
