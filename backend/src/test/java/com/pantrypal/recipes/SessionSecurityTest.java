package com.pantrypal.recipes;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;
import jakarta.servlet.http.Cookie;
import java.util.List;
import java.util.Optional;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
@WebMvcTest({CurrentUserController.class, RecipeController.class})
@Import(SecurityConfig.class)
class SessionSecurityTest {
 @Autowired MockMvc mvc;
 @MockitoBean SessionRepository sessions;
 @MockitoBean RecipeAccessService access;
 @MockitoBean RecipeRepository recipes;
 @BeforeEach void configure() {
  when(sessions.findActive("valid-owner")).thenReturn(Optional.of(new SessionUser("owner","Owner",null)));
  when(sessions.findActive("valid-other")).thenReturn(Optional.of(new SessionUser("other","Other",null)));
 }
 @Test void publicReadNeedsNoLogin() throws Exception {
  when(recipes.list(0,25,"","")).thenReturn(List.of());
  mvc.perform(get("/api/v1/recipes")).andExpect(status().isOk());
  verifyNoInteractions(sessions);
 }
 @Test void protectedRouteRequiresToken() throws Exception {
  mvc.perform(get("/api/v1/me")).andExpect(status().isUnauthorized())
   .andExpect(header().string("WWW-Authenticate","Bearer"));
 }
 @Test void cookieOrUserIdCannotImpersonate() throws Exception {
  mvc.perform(get("/api/v1/me").header("X-User-Id","owner").param("userId","owner")
   .cookie(new Cookie("authjs.session-token","valid-owner"))).andExpect(status().isUnauthorized());
  verifyNoInteractions(sessions);
 }
 @Test void expiredAndRevokedSessionsRejected() throws Exception {
  for(String token:List.of("expired","revoked","unknown")) {
   when(sessions.findActive(token)).thenReturn(Optional.empty());
   mvc.perform(get("/api/v1/me").header("Authorization","Bearer "+token)).andExpect(status().isUnauthorized());
  }
 }
 @Test void malformedCredentialsRejectedWithoutDatabase() throws Exception {
  for(String header:List.of("Basic abc","Bearer ","Bearer a b","Bearer "+"x".repeat(4097)))
   mvc.perform(get("/api/v1/me").header("Authorization",header)).andExpect(status().isUnauthorized());
  verifyNoInteractions(sessions);
 }
 @Test void authenticatedResponseIsPrivateAndHasNoToken() throws Exception {
  mvc.perform(get("/api/v1/me").header("Authorization","Bearer valid-owner"))
   .andExpect(status().isOk()).andExpect(jsonPath("$.id").value("owner"))
   .andExpect(jsonPath("$.sessionToken").doesNotExist())
   .andExpect(header().string("Cache-Control", org.hamcrest.Matchers.containsString("no-store")));
 }
 @Test void identityIsNotReusedOnNextRequest() throws Exception {
  mvc.perform(get("/api/v1/me").header("Authorization","Bearer valid-owner")).andExpect(status().isOk());
  mvc.perform(get("/api/v1/me")).andExpect(status().isUnauthorized());
 }
 @Test void usesAuthenticatedIdentityForRecipeContext() throws Exception {
  when(access.forUser("r","other")).thenReturn(new RecipeAccessService.RecipeAccess(false,true,4));
  mvc.perform(get("/api/v1/me/recipes/r").header("Authorization","Bearer valid-other").param("userId","owner"))
   .andExpect(status().isOk()).andExpect(jsonPath("$.isOwner").value(false))
   .andExpect(jsonPath("$.isFavorited").value(true)).andExpect(jsonPath("$.userRating").value(4));
  verify(access).forUser("r","other");
 }
 @Test void actualOwnershipGuardRejectsOtherUser() throws Exception {
  when(access.forUser("r","other")).thenReturn(new RecipeAccessService.RecipeAccess(false,false,null));
  doCallRealMethod().when(access).requireOwner("r","other");
  mvc.perform(get("/api/v1/me/recipes/r/edit-permission").header("Authorization","Bearer valid-other"))
   .andExpect(status().isForbidden());
 }
 @Test void actualOwnershipGuardAcceptsOwner() throws Exception {
  when(access.forUser("r","owner")).thenReturn(new RecipeAccessService.RecipeAccess(true,false,null));
  doCallRealMethod().when(access).requireOwner("r","owner");
  mvc.perform(get("/api/v1/me/recipes/r/edit-permission").header("Authorization","Bearer valid-owner"))
   .andExpect(status().isOk());
 }
 @Test void missingRecipeIs404ForAuthenticatedUser() throws Exception {
  when(access.forUser("missing","owner")).thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND));
  mvc.perform(get("/api/v1/me/recipes/missing").header("Authorization","Bearer valid-owner"))
   .andExpect(status().isNotFound());
 }
 @Test void authenticationDatabaseFailureIs503NotAnonymous() throws Exception {
  when(sessions.findActive("db-failure")).thenThrow(new DataAccessResourceFailureException("sensitive details"));
  mvc.perform(get("/api/v1/me").header("Authorization","Bearer db-failure"))
   .andExpect(status().isServiceUnavailable()).andExpect(jsonPath("$.error").value("authentication_unavailable"));
 }
 @Test void writesRemainDeniedEvenForLoggedInUsers() throws Exception {
  mvc.perform(post("/api/v1/recipes").header("Authorization","Bearer valid-owner"))
   .andExpect(status().isForbidden());
 }
}
