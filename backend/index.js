const express = require('express');
const mysql   = require('mysql2');
const cors    = require('cors');

const app = express();
app.use(cors());

// Conexión a MySQL usando variables de entorno (inyectadas por Docker Compose)
const db = mysql.createConnection({
  host    : process.env.DB_HOST     || 'database',
  user    : process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || 'root123',
  database: process.env.DB_NAME     || 'cv_db'
});

db.connect((err) => {
  if (err) {
    console.error('Error conectando a MySQL:', err);
    process.exit(1);
  }
  console.log('✅ Conectado a MySQL exitosamente');
});

// GET /cv — Retorna datos personales y formación académica en JSON
app.get('/cv', (req, res) => {
  const sqlPersona   = 'SELECT * FROM persona LIMIT 1';
  const sqlFormacion = 'SELECT * FROM formacion WHERE persona_id = ?';

  db.query(sqlPersona, (err, personas) => {
    if (err) return res.status(500).json({ error: err.message });

    const persona = personas[0];
    if (!persona) return res.status(404).json({ error: 'No hay datos de persona' });

    db.query(sqlFormacion, [persona.id], (err2, formacion) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ persona, formacion });
    });
  });
});

app.listen(4000, () => {
  console.log('🚀 Backend CV corriendo en puerto 4000');
});
