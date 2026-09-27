package com.pantrypal.recipes;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RecipeController.class)
class RecipeControllerTest {
 @Autowired MockMvc mvc;
 @MockitoBean RecipeRepository repository;
 private final RecipeDto recipe = new RecipeDto("recipe-1", "虾", "Shrimp", null, null,
  "蒸熟", "Steam", null, 5, 10, 2, "owner", null, List.of(), 4.5, 2);
 @Test void emptyListIsSuccessful() throws Exception {
  when(repository.list(0,25)).thenReturn(List.of());
  mvc.perform(get("/api/v1/recipes")).andExpect(status().isOk())
   .andExpect(jsonPath("$.items").isEmpty()).andExpect(jsonPath("$.hasNext").value(false));
 }
 @Test void paginationFetchesOneExtraAndTrimsIt() throws Exception {
  when(repository.list(2,3)).thenReturn(Collections.nCopies(3, recipe));
  mvc.perform(get("/api/v1/recipes?page=1&size=2")).andExpect(status().isOk())
   .andExpect(jsonPath("$.items.length()").value(2)).andExpect(jsonPath("$.hasNext").value(true));
 }
 @Test void invalidPagesAreRejectedBeforeQuery() throws Exception {
  for (String query : List.of("page=-1", "page=100001", "size=0", "size=101", "page=nope")) {
   mvc.perform(get("/api/v1/recipes?" + query)).andExpect(status().isBadRequest());
  }
  verifyNoInteractions(repository);
 }
 @Test void detailPreservesBilingualAndNullableFields() throws Exception {
  when(repository.find("recipe-1")).thenReturn(Optional.of(recipe));
  mvc.perform(get("/api/v1/recipes/recipe-1")).andExpect(status().isOk())
   .andExpect(jsonPath("$.titleZh").value("虾")).andExpect(jsonPath("$.titleEn").value("Shrimp"))
   .andExpect(jsonPath("$.ingredients").isEmpty()).andExpect(jsonPath("$.averageRating").value(4.5))
   .andExpect(jsonPath("$.ratings").doesNotExist());
 }
 @Test void missingRecipeIs404() throws Exception {
  when(repository.find("missing")).thenReturn(Optional.empty());
  mvc.perform(get("/api/v1/recipes/missing")).andExpect(status().isNotFound());
 }
 @Test void databaseErrorDoesNotLeakCredentialsToResponse() throws Exception {
  when(repository.list(0,25)).thenThrow(new DataAccessResourceFailureException("private connection details"));
  mvc.perform(get("/api/v1/recipes")).andExpect(status().isServiceUnavailable())
   .andExpect(jsonPath("$.detail").value("Recipe database is temporarily unavailable."));
 }
 @Test void writesAreNotExposed() throws Exception {
  mvc.perform(post("/api/v1/recipes").contentType("application/json").content("{}"))
   .andExpect(status().isMethodNotAllowed());
 }
}
