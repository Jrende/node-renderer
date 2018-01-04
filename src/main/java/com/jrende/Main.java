package com.jrende;

import com.jrende.dao.DBAccessor;
import com.jrende.dao.ImageDAO;
import com.jrende.resources.ImageResource;
import org.eclipse.jetty.annotations.AnnotationConfiguration;
import org.eclipse.jetty.server.Handler;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.ServerConnector;
import org.eclipse.jetty.server.handler.ContextHandler;
import org.eclipse.jetty.server.handler.DefaultHandler;
import org.eclipse.jetty.server.handler.HandlerList;
import org.eclipse.jetty.server.handler.ResourceHandler;
import org.eclipse.jetty.servlet.ServletHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.eclipse.jetty.util.resource.Resource;
import org.eclipse.jetty.webapp.Configuration;
import org.eclipse.jetty.webapp.WebAppContext;
import org.eclipse.jetty.webapp.WebXmlConfiguration;
import org.glassfish.jersey.media.multipart.MultiPartFeature;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.servlet.ServletContainer;

import javax.servlet.Servlet;
import javax.servlet.ServletContext;
import java.net.URL;
import java.util.Arrays;
import java.util.Collections;


public class Main {

    public static void main(String[] args) throws Exception {
        DBAccessor dbAccessor = new DBAccessor();
        ImageDAO.init(dbAccessor);
        Server server = new Server();
        ServerConnector http = new ServerConnector(server);
        http.setHost("0.0.0.0");
        http.setPort(8080);
        http.setIdleTimeout(30000);
        server.addConnector(http);

        ContextHandler staticResourceHandler = new ContextHandler("/static");
        ResourceHandler resourceHandler = new ResourceHandler();
        resourceHandler.setDirectoriesListed(true);
        resourceHandler.setResourceBase("src/main/webapp/static");
        staticResourceHandler.setHandler(resourceHandler);

        WebAppContext webapp = new WebAppContext();
        webapp.setContextPath("/");
        webapp.setResourceBase("src/main/webapp");
        webapp.setConfigurations(new Configuration[]{
                new AnnotationConfiguration()
        });
        webapp.setParentLoaderPriority(true);

        //Enables Servlet 3.0 annotation processing
        URL classes = Main.class
                .getProtectionDomain()
                .getCodeSource()
                .getLocation();
        webapp.getMetaData().setWebInfClassesDirs(Collections.singletonList(Resource.newResource(classes)));

        //Create Jersey servlet
        ResourceConfig resourceConfig = new ResourceConfig();
        resourceConfig.register(MultiPartFeature.class);
        resourceConfig.packages("com.jrende.resources");
        ServletHolder servletHolder = new ServletHolder(new ServletContainer(resourceConfig));
        servletHolder.setInitOrder(1);
        webapp.addServlet(servletHolder, "/api/*");

        server.setHandler(new HandlerList(staticResourceHandler, webapp));

        server.start();
        server.join();
        Runtime.getRuntime().addShutdownHook(new Thread(dbAccessor::closeDBConnection));
    }
}
