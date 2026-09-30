package com.pantrypal.recipes;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.List;
import org.springframework.dao.DataAccessException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

// Only the explicit Authorization header is accepted. Browser cookies and
// user-supplied identity headers never authenticate a Java request.
public class SessionAuthenticationFilter extends OncePerRequestFilter {
 private final SessionRepository sessions;
 public SessionAuthenticationFilter(SessionRepository sessions) { this.sessions = sessions; }
 static void failure(HttpServletResponse response, int status, String code) throws IOException {
  response.setStatus(status);
  response.setContentType("application/json");
  response.setHeader("Cache-Control", "no-store");
  if (status == 401) response.setHeader("WWW-Authenticate", "Bearer");
  response.getWriter().write("{\"error\":\"" + code + "\"}");
 }
 @Override protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
   FilterChain chain) throws ServletException, IOException {
  String header = request.getHeader("Authorization");
  if (header != null) {
   if (!header.regionMatches(true, 0, "Bearer ", 0, 7)) {
    failure(response, 401, "unauthorized"); return;
   }
   String token = header.substring(7);
   if (token.isEmpty() || token.length() > 4096 || token.chars().anyMatch(Character::isWhitespace)) {
    failure(response, 401, "unauthorized"); return;
   }
   SessionUser user;
   try { user = sessions.findActive(token).orElse(null); }
   catch (DataAccessException e) {
    // Do not log exception details: JDBC diagnostics may contain session tokens.
    logger.error("Session validation database unavailable");
    failure(response, 503, "authentication_unavailable"); return;
   }
   if (user == null) { failure(response, 401, "unauthorized"); return; }
   var context = SecurityContextHolder.createEmptyContext();
   context.setAuthentication(new UsernamePasswordAuthenticationToken(user, null, List.of()));
   SecurityContextHolder.setContext(context);
  }
  chain.doFilter(request, response);
 }
}
