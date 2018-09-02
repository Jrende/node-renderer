package com.jrende;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.dropwizard.Configuration;
import io.dropwizard.db.DataSourceFactory;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

public class MainConfiguration extends Configuration {
    @Valid
    @NotNull
    @JsonProperty("database")
    private DataSourceFactory dataSourceFactory = new DataSourceFactory();

    @Valid
    private String thumbnailsFolder = "./thumbnails";

    @Valid
    private String basePath = "/";
    @Valid
    private Boolean readThumbnailFromDisk = false;
    @Valid
    private String thumbnailsPath = "/";

    public DataSourceFactory getDataSourceFactory() {
        return dataSourceFactory;
    }

    public String getThumbnailsFolder() {
        return thumbnailsFolder;
    }

    public String getBasePath() {
        return basePath;
    }

    public Boolean getReadThumbnailFromDisk() {
        return readThumbnailFromDisk;
    }

    public String getThumbnailsPath() {
        return thumbnailsPath;
    }
}
