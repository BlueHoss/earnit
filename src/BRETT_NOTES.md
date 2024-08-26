# Environment Variables

Best Practices:

Use \$env/static/public and \$env/static/private for most cases.

These are type-safe and prevent accidental exposure of private variables.

Use import.meta.env.VITE\_\* in components when you need to access public variables directly.

Avoid using process.env in SvelteKit applications. It's not available in all environments and doesn't provide type safety.

For truly dynamic variables that might change at runtime, use $env/dynamic/private or $env/dynamic/public.

Always prefix public variables with VITE\_ in your .env files.

Don't prefix private variables; just use descriptive names like DATABASE_URL.

Use TypeScript? Create a src/app.d.ts file to declare your environment variables for better type checking:

## Can I use import.meta.env. for private variables?

No, you should not use import.meta.env for private variables in SvelteKit. Here's why:

Security: import.meta.env is primarily intended for use with public variables (those prefixed with VITE\_) and is accessible in both server-side and client-side code. Using it for private variables could potentially expose sensitive information to the client.

Vite behavior: Vite, which SvelteKit uses, only includes environment variables prefixed with VITE\_ in import.meta.env. Other variables won't be available through this method.

SvelteKit's design: SvelteKit intentionally separates public and private environment variables to prevent accidental exposure of sensitive data.

Instead of using import.meta.env for private variables, you should use the following methods:

### For static private variables:

In server-side files only (e.g., +page.server.js, hooks.server.js)

```
import { DATABASE_URL, SECRET_KEY } from '$env/static/private';

console.log(DATABASE_URL);
console.log(SECRET_KEY);
```

### For dynamic private variables:

In server-side files only

```
import { env } from '$env/dynamic/private';

console.log(env.DATABASE_URL);
console.log(env.SECRET_KEY);
```

These methods ensure that:

- Private variables are only accessible in server-side code.
- You get type checking and autocomplete for your environment variables.
- There's no risk of accidentally exposing sensitive information to the client.

### For public environment variables

// In .js, .ts, or .svelte files

```
import { PUBLIC_API_URL } from '$env/static/public';
console.log(PUBLIC_API_URL);

// Or
console.log(import.meta.env.VITE_PUBLIC_API_URL);
```
