// Auth.js v5 defaults. Keep in sync if src/auth.ts customizes cookies.
// Never import this helper into a client component or return the token to a client.
export function sessionTokenFromCookies(cookies: { name: string; value: string }[]): string | null {
  for (const name of ["__Secure-authjs.session-token", "authjs.session-token"]) {
    const direct = cookies.filter(cookie => cookie.name === name);
    const chunks = cookies.filter(cookie => cookie.name.startsWith(`${name}.`));
    if (direct.length) {
      if (direct.length !== 1 || chunks.length) return null;
      return valid(direct[0].value);
    }
    if (chunks.length) {
      const parts = chunks.map(cookie => ({
        index: /^\d+$/.test(cookie.name.slice(name.length + 1)) ? Number(cookie.name.slice(name.length + 1)) : -1,
        value: cookie.value,
      })).sort((a, b) => a.index - b.index);
      if (parts.some((part, index) => part.index !== index)) return null;
      return valid(parts.map(part => part.value).join(""));
    }
  }
  return null;
}
function valid(token: string) {
  return token.length > 0 && token.length <= 4096 && !/[\s\x00-\x1f\x7f]/.test(token) ? token : null;
}
