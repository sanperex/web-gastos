# Mis Gastos App 💰

**Mis Gastos App** es una aplicación web full-stack diseñada para ayudarte a controlar tus finanzas personales de manera sencilla y rápida. Permite gestionar tus ingresos, gastos y deudas, ofreciendo además una integración divertida con una API externa para buscar personajes de Ricky and Morty.

![Screenshot del Crud](https://github.com/user-attachments/assets/4692d619-d424-4081-beb0-c911a49d561e)
![Screenshot de la api](https://github.com/user-attachments/assets/82c4a0f6-6e88-4332-baae-f2c489db3fcd)

## 🚀 Características Principales

- **Control de Finanzas**: Gestiona tus gastos y ahorros con una interfaz intuitiva.
- **Visualización de Datos**: Gráficos dinámicos para entender en qué se va tu dinero (vía Recharts).
- **Buscador de Personajes**: Integración con la API de Rick and Morty para momentos de ocio.
- **Autenticación Segura**: Sistema de Login y Registro para proteger tu información.
- **PWA (Progressive Web App)**: Instala la aplicación en tu dispositivo móvil o escritorio.
- **Diseño Moderno**: Interfaz premium construida con Material UI (MUI).

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19**: Biblioteca principal para la interfaz de usuario.
- **Vite**: Herramienta de construcción ultrarrápida.
- **Material UI (MUI)**: Sistema de diseño y componentes.
- **Recharts**: Visualización de datos y estadísticas.
- **Axios**: Cliente HTTP para consumo de APIs.
- **React Router Dom**: Gestión de navegación.

### Backend
- **Node.js & Express**: Entorno de ejecución y framework para la API.
- **MongoDB & Mongoose**: Base de datos NoSQL y modelado de datos.
- **JWT (JSON Web Token)**: Autenticación basada en tokens.
- **Bcryptjs**: Encriptado de contraseñas.

---

## 📂 Arquitectura y Estructura del Proyecto

El proyecto sigue una estructura modular y organizada para facilitar su mantenimiento:

```text
api_react/
├── backend/                # Lógica del servidor (Node/Express)
│   ├── src/
│   │   ├── config/         # Configuración de BD
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── models/         # Modelos de Mongoose (User, Gasto)
│   │   ├── routes/         # Definición de endpoints
│   │   └── server.js       # Punto de entrada del servidor
├── src/                    # Frontend (React)
│   ├── features/           # Funcionalidades modulares
│   │   ├── api/            # Buscador de personajes
│   │   ├── auth/           # Login y Registro
│   │   ├── crud/           # Gestor de gastos
│   │   ├── home/           # Landing page
│   │   └── layout/         # Componentes transversales (Navbar, Footer)
│   ├── App.jsx             # Enrutador principal
│   └── main.jsx            # Punto de entrada de React
├── public/                 # Assets estáticos
└── package.json            # Dependencias y scripts
```

---

## ⚙️ Instalación

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/sanperex/web-gastos.git
   cd api_react
   ```

2. **Instalar dependencias del Frontend**:
   ```bash
   npm install
   ```

3. **Instalar dependencias del Backend**:
   ```bash
   cd backend
   ```
   *Crea un archivo `.env` basado en `.env.example` y añade tu URI de MongoDB.*
   ```bash
   npm install
   cd ..
   ```

---

## 🏃 Ejecución

Para iniciar el proyecto en modo desarrollo, se deben ejecutar ambos servidores (Frontend y Backend):

### Iniciar Frontend (Vite)
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`.

### Iniciar Backend (Express)
```bash
npm run dev:backend
```
El servidor backend correrá en el puerto configurado (usualmente `http://localhost:5000` o similar).

---

## 🧔 Datos del Autor

- **Nombre**: Santiago Pérez Calle
- **GitHub**: [@sanperex](https://github.com/sanperex)
- **Rol**: Aprendiz de programacion
- **Descripción**: Apasionado por crear soluciones web limpias, modernas y funcionales.

---
*Hecho por un junior con amor por el código.*
