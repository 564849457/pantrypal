package com.pantrypal.recipes;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;
@Repository
public class RecipeRepository {
 private final JdbcClient jdbc;
 private final ObjectMapper mapper;
 private final String select;
 private final String filter;
 public RecipeRepository(JdbcClient jdbc, ObjectMapper mapper) throws IOException {
  this.jdbc = jdbc; this.mapper = mapper;
  this.filter = new ClassPathResource("recipe-filter.sql").getContentAsString(StandardCharsets.UTF_8);
  this.select = new ClassPathResource("recipe-select.sql").getContentAsString(StandardCharsets.UTF_8);
 }
 public List<RecipeDto> list(int offset, int limit, String q, String category) {
  return jdbc.sql(select + filter + " ORDER BY r.\"createdAt\" DESC, r.id ASC LIMIT :limit OFFSET :offset")
   .param("q", q).param("category", category).param("limit", limit).param("offset", offset).query(String.class).list().stream().map(this::decode).toList();
 }
 public List<RecipeDto.Category> categories() {
  return jdbc.sql("SELECT c.id, c.\"nameZh\", c.\"nameEn\" FROM \"Category\" c WHERE EXISTS (SELECT 1 FROM \"Recipe\" r WHERE r.\"categoryId\" = c.id) ORDER BY c.\"nameEn\", c.id")
   .query((rs, row) -> new RecipeDto.Category(rs.getString(1), rs.getString(2), rs.getString(3))).list();
 }
 public Optional<RecipeDto> find(String id) {
  return jdbc.sql(select + " WHERE r.id = :id").param("id", id).query(String.class).optional().map(this::decode);
 }
 private RecipeDto decode(String json) {
  try { return mapper.readValue(json, RecipeDto.class); }
  catch (JsonProcessingException e) { throw new IllegalStateException("Invalid recipe result", e); }
 }
}
