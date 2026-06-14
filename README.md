# Mix Together 

Aplicación web para descubrir, guardar y crear cócteles y mocktails.

## Aplicación desplegada

**URL:** https://mix-together.vercel.app/

## Tecnologías utilizadas

- **Next.js** (App Router) – framework React con API Routes
- **React** – interfaz de usuario
- **Tailwind CSS** – estilos
- **Supabase** – base de datos PostgreSQL y autenticación
- **Vercel** – despliegue y hosting
- **react-icons** – iconografía (Ionicons)

## Funcionalidades

- Registro e inicio de sesión de usuarios
- Catálogo de cócteles y mocktails con búsqueda y filtros (sabor, base)
- Página de detalle de cada bebida (ingredientes, pasos de preparación)
- Perfil de usuario editable, con bebidas favoritas
- Área de mezclas: CRUD completo de mezclas propias del usuario
- API Routes propias conectadas a Supabase para todas las operaciones CRUD

## Instrucciones para ejecutar en local

1. Clona el repositorio:
```bash
   git clone <URL_DEL_REPOSITORIO>
   cd mixtogether
```

2. Instala las dependencias:
```bash
   npm install
```

3. Crea un archivo `.env.local` en la raíz del proyecto con tus credenciales de Supabase:
NEXT_PUBLIC_SUPABASE_URL=https://hiskhfhkrikidbgoilrp.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_mADMt1lSOBqZwpuT6SJLjw_gGwagRUm

4. Ejecuta el servidor de desarrollo:
```bash
   npm run dev
```

5. Abre [http://localhost:3000] en el navegador.

## Base de datos

El proyecto utiliza Supabase con las siguientes tablas:
- `profiles` – perfiles de usuario
- `drinks` – catálogo de cócteles y mocktails
- `mixes` – mezclas creadas por usuarios
- `favorites` – bebidas favoritas de cada usuario

## Autor

Pablo Pérez Palacín 2º DAM // Proyecto de Desarrollo de Interfaces