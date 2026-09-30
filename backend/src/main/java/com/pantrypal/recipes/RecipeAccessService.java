package com.pantrypal.recipes;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
@Service
public class RecipeAccessService {
 public record RecipeAccess(boolean isOwner, boolean isFavorited, Integer userRating) {}
 private final JdbcClient jdbc;
 private final String sql;
 public RecipeAccessService(JdbcClient jdbc) throws IOException {
  this.jdbc = jdbc;
  sql = new ClassPathResource("recipe-access.sql").getContentAsString(StandardCharsets.UTF_8);
 }
 public RecipeAccess forUser(String recipeId, String userId) {
  return jdbc.sql(sql).param("recipeId", recipeId).param("userId", userId)
   .query((rs, n) -> new RecipeAccess(rs.getBoolean(1), rs.getBoolean(2), rs.getObject(3, Integer.class)))
   .optional().orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
 }
 public void requireOwner(String recipeId, String userId) {
  if (!forUser(recipeId, userId).isOwner()) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
 }
}
