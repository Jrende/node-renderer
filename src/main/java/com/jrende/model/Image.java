package com.jrende.model;

public class Image {
    long id;
    String source;

    public Image(long id, String source) {
        this.id = id;
        this.source = source;
    }

    public long getId() {
        return id;
    }

    public String getSource() {
        return source;
    }
}
