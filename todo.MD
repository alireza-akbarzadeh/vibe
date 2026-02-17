<!-- Auth error -->

The `state_mismatch` error occurs when an OAuth flow begins and a unique `state` value is generated and stored in a cookie[](https://www.better-auth.com/docs/reference/errors/state_mismatch). After the user returns from the OAuth provider, this `state` is compared with the one provided in the callback[](https://www.better-auth.com/docs/reference/errors/state_mismatch). If they don't match, the request is rejected to prevent unauthorized access[](https://www.better-auth.com/docs/reference/errors/state_mismatch).

This check exists to prevent CSRF (Cross-Site Request Forgery) and replay attacks during the OAuth flow - basically, to make sure the callback that hits your `/api/auth/callback` endpoint really belongs to the same browser session that started it[](https://www.better-auth.com/docs/reference/errors/state_mismatch).

## Common Causes

The most frequent causes include[](https://www.better-auth.com/docs/reference/errors/state_mismatch):

- The cookie wasn't set or readable during callback (common with `.vercel.app` preview domains or cross-domain issues)[](https://www.better-auth.com/docs/reference/errors/state_mismatch)
- The cookie domain/path doesn't match between your app and callback route[](https://www.better-auth.com/docs/reference/errors/state_mismatch)
- The browser blocked third-party cookies (especially on Safari / iOS)[](https://www.better-auth.com/docs/reference/errors/state_mismatch)
- You started the OAuth flow in one tab but finished it in another (different cookie context)[](https://www.better-auth.com/docs/reference/errors/state_mismatch)
- The preview vs production domain mismatch (e.g., `preview.myapp.com` vs `myapp.com`)[](https://www.better-auth.com/docs/reference/errors/state_mismatch)

## How to Resolve

To fix this error[](https://www.better-auth.com/docs/reference/errors/state_mismatch):

**Use a constant domain** - The best fix is to use a constant domain for your app and callback route[](https://www.better-auth.com/docs/reference/errors/state_mismatch). Avoid `.vercel.app` subdomains - browsers treat them as public suffixes, so cookies can't be shared across subdomains[](https://www.better-auth.com/docs/reference/errors/state_mismatch).

**Verify cookie configurations** - Check that cookies are not blocked by browser settings or privacy modes[](https://www.better-auth.com/docs/reference/errors/state_mismatch). Ensure you're starting and ending the OAuth flow in the same browser session[](https://www.better-auth.com/docs/reference/errors/state_mismatch).

**Skip state cookie check** - If you know what you are doing, you can skip the state cookie check by setting the `account.skipStateCookieCheck` option to `true` in your auth config[](https://www.better-auth.com/docs/reference/errors/state_mismatch). Please note that this is a security risk and should only be enabled if you know what you are doing[](https://www.better-auth.com/docs/reference/errors/state_mismatch).

**Production Debug** - Head to your production site, and use your browser's DevTools → Application → Cookies to confirm the state cookie is being set before redirect and still exists when the OAuth provider redirects back[](https://www.better-auth.com/docs/reference/errors/state_mismatch).

<!-- new  -->
