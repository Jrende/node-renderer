package com.jrende.dao;

import com.jrende.Config;

import java.io.*;
import java.net.URL;
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
            String user = System.getenv("db.user");
            String pwd = System.getenv("db.password");
            db = DriverManager.getConnection(System.getenv("db.url"), user, pwd);
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
        InputStream in = getClass().getResourceAsStream("/db/queries/" + name + ".sql");
        BufferedReader reader = new BufferedReader(new InputStreamReader(in));
        StringBuilder result = new StringBuilder();
        try (Scanner scanner = new Scanner(reader)) {
            while (scanner.hasNextLine()) {
                String line = scanner.nextLine();
                result.append(line).append("\n");
            }
            scanner.close();
        }
        String query = result.toString();
        return db.prepareStatement(query);
    }

}
