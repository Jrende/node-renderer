package com.jrende.model;

public class Image {
    long id;
    String source;
    String userId;

    public Image(long id, String source, String userId) {
        this.id = id;
        this.source = source;
        this.userId = userId;
    }

    public long getId() {
        return id;
    }

    public String getSource() {
        return source;
    }

    public String getUserId() {
        return userId;
    }

    public void setId(long id) {
        this.id = id;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
