// api.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Inicializar DB SQLite
const db = new sqlite3.Database('empresas.db');
db.run(`CREATE TABLE IF NOT EXISTS empresas (
  CodEmpresa TEXT PRIMARY KEY,
  NombreEmpresa TEXT,
  Clave TEXT,
  Fecha TEXT
)`);

// Obtener todas las empresas
app.get('/empresas', (req, res) => {
  db.all("SELECT * FROM empresas", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Crear nueva empresa
app.post('/crear', (req, res) => {
  const { CodEmpresa, NombreEmpresa, Clave } = req.body;
  if (Clave !== 'Siaco09') return res.status(401).json({ error: "Clave incorrecta" });
  const Fecha = new Date().toISOString();
  db.run("INSERT OR REPLACE INTO empresas VALUES (?, ?, ?, ?)", [CodEmpresa, NombreEmpresa, Clave, Fecha],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ ok: true });
    });
});

// Modificar empresa
app.post('/modificar', (req, res) => {
  const { CodEmpresa, NombreEmpresa, Clave } = req.body;
  if (Clave !== 'Siaco09') return res.status(401).json({ error: "Clave incorrecta" });
  const Fecha = new Date().toISOString();
  db.run("UPDATE empresas SET NombreEmpresa=?, Clave=?, Fecha=? WHERE CodEmpresa=?",
    [NombreEmpresa, Clave, Fecha, CodEmpresa],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ ok: true });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor escuchando en puerto " + PORT);
});
