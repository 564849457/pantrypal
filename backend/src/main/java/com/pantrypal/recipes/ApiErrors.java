package com.pantrypal.recipes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
@RestControllerAdvice
public class ApiErrors {
 private static final Logger log = LoggerFactory.getLogger(ApiErrors.class);
 @ExceptionHandler(DataAccessException.class)
 ResponseEntity<ProblemDetail> databaseUnavailable(DataAccessException exception) {
  log.error("Recipe database request failed", exception);
  return ResponseEntity.status(503).body(ProblemDetail.forStatusAndDetail(
   HttpStatus.SERVICE_UNAVAILABLE, "Recipe database is temporarily unavailable."));
 }
}
