package com.pantrypal.recipes;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/v1/me")
public class CurrentUserController {
 private final RecipeAccessService access;
 public CurrentUserController(RecipeAccessService access) { this.access = access; }
 @GetMapping public SessionUser me(@AuthenticationPrincipal SessionUser user) { return user; }
 @GetMapping("/recipes/{id}")
 public RecipeAccessService.RecipeAccess context(@PathVariable String id, @AuthenticationPrincipal SessionUser user) {
  return access.forUser(id, user.id());
 }
 @GetMapping("/recipes/{id}/edit-permission")
 public void editPermission(@PathVariable String id, @AuthenticationPrincipal SessionUser user) {
  access.requireOwner(id, user.id());
 }
}
