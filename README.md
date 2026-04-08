# RetailAseo

**Backend API — Node.js + Express + PostgreSQL + Sequelize**  
Versión 1.0.0 · Entorno: Development

---

## Descripción General

RetailAseo es una API RESTful para la gestión de una tienda de artículos de aseo. Permite administrar usuarios, productos, categorías, órdenes de compra y entregas, con autenticación JWT y control de acceso por roles.

---

## Stack Tecnológico

| Tecnología | Rol en el Proyecto |
|---|---|
| Node.js | Entorno de ejecución JavaScript en servidor |
| Express.js | Framework para construcción de la API REST |
| PostgreSQL | Base de datos relacional principal |
| Sequelize ORM | Mapeo objeto-relacional, migraciones y validaciones |
| JSON Web Tokens (JWT) | Autenticación y autorización stateless |
| dotenv | Gestión de variables de entorno |
| Multer | Manejo de subida de archivos e imágenes |

---

## Estructura del Proyecto

```
retail-aseo/
├── app.js                    # Punto de entrada y configuración de Express
├── public/                   # Archivos estáticos (frontend)
├── uploads/                  # Imágenes subidas por usuarios
├── logs/                     # Logs de requests HTTP (logs.txt)
└── src/
    ├── config/
    │   └── database.js       # Configuración de conexión Sequelize
    ├── models/
    │   ├── index.js          # Asociaciones entre modelos
    │   ├── User.js           # Modelo de usuarios
    │   ├── Product.js        # Modelo de productos
    │   ├── Category.js       # Modelo de categorías
    │   ├── Order.js          # Modelo de órdenes
    │   ├── OrderItem.js      # Items dentro de una orden
    │   └── Delivery.js       # Entregas asociadas a órdenes
    ├── routes/
    │   ├── index.js          # Router raíz (/api)
    │   ├── authRoutes.js     # Rutas de autenticación
    │   ├── userRoutes.js     # Rutas de usuarios
    │   ├── productsRoutes.js # Rutas de productos
    │   ├── categoryRoutes.js # Rutas de categorías
    │   ├── orderRoutes.js    # Rutas de órdenes
    │   └── uploadsRoutes.js  # Rutas de subida de archivos
    ├── controllers/
    │   ├── authController.js       # Registro e inicio de sesión
    │   ├── categoryController.js   # Listado y búsqueda de categorías
    │   ├── orderController.js      # Gestión de pedidos y transacciones
    │   ├── ProductController.js    # CRUD de productos con filtros
    │   ├── uploadController.js     # Manejo de subida de archivos
    │   └── userController.js       # Gestión de usuarios
    └── middleware/
        ├── authMiddleware.js  # Verificación JWT y roles
        ├── errorMiddleware.js # Manejo global de errores
        └── loggerMiddleware.js# Log de requests HTTP
```

---

## Modelos de Datos

### User

Representa a clientes y administradores de la tienda.

| Campo | Tipo | Descripción |
|---|---|---|
| id | INTEGER (PK) | Identificador único autoincremental |
| nombre | STRING(100) | Nombre completo del usuario |
| email | STRING(150) | Email único, con validación de formato |
| password | STRING(255) | Contraseña hasheada |
| telefono | STRING(20) | Teléfono de contacto (opcional) |
| rol | ENUM | `"admin"` o `"cliente"` (default: cliente) |
| avatar | STRING(255) | Ruta a imagen de perfil (opcional) |

### Product

Productos disponibles en el catálogo de la tienda.

| Campo | Tipo | Descripción |
|---|---|---|
| id | INTEGER (PK) | Identificador único |
| nombre | STRING(150) | Nombre del producto (requerido) |
| descripcion | TEXT | Descripción detallada (opcional) |
| precio | DECIMAL(10,2) | Precio del producto (no negativo) |
| stock | INTEGER | Unidades disponibles (default: 0) |
| fechaVencimiento | DATEONLY | Fecha de vencimiento (opcional) |
| imagen | STRING(255) | Ruta a imagen del producto |
| categoryId | INTEGER (FK) | Referencia a la categoría |

