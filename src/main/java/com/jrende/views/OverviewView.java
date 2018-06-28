package com.jrende.views;


import com.jrende.core.Image;
import io.dropwizard.views.View;

import java.nio.charset.Charset;
import java.util.List;

public class OverviewView extends View {

    private List<Long> images;
    private String basePath;

    public OverviewView(List<Long> images, String basePath) {
        super("overview.ftl", Charset.forName("utf-8"));
        this.images = images;
        this.basePath = basePath;
    }

    public List<Long> getImages() {
        return images;
    }

    public String getBasePath() {
        return basePath;
    }
}
