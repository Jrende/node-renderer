package com.jrende.views;


import com.jrende.core.Image;
import io.dropwizard.views.View;

import java.nio.charset.Charset;
import java.util.List;

public class OverviewView extends View {

    private List<Long> images;

    public OverviewView(List<Long> images) {
        super("overview.ftl", Charset.forName("utf-8"));
        this.images = images;
    }

    public List<Long> getImages() {
        return images;
    }
}
