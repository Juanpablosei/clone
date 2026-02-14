# Flujo del login – archivos y rutas

## Rutas (URLs) implicadas

| Ruta | Qué hace |
|------|----------|
| `/` | Home. Si no hay sesión → redirect a `/login`. Si hay sesión → muestra la home. |
| `/login` | Página de login. Si ya hay sesión → redirect a `/admin` o `/` según rol. Si no → muestra el formulario. |
| `/admin` y `/admin/*` | Panel admin. Si no hay sesión → redirect a `/login`. Si rol VIEWER → redirect a `/`. Si no → muestra el panel. |
| `/auth/callback` | Página intermedia (opcional). Si hay sesión, redirige por rol a `/` o `/admin`. |
| `/api/auth/*` | API de NextAuth: CSRF, providers, callback de credentials, session, etc. |

---

## Archivos que intervienen

```
new-website/
├── app/
│   ├── page.tsx                    # Home (/) – exige sesión, redirige a /login
│   ├── login/
│   │   └── page.tsx                # Página /login – comprueba sesión y muestra LoginForm
│   ├── admin/
│   │   └── layout.tsx              # Layout de /admin – exige sesión, VIEWER → /
│   ├── auth/
│   │   └── callback/
│   │       └── page.tsx            # /auth/callback – redirige por rol (VIEWER → /, resto → /admin)
│   └── api/
│       └── auth/
│           └── [...nextauth]/
│               └── route.ts        # GET/POST para toda la API de NextAuth
│
├── components/
│   └── login/
│       └── LoginForm.tsx           # Formulario de login (client), llama a signIn()
│
├── lib/
│   ├── auth.ts                     # Configuración de NextAuth (providers, callbacks, secret)
│   ├── prisma-auth.ts              # Cliente Prisma para la BD de usuarios (DATABASE_URL)
│   └── auth-helpers.ts             # requireAuth, requireEditor, requireAdmin (usan auth())
│
└── docs/
    └── LOGIN-FLOW.md               # Este archivo
```

---

## Flujo paso a paso

### 1. Usuario entra sin sesión

```
Usuario visita "/"
    ↓
app/page.tsx (Home)
    → auth() desde lib/auth.ts
    → session === null
    → redirect("/login")
    ↓
Navegador pide GET /login
```

### 2. Página de login

```
GET /login
    ↓
app/login/page.tsx
    → auth() → session === null
    → return <LoginForm />
    ↓
Se muestra el formulario (components/login/LoginForm.tsx)
```

### 3. Usuario envía email y contraseña

```
Usuario hace submit en LoginForm
    ↓
LoginForm.tsx: signIn("credentials", { email, password, redirect: true, callbackUrl: "/admin" })
    ↓
Cliente NextAuth hace POST /api/auth/callback/credentials
    ↓
app/api/auth/[...nextauth]/route.ts (POST)
    → handlers de lib/auth.ts
    → NextAuth usa Credentials provider
    → authorize(credentials) en lib/auth.ts:
        - prismaAuth.user.findUnique({ where: { email } })  (lib/prisma-auth.ts → DATABASE_URL)
        - bcrypt.compare(password, user.password)
        - Si OK → devuelve { id, email, name, role }
    → Callbacks jwt() y session() guardan role e id en el token/sesión
    → Respuesta: Set-Cookie (cookie de sesión JWT) + 302 redirect a callbackUrl (/admin)
    ↓
Navegador guarda la cookie y sigue el redirect
    ↓
GET /admin (con la cookie ya enviada)
```

### 4. Entrada al panel admin

```
GET /admin (con cookie)
    ↓
app/admin/layout.tsx
    → auth() lee la cookie y devuelve la sesión (JWT)
    → Si !session → redirect("/login")
    → Si session.user.role === "VIEWER" → redirect("/")
    → Si no → renderiza el layout (SessionProvider + AdminNavbar + children)
```

### 5. Si ya había sesión y entra en /login

```
GET /login (con cookie)
    ↓
app/login/page.tsx
    → auth() → session existe
    → Si role ADMIN o EDITOR → redirect("/admin")
    → Si no (VIEWER) → redirect("/")
```

---

## Cómo se lee la sesión (auth())

- **`auth()`** viene de **`lib/auth.ts`** (export de NextAuth).
- En cada petición al servidor (page, layout, API), NextAuth lee la **cookie de sesión** (JWT), la verifica con **AUTH_SECRET** y devuelve `session` o `null`.
- La cookie la pone la respuesta del **POST /api/auth/callback/credentials** (login correcto).
- **prismaAuth** (lib/prisma-auth.ts) usa **DATABASE_URL** y es solo para el paso de **authorize** (comprobar email/password en la BD). La sesión luego es JWT en cookie, no se vuelve a leer la BD en cada request.

---

## Resumen de responsabilidades

| Archivo | Responsabilidad |
|---------|-----------------|
| **lib/auth.ts** | Configuración NextAuth: Credentials, authorize con Prisma + bcrypt, callbacks JWT/session/redirect, pages.signIn, trustHost, secret. |
| **lib/prisma-auth.ts** | Cliente Prisma contra la BD de usuarios (DATABASE_URL). Solo para login (authorize). |
| **app/api/auth/[...nextauth]/route.ts** | Expone GET/POST de NextAuth (csrf, session, callback/credentials, etc.). |
| **app/login/page.tsx** | Si hay sesión → redirect por rol; si no → muestra `<LoginForm />`. |
| **components/login/LoginForm.tsx** | Formulario cliente que llama a `signIn("credentials", ...)` con redirect a `/admin`. |
| **app/admin/layout.tsx** | Si no hay sesión → `/login`; si VIEWER → `/`; si no → layout del admin. |
| **app/page.tsx** | Si no hay sesión → `/login`; si hay → contenido de la home. |
| **app/auth/callback/page.tsx** | Página intermedia: con sesión redirige VIEWER → `/`, resto → `/admin`. (Opcional si usas redirect directo a `/admin` desde el login.) |

---

## Variables de entorno

- **AUTH_SECRET** (o NEXTAUTH_SECRET): para firmar el JWT de la sesión.
- **NEXTAUTH_URL**: en producción (ej. Vercel) para que la cookie use el dominio correcto (en este proyecto se puede derivar de VERCEL_URL en next.config).
- **DATABASE_URL**: usada por **prisma-auth** para buscar el usuario en el login (authorize).
