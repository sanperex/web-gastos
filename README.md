# 💰 Gestor de Gastos (Full Stack)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=mui&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

Una aplicación web moderna y elegante para el control de finanzas personales, construida con el stack MERN (MongoDB, Express, React, Node.js).

## 🚀 Características

- **Gestión de Gastos (CRUD):** Registro, visualización, edición y eliminación de gastos.
- **Autenticación Completa:** Registro e inicio de sesión con JWT y persistencia de sesión.
- **Dashboard Visual:** Gráficos dinámicos con Recharts para analizar tus finanzas.
- **Diseño Premium:** Interfaz responsiva y pulida utilizando Material UI.
- **PWA Ready:** Instalable en dispositivos móviles para acceso sin conexión.
- **API Serverless:** Configurado para despliegue rápido en Vercel.

## 🛠️ Tecnologías

### Frontend
- **Framework:** React 19 (Vite)
- **UI & Iconos:** Material UI (MUI) v7
- **Navegación:** React Router v7
- **Gráficos:** Recharts
- **PWA:** Vite PWA Plugin
- **Peticiones:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express
- **Base de Datos:** MongoDB (Mongoose)
- **Seguridad:** Bcryptjs (Hash de contraseñas) y CORS config.

## 📦 Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/sanperex/web-gastos.git
   cd api_react
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar el Backend:**
   Entra en la carpeta `backend` e instala sus dependencias:
   ```bash
   cd backend
   npm install
   ```

## ⚙️ Configuración

Crea un archivo `.env` en la carpeta `backend` con las siguientes variables:

```env
PORT=4000
MONGODB_URI=tu_uri_de_mongodb
```

## 🏃 Cómo ejecutar

### Modo Desarrollo
Para ejecutar tanto el frontend como el backend simultáneamente:

1. Inicia el backend (en una terminal):
   ```bash
   npm run dev:backend
   ```
2. Inicia el frontend (en otra terminal):
   ```bash
   npm run dev
   ```

### Producción & Despliegue
Este proyecto está configurado para desplegarse fácilmente en **Vercel**.
- El frontend se compila con Vite.
- El backend funciona como funciones serverless desde la carpeta `api/`.

## 📂 Estructura del Proyecto

```text
api_react/
├── api/                # Punto de entrada para Vercel
├── backend/            # Servidor Express & Modelos
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── routes/
├── src/                # Aplicación React
│   ├── features/       # Módulos por funcionalidad (Auth, CRUD, Home)
│   ├── assets/
│   └── App.jsx
├── public/             # Archivos estáticos
└── index.html
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---
Desarrollado con ❤️ por [sanperex](https://github.com/sanperex).
