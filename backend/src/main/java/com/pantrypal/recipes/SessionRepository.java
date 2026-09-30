package com.pantrypal.recipes;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Optional;
@Repository
public class SessionRepository {
 private final JdbcClient jdbc;
 private final String sql;
 public SessionRepository(JdbcClient jdbc) throws IOException {
  this.jdbc = jdbc;
  sql = new ClassPathResource("session-user.sql").getContentAsString(StandardCharsets.UTF_8);
 }
 public Optional<SessionUser> findActive(String token) {
  return jdbc.sql(sql).param("token", token)
   .query((rs, n) -> new SessionUser(rs.getString(1), rs.getString(2), rs.getString(3))).optional();
 }
}
