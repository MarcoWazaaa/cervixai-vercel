const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 4000;
const jwtSecret = process.env.JWT_SECRET || 'cervix-ai-secret';

app.use(cors());
app.use(express.json());

const user = {
  id: 1,
  username: 'admin',
  password: 'admin123',
  name: 'Administrador',
};

let analysisHistory = [];
let nextId = 1;

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

  jwt.verify(token, jwtSecret, (err, payload) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });
    req.user = payload;
    next();
  });
}

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username !== user.username || password !== user.password) {
    return res.status(401).json({ message: 'Credenciales incorrectas' });
  }

  const token = jwt.sign({ id: user.id, username: user.username, name: user.name }, jwtSecret, {
    expiresIn: '4h',
  });

  res.json({ token, user: { id: user.id, username: user.username, name: user.name } });
});

app.get('/api/user', authenticateToken, (req, res) => {
  res.json({ id: req.user.id, username: req.user.username, name: req.user.name });
});

app.get('/api/dashboard', authenticateToken, (req, res) => {
  const totalAnalyses = analysisHistory.length;
  const lastAnalysis = analysisHistory[analysisHistory.length - 1] || null;
  const summary = {
    totalAnalyses,
    lastAnalysis,
    positiveCount: analysisHistory.filter((item) => item.result === 'positivo').length,
    negativeCount: analysisHistory.filter((item) => item.result === 'negativo').length,
  };
  res.json({ summary, recommendations: 'Este backend utiliza almacenamiento en memoria y no persiste los datos entre reinicios.' });
});

app.post('/api/analyze', authenticateToken, (req, res) => {
  const { imageName, imageNotes } = req.body;
  const result = Math.random() > 0.5 ? 'positivo' : 'negativo';
  const newReport = {
    id: nextId++,
    imageName: imageName || `imagen-${Date.now()}`,
    notes: imageNotes || '',
    result,
    analyzedAt: new Date().toISOString(),
    analyst: req.user.name,
  };

  analysisHistory.push(newReport);

  res.json({ message: 'Análisis simulado completado', report: newReport });
});

app.get('/api/historial', authenticateToken, (req, res) => {
  res.json({ items: analysisHistory });
});

app.get('/api/historial/:id', authenticateToken, (req, res) => {
  const id = Number(req.params.id);
  const item = analysisHistory.find((entry) => entry.id === id);
  if (!item) {
    return res.status(404).json({ message: 'Registro no encontrado' });
  }
  res.json(item);
});

app.delete('/api/historial/:id', authenticateToken, (req, res) => {
  const id = Number(req.params.id);
  const index = analysisHistory.findIndex((entry) => entry.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Registro no encontrado' });
  }
  analysisHistory.splice(index, 1);
  res.json({ message: 'Registro eliminado' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', mode: 'memory-only' });
});

app.listen(port, () => {
  console.log(`Backend listo en http://localhost:${port}`);
});
