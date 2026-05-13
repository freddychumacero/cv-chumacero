import React, { useEffect, useState } from 'react';

const styles = {
  body: {
    fontFamily: "'Segoe UI', Arial, sans-serif",
    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4f46e5 100%)',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '40px 20px',
    margin: 0,
    boxSizing: 'border-box',
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '40px',
    maxWidth: '640px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    marginBottom: '32px',
    paddingBottom: '24px',
    borderBottom: '2px solid #e5e7eb',
  },
  foto: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid #4f46e5',
  },
  nombre: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1e1b4b',
    margin: '0 0 4px 0',
  },
  ciudad: {
    fontSize: '16px',
    color: '#6b7280',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  seccionTitulo: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#4f46e5',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  formacionItem: {
    background: '#f8f7ff',
    borderLeft: '4px solid #4f46e5',
    borderRadius: '8px',
    padding: '14px 18px',
    marginBottom: '12px',
  },
  titulo: {
    fontWeight: '600',
    color: '#1e1b4b',
    margin: '0 0 4px 0',
    fontSize: '15px',
  },
  institucion: {
    color: '#6b7280',
    margin: 0,
    fontSize: '14px',
  },
  anio: {
    display: 'inline-block',
    background: '#4f46e5',
    color: 'white',
    fontSize: '12px',
    fontWeight: '600',
    padding: '2px 8px',
    borderRadius: '20px',
    marginTop: '6px',
  },
  loading: {
    textAlign: 'center',
    color: 'white',
    fontSize: '20px',
    marginTop: '80px',
  },
  error: {
    textAlign: 'center',
    color: '#fca5a5',
    fontSize: '18px',
    marginTop: '80px',
  },
};

function App() {
  const [data, setData]   = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/cv')
      .then(res => {
        if (!res.ok) throw new Error('Error en la respuesta del servidor');
        return res.json();
      })
      .then(json => setData(json))
      .catch(() => setError('No se pudo conectar al backend. Verifique que los contenedores estén corriendo.'));
  }, []);

  if (error) return <div style={styles.body}><p style={styles.error}>⚠️ {error}</p></div>;
  if (!data)  return <div style={styles.body}><p style={styles.loading}>⏳ Cargando CV...</p></div>;

  const { persona, formacion } = data;

  return (
    <div style={styles.body}>
      <div style={styles.card}>

        {/* Datos personales */}
        <div style={styles.header}>
          <img
            src={persona.foto}
            alt={`Foto de ${persona.nombre}`}
            style={styles.foto}
          />
          <div>
            <h1 style={styles.nombre}>{persona.nombre} {persona.apellido}</h1>
            <p style={styles.ciudad}>📍 {persona.ciudad}</p>
          </div>
        </div>

        {/* Formación académica */}
        <div>
          <h2 style={styles.seccionTitulo}>🎓 Formación Académica</h2>
          {formacion.map(f => (
            <div key={f.id} style={styles.formacionItem}>
              <p style={styles.titulo}>{f.titulo}</p>
              <p style={styles.institucion}>{f.institucion}</p>
              <span style={styles.anio}>{f.anio}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;