### Category

Categorías para agrupar los productos.

| Campo | Tipo | Descripción |
|---|---|---|
| id | INTEGER (PK) | Identificador único |
| nombre | STRING(80) | Nombre de la categoría (requerido) |
| descripcion | TEXT | Descripción de la categoría (opcional) |

### Order

Registra cada compra realizada por un usuario.

| Campo | Tipo | Descripción |
|---|---|---|
| id | INTEGER (PK) | Identificador único |
| total | DECIMAL(10,2) | Total de la orden (default: 0) |
| estado | ENUM | `pendiente` / `confirmado` / `en_preparacion` / `enviado` / `entregado` / `cancelado` |
| tipoEntrega | ENUM | `"retiro"` o `"despacho"` |
| direccionEntrega | STRING(255) | Dirección de despacho (si aplica) |
| userId | INTEGER (FK) | Usuario que realizó la orden |

### OrderItem

Tabla intermedia que registra cada producto dentro de una orden.

| Campo | Tipo | Descripción |
|---|---|---|
| id | INTEGER (PK) | Identificador único |
| cantidad | INTEGER | Unidades del producto (mínimo: 1) |
| precioUnitario | DECIMAL(10,2) | Precio al momento de la compra |
| orderId | INTEGER (FK) | Referencia a la orden |
| productId | INTEGER (FK) | Referencia al producto |

### Delivery

Entrega asociada a una orden cuando el tipo de entrega es despacho.

| Campo | Tipo | Descripción |
|---|---|---|
| id | INTEGER (PK) | Identificador único |
| estado | ENUM | `preparando` / `en_camino` / `entregado` / `fallido` |
| direccion | STRING(255) | Dirección de entrega (requerido) |
| fechaEstimada | DATEONLY | Fecha estimada de entrega |
| observaciones | TEXT | Notas adicionales (opcional) |
| orderId | INTEGER (FK) | Orden asociada (única) |

---

## Relaciones entre Modelos

| Relación | Tipo | Descripción |
|---|---|---|
| User → Order | 1 : N | Un usuario puede tener múltiples órdenes |
| Category → Product | 1 : N | Una categoría puede tener múltiples productos |
| Product ↔ Order | N : M (via OrderItem) | Un producto puede aparecer en múltiples órdenes y viceversa |
| Order → Delivery | 1 : 1 | Cada orden tiene como máximo una entrega |

---

## Controladores

### `authController.js`

Gestiona el registro e inicio de sesión de usuarios.

| Función | Descripción |
|---|---|
| `register(req, res, next)` | Crea un nuevo usuario validando que `nombre`, `email` y `password` estén presentes. Verifica que el email no esté ya registrado (retorna `409` si existe). Retorna `200` con mensaje de éxito. |
| `login(req, res, next)` | Valida las credenciales del usuario. Busca al usuario por email y retorna mensaje genérico `401` si no existe, para no revelar información sensible. |

> **Bugs conocidos:** Los parámetros `res` y `req` están invertidos en `register`. No se genera ni retorna el JWT en ninguna de las dos funciones. La contraseña no se hashea antes de guardar.

---

### `categoryController.js`

Listado y consulta de categorías con sus productos asociados.

| Función | Descripción |
|---|---|
| `getAll(req, res, next)` | Lista todas las categorías ordenadas por nombre. Soporta búsqueda dinámica por nombre mediante el query param `?search=` (case-insensitive con `Op.iLike`). Incluye los productos asociados (`id`, `nombre`, `precio`, `stock`). |
| `getById(req, res, next)` | Devuelve una categoría específica por ID con todos sus productos. Retorna `404` si no se encuentra. |

> **Bug conocido:** En `getAll`, el `catch` tiene un error de sintaxis: `next/(err)` en lugar de `next(err)`, por lo que los errores no se propagan correctamente al middleware de errores.

---

### `orderController.js`

Gestión completa de pedidos. Usa transacciones de Sequelize para garantizar la integridad de datos: si cualquier paso falla, se revierten todos los cambios.

