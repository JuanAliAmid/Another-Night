# Another Night

## Descripción

Sitio sobre eventos e inscripciones a fiestas electrónicas desarrollado como proyecto de Backend II.

## Instalación

1. Cloná el repositorio

```bash
git clone https://github.com/JuanAliAmid/Another-Night.git
cd Another-Night
```

2. Instalá las dependencias

```bash
npm install
```

3. Creá un archivo `.env` en la raíz con estas variables:

```
PORT=8080
MONGODB_URI="mongodb://localhost:27017/another-night"
```

4. Levantá el servidor:

```bash
npm start
```

## Tecnologías
- Dotenv
- Express
- Mongoose

## Variables de entorno

- PORT = #Puerto del servidor
- MONGODB_URI = #URL de mongodb
- NODE_ENV = #Entorno: development | production | test
- JWT_SECRET = #Clave secreta para firmar JWT

## Cómo ejecutar

- npm start #"node src/server.js"
- npm run dev #"node --watch src/server.js"

## Rutas disponibles

- /api/health
- /api/users
- /api/sessions
- /api/events
- /api/tickets

## Estructura de carpetas
```
Another Night/
├── src/
│   ├── app.js                
│   ├── server.js             
│   ├── config/
│   │   ├── database.js
│   │   └── env.js
│   ├── routes/
│   │   ├── events.routes.js
│   │   ├── tickets.routes.js
│   │   ├── users.routes.js
│   │   ├── index.js
│   │   └── sessions.routes.js
│   ├── controllers/
│   │   ├── events.controller.js
│   │   ├── sessions.controller.js
│   │   ├── tickets.controller.js
│   │   └── users.controller.js
│   ├── services/
│   ├── repositories/
│   ├── dao/
│   ├── models/
│   │   ├── user.model.js           
│   │   ├── event.model.js           
│   │   └── ticket.model.js          
│   ├── middlewares/
│   └── utils/
├── .env.example              
├── .gitignore                
├── package-lock.json               
├── package.json
└── README.md
```