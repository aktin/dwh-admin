package org.aktin.dwh.admin.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Prevents browsers from caching the Angular index.html.
 * It references the content-hashed bundles of its build, so a stale copy breaks the app after an update.
 * The bundles stay cacheable, as their names change with their content.
 */
@WebFilter("/*")
public class IndexNoStoreFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String path = httpRequest.getRequestURI().substring(httpRequest.getContextPath().length());
        if (path.equals("/") || path.equals("/index.html")) {
            ((HttpServletResponse) response).setHeader("Cache-Control", "no-store");
        }
        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
    }
}
