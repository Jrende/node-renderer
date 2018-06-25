package com.jrende.resources;


import io.dropwizard.views.View;

import java.nio.charset.Charset;

public class EditorView extends View {
    private String name;

    protected EditorView(String name) {
        super("editor.ftl", Charset.forName("utf-8"));
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
