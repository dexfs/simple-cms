# Roteiro de prática: React + TailwindCSS + Context API

**Objetivo:** praticar Context API, estados de interface e formulários em React usando APIs públicas como backend pronto.

## Dia 1 — Context API de sessão e formulário de login

**APIs:** [ReqRes](https://reqres.in/) (`POST /api/login`) e [JSONPlaceholder](https://jsonplaceholder.typicode.com/)

- Criar um `AuthContext` global para guardar o token e o usuário autenticado.
- Implementar um formulário de login com validação: campos preenchidos e e-mail válido.
- Persistir o token no `localStorage` e restaurá-lo quando a aplicação iniciar.
- Proteger uma rota: usuários não autenticados devem ser encaminhados para o login.

**Praticar:** `createContext`, `useContext`, `useState`, inputs controlados, validação, persistência e estados de envio (botão desabilitado, indicador de carregamento e erros).

**Desafio:** implementar do zero um estado semelhante a este, adaptando os tipos ao projeto:

```tsx
type AuthState = {
  token: string | null;
  user: User | null;
  loading: boolean;
};

// O contexto deve oferecer login(email, password) e logout().
```

## Dia 1.5 — Migrar a autenticação para DummyJSON

**API:** [DummyJSON](https://dummyjson.com/docs/auth) (`POST /auth/login`, `GET /auth/me`, `POST /auth/refresh`)

**Motivo:** usar uma única API para auth, posts e produtos. Com ReqRes + JSONPlaceholder, o usuário logado não existe na API de posts.

- Trocar o login para `POST /auth/login` com `{ username, password }` (conta de teste: `emilys` / `emilyspass`). O campo do formulário passa de e-mail para username.
- Usar a resposta do login, que já traz `accessToken`, `refreshToken` e os dados do usuário. Remover a busca em `/api/users`.
- Ler a mensagem de erro de `message` (no ReqRes era `error`).
- Atualizar o tipo `User` (`id`, `username`, `email`, `firstName`, `lastName`, `image`), o `readStoredAuth` e o header (iniciais e avatar).
- Ao iniciar, validar o token salvo com `GET /auth/me` (`Authorization: Bearer <token>`); se der 401, limpar a sessão.
- Opcional: renovar o token com `POST /auth/refresh` quando receber 401.

**Praticar:** troca de contrato de API, header `Authorization`, validação de sessão no carregamento (o estado `loading` passa a esperar uma requisição real) e tratamento de 401.

## Dia 2 — Listagem e formulário de criação

**API:** [DummyJSON](https://dummyjson.com/docs/posts) (`/posts`, `/posts/add`, `/posts/:id/comments`, `/auth/posts` com token)

> `POST /posts/add` responde 201, mas sempre com `id: 252` e não salva nada. Gere um id local para o novo post.

- Criar uma página que lista posts, disponibilizando os dados por contexto.
- Criar um formulário para publicar um post, validando título obrigatório e tamanho mínimo.
- Enviar os dados via `POST` e atualizar a lista local sem recarregar a página.
- Tratar carregamento com skeleton, erros com mensagem amigável e opção de tentar novamente.

**Praticar:** `useEffect`, `fetch`, `AbortController`, cleanup de efeitos, estados de interface, formulários controlados e atualização de estado global.

## Dia 3 — Busca, filtros e Context API de carrinho

**API:** [DummyJSON](https://dummyjson.com/) (`/products?search=`)

- Criar uma barra de busca com debounce para aguardar a pausa na digitação antes de consultar a API.
- Combinar filtros por categoria e faixa de preço.
- Guardar o carrinho em um contexto, com ações para adicionar e remover itens.
- Calcular o total do carrinho.
- Buscar produtos com paginação, por exemplo, usando `limit` e `skip`.

**Praticar:** debounce, filtros combinados, Context API, organização de estado e `useMemo` para calcular o total.

## Dia 4 — Projeto final: mini e-commerce

Integrar os exercícios anteriores em uma aplicação:

- Autenticação do Dia 1 protegendo o checkout.
- Catálogo com busca e filtros do Dia 3.
- Carrinho global usando Context API.
- Formulário de checkout validado e resumo do pedido.

**Praticar:** composição de múltiplos contextos, organização da aplicação e explicação das decisões técnicas em inglês.

## Referências

- [React — Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context)
- [React — Managing State](https://react.dev/learn/managing-state)
- [DummyJSON — documentação](https://dummyjson.com/docs)
- [JSONPlaceholder](https://jsonplaceholder.typicode.com/)
- [ReqRes](https://reqres.in/)

## Observação de estudo

Neste roteiro, a ideia é praticar a lógica de busca de dados com `fetch`, `AbortController` e cleanup de efeitos antes de adotar bibliotecas como TanStack Query ou SWR.