| Función | Descripción |
|---|---|
| `getAll(req, res, next)` | Lista pedidos ordenados por fecha de creación (más reciente primero). Los administradores ven todos los pedidos; los clientes solo ven los suyos. Incluye datos del usuario, items con producto, y entrega. |
| `getById(req, res, next)` | Devuelve un pedido específico por ID. Retorna `404` si no existe. Retorna `403` si un cliente intenta acceder a un pedido ajeno. Incluye usuario, items y entrega. |
| `create(req, res, next)` | Crea un pedido en 5 pasos atómicos dentro de una transacción: (1) valida stock de cada producto, (2) crea la orden, (3) crea los `OrderItem`, (4) descuenta el stock, (5) crea el `Delivery` si el tipo es `"despacho"`. La fecha estimada de entrega se calcula en +3 días. Retorna `201` con la orden completa. |
| `updateEstado(req, res, next)` | Actualiza el campo `estado` de una orden. Solo accesible para administradores. Retorna `404` si el pedido no existe. |

> **Bug conocido:** Los parámetros `res` y `req` están invertidos en `getById`, lo que impide acceder correctamente al body y params de la petición.

**Body esperado para `create`:**
```json
{
  "items": [
    { "productId": 1, "cantidad": 2 }
  ],
  "tipoEntrega": "despacho",
  "direccionEntrega": "Av. Ejemplo 123"
}
```

---

### `ProductController.js`

CRUD completo de productos con soporte para filtros en el listado.

| Función | Descripción |
|---|---|
| `getAll(req, res, next)` | Lista todos los productos ordenados por nombre. Soporta los query params `?search=`, `?category=`, `?minPrice=` y `?maxPrice=` para filtrar resultados. Incluye la categoría asociada. |
| `getById(req, res, next)` | Devuelve un producto por ID con su categoría. Retorna `404` si no existe. |
| `create(req, res, next)` | Crea un nuevo producto. Requiere `nombre` y `precio`. El `stock` se inicializa en `0` si no se provee. |
| `update(req, res, next)` | Actualiza los campos de un producto existente con los datos del body. Retorna `404` si no existe. |
| `remove(req, res, next)` | Elimina un producto por ID. Retorna `404` si no existe. |

> **Bug conocido:** El filtro de precio en `getAll` construye `where.precio` como un array en lugar de un objeto, por lo que `Op.gte` y `Op.lte` no se aplican correctamente. El campo se llama `descripcion` en el modelo pero se lee como `description` desde el body en `create`.

---

### `uploadController.js`

Actualmente vacío. Destinado al manejo de subida de imágenes para productos y avatares de usuario mediante Multer.

---

### `userController.js`

Gestión de usuarios mediante una combinación de SQL directo y ORM.

| Función | Descripción |
|---|---|
| `getUsers(req, res, next)` | Obtiene la lista de usuarios con sus campos `id`, `nombre`, `email` y `telefono` usando una query SQL directa. La contraseña queda excluida de forma explícita. |
| `updateUser(req, res, next)` | Actualiza los datos de un usuario por ID usando el ORM de Sequelize. Retorna `404` si no existe. |
| `deleteUser(req, res, next)` | Elimina un usuario por ID. Retorna `404` si no existe. |

> **Nota:** `getUsers` y `updateUser`/`deleteUser` usan enfoques distintos de acceso a datos (SQL raw vs. ORM) dentro del mismo controlador. Se recomienda unificar usando Sequelize para mayor consistencia.

---

## Endpoints de la API

Prefijo base: `/api`

### Autenticación — `/api/auth`

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| POST | `/auth/register` | Registrar nuevo usuario | Público |
| POST | `/auth/login` | Iniciar sesión y obtener JWT | Público |

### Usuarios — `/api/users`

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| GET | `/users/` | Obtener lista de usuarios | Autenticado |

### Categorías — `/api/categories`

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| GET | `/categories/` | Listar todas las categorías | Público |
| GET | `/categories/:id` | Obtener categoría por ID | Público |

