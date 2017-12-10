package com.jrende;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class Config {
    static Properties props = new Properties();

    static {
        try {
            System.out.println("Loading config");
            InputStream stream = Config.class.getClassLoader().getResourceAsStream("config.properties");
            if (props == null) {
                throw new FileNotFoundException();
            }
            props.load(stream);
        } catch (FileNotFoundException e) {
            System.err.println("Can't find config.properties!");
            e.printStackTrace();
        } catch (IOException e) {
            System.err.println("IOException when reading config.properties!");
            e.printStackTrace();
        }
    }


    public static String getProperty(String key) {
        return props.getProperty(key);
    }
}