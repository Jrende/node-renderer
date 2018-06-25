package com.jrende;

import com.jrende.resources.EditorResource;
import com.jrende.resources.ImageResource;
import io.dropwizard.Application;
import io.dropwizard.assets.AssetsBundle;
import io.dropwizard.configuration.EnvironmentVariableSubstitutor;
import io.dropwizard.configuration.SubstitutingSourceProvider;
import io.dropwizard.db.DataSourceFactory;
import io.dropwizard.forms.MultiPartBundle;
import io.dropwizard.jdbi.DBIFactory;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import io.dropwizard.views.ViewBundle;
import org.jdbi.v3.core.Jdbi;
import org.jdbi.v3.sqlobject.SqlObjectPlugin;

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
        bootstrap.setConfigurationSourceProvider(
                new SubstitutingSourceProvider(
                        bootstrap.getConfigurationSourceProvider(),
                        new EnvironmentVariableSubstitutor()));
        bootstrap.addBundle(new MultiPartBundle());
        bootstrap.addBundle(new AssetsBundle("/static", "/static"));
        bootstrap.addBundle(new ViewBundle<>());
    }

    @Override
    public void run(MainConfiguration main, Environment environment) throws Exception {
        DataSourceFactory dataSourceFactory = main.getDatabase();
        Jdbi jdbi = Jdbi.create(dataSourceFactory.getUrl(), dataSourceFactory.getUser(), dataSourceFactory.getPassword());
        jdbi.installPlugin(new SqlObjectPlugin());

        ImageResource imageResource = new ImageResource(jdbi);
        environment.jersey().register(imageResource);

        EditorResource editorResource = new EditorResource();
        environment.jersey().register(editorResource);
    }
}
