package com.jrende.dao;

import com.jrende.Config;

import java.io.File;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Scanner;

public class DBAccessor {
    private Connection db;

    public DBAccessor() {
        this.db = createDBConnection();
    }

    private Connection createDBConnection() {
        Connection db = null;
        try {
            Class.forName("org.postgresql.Driver");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        try {
            System.out.println("Init database");
            String user = Config.getProperty("db.user");
            String pwd = Config.getProperty("db.password");
            db = DriverManager.getConnection(Config.getProperty("db.url"), user, pwd);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return db;
    }

    public void closeDBConnection() {
        try {
            if (db != null) {
                db.close();
            }
        } catch (SQLException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    public PreparedStatement createQueryFromResource(String name) throws SQLException {
        File file = new File(getClass().getResource("/db/queries/" + name + ".sql").getFile());
        StringBuilder result = new StringBuilder();
        try (Scanner scanner = new Scanner(file)) {
            while (scanner.hasNextLine()) {
                String line = scanner.nextLine();
                result.append(line).append("\n");
            }
            scanner.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        String query = result.toString();
        return db.prepareStatement(query);
    }

}
