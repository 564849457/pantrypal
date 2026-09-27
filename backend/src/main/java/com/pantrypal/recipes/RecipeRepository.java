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
 public RecipeRepository(JdbcClient jdbc, ObjectMapper mapper) throws IOException {
  this.jdbc = jdbc; this.mapper = mapper;
  this.select = new ClassPathResource("recipe-select.sql").getContentAsString(StandardCharsets.UTF_8);
 }
 public List<RecipeDto> list(int offset, int limit) {
  return jdbc.sql(select + " ORDER BY r.\"createdAt\" DESC, r.id ASC LIMIT :limit OFFSET :offset")
   .param("limit", limit).param("offset", offset).query(String.class).list().stream().map(this::decode).toList();
 }
 public Optional<RecipeDto> find(String id) {
  return jdbc.sql(select + " WHERE r.id = :id").param("id", id).query(String.class).optional().map(this::decode);
 }
 private RecipeDto decode(String json) {
  try { return mapper.readValue(json, RecipeDto.class); }
  catch (JsonProcessingException e) { throw new IllegalStateException("Invalid recipe result", e); }
 }
}
