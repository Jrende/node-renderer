package com.jrende;

import com.jrende.dao.DBAccessor;
import com.jrende.dao.ImageDAO;
import org.eclipse.jetty.annotations.AnnotationConfiguration;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.util.resource.Resource;
import org.eclipse.jetty.webapp.Configuration;
import org.eclipse.jetty.webapp.WebAppContext;
import org.eclipse.jetty.webapp.WebXmlConfiguration;

import java.net.URL;
import java.util.Arrays;
import java.util.Collections;


public class Main {

    public static void main(String[] args) throws Exception {
        DBAccessor dbAccessor = new DBAccessor();
        ImageDAO.init(dbAccessor);

        Server server = new Server(8080);
        WebAppContext root = new WebAppContext();
        root.setDescriptor("src/main/webapp/WEB-INF/web.xml");
        root.setResourceBase("src/main/webapp");

        URL classes = Main.class
                .getProtectionDomain()
                .getCodeSource()
                .getLocation();

        root.getMetaData().setWebInfClassesDirs(Collections.singletonList(Resource.newResource(classes)));

        root.setConfigurations(new Configuration[] {
                new AnnotationConfiguration(),
                new WebXmlConfiguration(),
        });
        root.setContextPath("/");
        root.setParentLoaderPriority(true);

        server.setHandler(root);
        server.start();
        server.join();

        Runtime.getRuntime().addShutdownHook(new Thread(dbAccessor::closeDBConnection));
    }
}
