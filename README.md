# test-project
Este es un sistema de reserva de tickets para eventos desarrollado con:
- **Frontend:** React.js
- **Backend:** Node.js con Express.js
- **Base de Datos:** MySQL
- **Docker:** Para la contenedorización de los servicios
- **Docker Compose:** Para la orquestación de los contenedores


## **Requisitos Previos**
Antes de ejecutar este proyecto, asegúrate de tener instalados los siguientes programas en tu sistema:

1. **Docker:** [Descargar Docker](https://www.docker.com/products/docker-desktop)
2. **Git:** [Descargar Git](https://git-scm.com/downloads)
3. **Navegador Web:** Para acceder a la interfaz del frontend (Chrome, Firefox, Edge, etc.)

---

## **Configuración de Variables de Entorno**

Antes de ejecutar el proyecto, necesitas configurar las variables de entorno necesarias para el backend.

### **Backend: Crear el Archivo `.env`**

Dentro de la carpeta `backend`, crea un archivo llamado `.env` con el siguiente contenido:

```env
DB_HOST=mysql
DB_USER=root
DB_PASSWORD=root
DB_NAME=ticket_reservation
JWT_SECRET=secret123
