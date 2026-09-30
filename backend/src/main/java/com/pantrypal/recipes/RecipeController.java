package com.pantrypal.recipes;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
@RestController
@RequestMapping("/api/v1/recipes")
public class RecipeController {
 private final RecipeRepository repository;
 public RecipeController(RecipeRepository repository) { this.repository = repository; }
 public record RecipePage(List<RecipeDto> items, int page, int size, boolean hasNext) {}
 @GetMapping
 public RecipePage list(@RequestParam(defaultValue="0") @Min(0) @Max(100000) int page,
   @RequestParam(defaultValue="24") @Min(1) @Max(100) int size,
   @RequestParam(defaultValue="") @Size(max=120) String q,
   @RequestParam(defaultValue="") @Size(max=128) String category) {
  var rows = repository.list(page * size, size + 1, q.strip(), category.strip());
  return new RecipePage(rows.stream().limit(size).toList(), page, size, rows.size() > size);
 }
 @GetMapping("/categories")
 public List<RecipeDto.Category> categories() { return repository.categories(); }
 @GetMapping("/{id}")
 public RecipeDto detail(@PathVariable String id) {
  return repository.find(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
 }
}
