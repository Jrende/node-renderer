package com.jrende;

import com.jrende.resources.ImageResource;
import com.jrende.resources.OverviewResource;
import io.dropwizard.Application;
import io.dropwizard.assets.AssetsBundle;
import io.dropwizard.configuration.EnvironmentVariableSubstitutor;
import io.dropwizard.configuration.SubstitutingSourceProvider;
import io.dropwizard.db.DataSourceFactory;
import io.dropwizard.forms.MultiPartBundle;
import io.dropwizard.jdbi3.JdbiFactory;
import io.dropwizard.migrations.MigrationsBundle;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import io.dropwizard.views.ViewBundle;
import org.jdbi.v3.core.Jdbi;

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
        bootstrap.addBundle(new MigrationsBundle<MainConfiguration>() {
            @Override
            public DataSourceFactory getDataSourceFactory(MainConfiguration configuration) {
                return configuration.getDataSourceFactory();
            }
        });
        bootstrap.addBundle(new MultiPartBundle());
        bootstrap.addBundle(new AssetsBundle("/static", "/static"));
        bootstrap.addBundle(new ViewBundle<>());
    }

    @Override
    public void run(MainConfiguration config, Environment environment) throws Exception {
        JdbiFactory factory = new JdbiFactory();
        Jdbi jdbi = factory.build(environment, config.getDataSourceFactory(), "postgresql");

        ImageResource imageResource = new ImageResource(jdbi, config.getThumbnailsFolder(), config.getThumbnailsPath(), config.getReadThumbnailFromDisk());
        environment.jersey().register(imageResource);

        OverviewResource overviewResource = new OverviewResource(jdbi, config);
        environment.jersey().register(overviewResource);
    }
}
