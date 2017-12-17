package com.jrende.resources;

import com.google.gson.Gson;
import com.jrende.dao.ImageDAO;
import com.jrende.model.Image;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.WebContext;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.ServletContextTemplateResolver;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@WebServlet("/*")
public class DefaultServlet extends HttpServlet {
    private TemplateEngine templateEngine;
    Gson gson = new Gson();

    @Override
    public void init() throws ServletException {
        ServletContextTemplateResolver templateResolver = new ServletContextTemplateResolver(getServletContext());
        templateResolver.setTemplateMode(TemplateMode.HTML);
        // This will convert "home" to "/WEB-INF/templates/home.html"
//        templateResolver.setPrefix("/static/");
        templateResolver.setPrefix("/static/");
        templateResolver.setSuffix(".html");
        templateResolver.setCacheTTLMs(0L);

        templateResolver.setCharacterEncoding("utf-8");

        // Cache is set to true by default. Set to false if you want templates to
        // be automatically updated when modified.
        templateResolver.setCacheable(false);

        this.templateEngine = new TemplateEngine();
        this.templateEngine.setTemplateResolver(templateResolver);

    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        handleRequest(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        handleRequest(request, response);

    }

    public static boolean isPositiveInt(String str) {
        for (char c : str.toCharArray()) {
            if (!Character.isDigit(c)) return false;
        }
        return true;
    }

    private void handleRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setCharacterEncoding("utf-8");
        String id = request.getRequestURI().substring(1);
        if (id.equals("favicon.ico")) {
            response.sendError(404);
            return;
        }
        WebContext ctx = new WebContext(request, response, this.getServletContext(), request.getLocale());
        String template;
        if (!id.isEmpty() && isPositiveInt(id)) {
            if (!id.equals("0")) {
                Image image = ImageDAO.getInstance().getImage(Integer.parseInt(id));
                ctx.setVariable("image", image.getSource());
            }

            template = "editor/index";
        } else {
            List<Long> images = ImageDAO.getInstance().getImages().stream()
                    .map(Image::getId)
                    .collect(Collectors.toList());
            ctx.setVariable("images", images);
            template = "overview/index";
        }
        templateEngine.process(template, ctx, response.getWriter());

    }
}
