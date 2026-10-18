# Layout reference

Static HTML + Tailwind (v4 browser CDN) screens for the study plan in
`../roteiro_pratica_react_apis_publicas.md`. Open `index.html` in a browser.

| File             | Day | Screen                                  |
| ---------------- | --- | --------------------------------------- |
| `login.html`     | 1   | Login form + submit/session states      |
| `posts.html`     | 2   | Posts list + create form + list states  |
| `products.html`  | 3   | Catalog, filters, pagination, cart      |
| `checkout.html`  | 4   | Protected checkout + order confirmation |

Sections labelled **"State: …"** are not part of the page. They show how each
UI state should look so you can render it with conditionals.

## Suggested component map

```
<AuthProvider>            // token, user, loading, login(), logout()
  <CartProvider>          // items, add(), remove(), setQty(), total (useMemo)
    <AppHeader />         // nav, cart badge (count from CartContext), user/login
    <Routes>
      /login     <LoginPage>     → <LoginForm />
      /posts     <PostsProvider> → <CreatePostForm />, <PostList> → <PostItem />
      /products  <ProductsPage>  → <ProductFilters />, <ProductGrid> → <ProductCard />,
                                   <Pagination />, <CartPanel> → <CartItem />, <CartSummary />
      /checkout  <ProtectedRoute> → <CheckoutForm />, <OrderSummary />, <OrderConfirmation />
```

## Review notes to keep in mind while building

- **Auth restore:** while `auth.loading` is true on startup, `ProtectedRoute`
  must render a loader, not redirect. Otherwise a logged-in user gets bounced to
  `/login` on refresh.
- **Redirect back:** pass the original location to `/login` and return there
  after login (the checkout flow depends on this).
- **Fetch effects:** every effect that fetches needs an `AbortController` and
  must ignore `AbortError` in the catch, or you'll show an error on every
  re-render/StrictMode double-run.
- **Debounce:** debounce the *value*, not the fetch call. A `useDebouncedValue`
  hook keeps the effect simple. Reset to page 1 when any filter changes.
- **Filters + DummyJSON:** `/products/search?q=` and `/products/category/:name`
  are separate endpoints. Price filtering is not supported by the API, so decide
  (and be able to explain) whether you filter client-side per page.
- **Cart state:** store `{ id, title, price, qty }` per item, and derive total
  and count. Don't keep `total` in state.
- **Context value:** memoize the provider value (`useMemo`) so consumers don't
  re-render on every parent render.
- **Forms:** show field errors after blur or submit, not on first keystroke.
  Link errors with `aria-describedby` and set `aria-invalid`, as in the layouts.
- **JSONPlaceholder POST** always returns `id: 101`. Generate a local id for
  keys, or new posts will collide.
