package com.jrende;

import com.jrende.resources.EditorResource;
import io.dropwizard.Application;
import io.dropwizard.assets.AssetsBundle;
import io.dropwizard.forms.MultiPartBundle;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import io.dropwizard.views.ViewBundle;

public class MainApplication extends Application<MainConfiguration> {
    public static void main(final String[] args) throws Exception {
        new MainApplication().run(args);
    }

    @Override
    public String getName() {
        return "node-renderer";
    }

    @Override
    public void initialize(final Bootstrap<MainConfiguration> bootstrap) {
        bootstrap.addBundle(new MultiPartBundle());
        bootstrap.addBundle(new AssetsBundle("/static", "/static"));
        bootstrap.addBundle(new ViewBundle<>());
    }

    @Override
    public void run(MainConfiguration main, Environment environment) throws Exception {
        EditorResource editorResource = new EditorResource();
        environment.jersey().register(editorResource);
    }
}
