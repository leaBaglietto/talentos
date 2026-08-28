# Logos de la Agencia

Guardá en esta carpeta todos los logos de tu agencia (por ejemplo: `logo.png`, `logo-dark.svg`, `favicon.ico`, etc.).

## Cómo usarlos en el código:

Dado que esta carpeta está dentro de `public/`, podés hacer referencia a los logos directamente con una ruta absoluta desde el HTML o tus componentes de React sin necesidad de importarlos.

### Ejemplos:

**En HTML (`index.html`):**
```html
<link rel="icon" type="image/svg+xml" href="/logos/favicon.svg" />
```

**En tus componentes de React (`Landing.tsx`, `AdminLayout.tsx`):**
```tsx
<img src="/logos/logo.png" alt="Logo de la Agencia" className="h-12 w-auto" />
```
