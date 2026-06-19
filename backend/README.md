# Backend de CervixAI (prototipo sin base de datos)

Este servidor es un backend mínimo que funciona sin base de datos, usando almacenamiento en memoria.

## Instalación

Desde la carpeta `backend`:

```bash
npm install
```

## Ejecución

```bash
npm start
```

Por defecto el servidor se levanta en `http://localhost:4000`.

## Endpoints disponibles

- `POST /api/login`
- `GET /api/user`
- `GET /api/dashboard`
- `POST /api/analyze`
- `GET /api/historial`
- `GET /api/historial/:id`
- `DELETE /api/historial/:id`
- `GET /api/health`

## Notas

- Los datos de historial se almacenan solo en memoria.
- Al reiniciar el servidor, el historial se pierde.
- El usuario predeterminado es `admin` / `admin123`.
