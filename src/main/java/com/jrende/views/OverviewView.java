package com.jrende.views;


import com.jrende.core.Image;
import io.dropwizard.views.View;

import java.nio.charset.Charset;
import java.util.List;

public class OverviewView extends View {

    private List<Long> images;
    private String basePath;
    private String thumbnailsFolder;

    public OverviewView(List<Long> images, String basePath, String thumbnailsFolder) {
        super("overview.ftl", Charset.forName("utf-8"));
        this.images = images;
        this.basePath = basePath;
        this.thumbnailsFolder = thumbnailsFolder;
    }

    public List<Long> getImages() {
        return images;
    }

    public String getBasePath() {
        return basePath;
    }


    public String getThumbnailsFolder() {
        return thumbnailsFolder;
    }
}