### Productos — `/api/products`

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| GET | `/products/` | Listar catálogo de productos | Público |
| GET | `/products/:id` | Obtener producto por ID | Público |
| POST | `/products/` | Crear nuevo producto | Admin |
| PUT | `/products/:id` | Actualizar producto | Admin |
| DELETE | `/products/:id` | Eliminar producto | Admin |

### Órdenes — `/api/orders`

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| GET | `/orders/` | Listar órdenes | Autenticado |
| GET | `/orders/:id` | Obtener orden por ID | Autenticado |
| POST | `/orders/` | Crear nueva orden | Autenticado |
| PUT | `/orders/:id/estado` | Actualizar estado de la orden | Admin |

---

## Autenticación y Autorización

La API usa JWT para proteger los endpoints. El token debe enviarse en el header de cada petición protegida:

```
Authorization: Bearer <token>
```

El payload del token contiene `id`, `email`, `rol`, `iat` y `exp`.

| Rol | Permisos |
|---|---|
| `cliente` | Ver catálogo, crear y consultar sus propias órdenes |
| `admin` | Todo lo anterior + gestión de productos, categorías y estados de órdenes |

---

## Middleware

### `loggerMiddleware.js`

Registra cada request HTTP en `logs/logs.txt`. La carpeta se crea automáticamente si no existe. La escritura es asíncrona para no bloquear el servidor.

```
[DD/MM/YYYY HH:MM:SS] METHOD /ruta - IP: xxx.xxx.xxx.xxx
```

### `authMiddleware.js`

Extrae y valida el JWT del header `Authorization`. Si es válido, adjunta el payload decodificado a `req.user` y continúa. Retorna `401` si el token está ausente, es inválido o ha expirado.

La función `requireRole(...roles)` verifica que el rol del usuario esté dentro de los roles permitidos para la ruta.

### `errorMiddleware.js`

Captura todos los errores propagados con `next(err)`. Formato de respuesta unificado:

```json
{
  "status": "error",
  "message": "...",
  "data": null
}
```

| Tipo de error | Código HTTP |
|---|---|
| ValidationError (Sequelize) | 400 |
| UniqueConstraintError (Sequelize) | 409 |
| Error genérico | 500 |

---

## Rutas Públicas del Servidor

| Ruta | Descripción |
|---|---|
| `GET /` | Sirve `index.html` del frontend (carpeta `public/`) |
| `GET /status` | Retorna estado del servidor, timestamp, entorno y versión |
| `GET /uploads/:archivo` | Sirve imágenes subidas por los usuarios |

---

## Configuración e Instalación

### Requisitos

- Node.js v18+
- PostgreSQL v14+
- npm o yarn

### Variables de entorno (`.env`)

```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=retail_aseo
DB_USER=postgres
DB_PASSWORD=tu_password
JWT_SECRETE=tu_clave_secreta_jwt
```

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/retail-aseo.git
cd retail-aseo

# 2. Instalar dependencias
npm install

# 3. Crear el archivo .env con las variables indicadas

# 4. Iniciar el servidor
node app.js
```

Al iniciar, Sequelize se conecta a PostgreSQL, autentica las credenciales y sincroniza los modelos con `alter: true` (sin borrar datos existentes).

---

## Errores Conocidos

| Archivo | Problema | Descripción |
|---|---|---|
| `authController.js` | JWT no generado | `login` no firma ni retorna el token JWT |
| `authController.js` | Contraseña sin hashear | La password se guarda en texto plano; falta integrar bcrypt |


##Funcionamiento

De momento las funciones de la app todavian no se conectan con el FrontEnd, esto se realizara durante el modulo 8, ya que esta mas en linea con su contenido. De momento la fomra de llevar a cabo las operaciones es mediante el uso de Fetch o herramientas como Postman, ejemplos de estos fetch se dejaron comentados en el codigo de app.js.

Tambien como parte de esa misma filosofia, se dejaron los errores señalados arriba, ya que el uso completo de JWT tambien es parte del siguietne modulo y se corregiran en la Parte 3 del proyecto.