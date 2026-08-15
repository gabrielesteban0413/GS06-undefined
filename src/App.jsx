import { useState, useEffect, useRef } from 'react';
import './App.css';

const FormField = ({ label, type, id, value, onChange, required, placeholder, as, inputRef }) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
  const Element = as === 'textarea' ? 'textarea' : 'input';

  return (
    <div className="form-group">
      <label htmlFor={inputId} className="form-label">
        {label} {required && <span className="form-required">*</span>}
      </label>
      <Element
        id={inputId}
        name={inputId}
        type={type || 'text'}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder || `Ingresa ${label.toLowerCase()}`}
        className="form-input"
        ref={inputRef}
        {...(as === 'textarea' ? { rows: 3 } : {})}
      />
    </div>
  );
};

function App() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    interests: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('Undefined_users');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const nameInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('Undefined_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const { fullName, email, phone, city, interests } = formData;

    if (!fullName.trim()) newErrors.fullName = 'El nombre es obligatorio.';
    else if (fullName.trim().length < 2) newErrors.fullName = 'Mínimo 2 caracteres.';
    if (!email.trim()) newErrors.email = 'El correo es obligatorio.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      newErrors.email = 'Correo electrónico inválido.';
    if (!phone.trim()) newErrors.phone = 'El teléfono es obligatorio.';
    else if (!/^[0-9+\-\s()]{7,15}$/.test(phone.trim()))
      newErrors.phone = 'Formato de teléfono inválido.';
    if (!city.trim()) newErrors.city = 'La ciudad es obligatoria.';
    if (!interests.trim()) newErrors.interests = 'Los intereses son obligatorios.';
    else if (interests.trim().length < 5)
      newErrors.interests = 'Mínimo 5 caracteres.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validate()) {
      setIsSubmitting(false);
      return;
    }

    const newUser = {
      id: Date.now() + Math.random().toString(36).slice(2, 6),
      ...formData,
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      city: formData.city.trim(),
      interests: formData.interests.trim(),
      registeredAt: new Date().toLocaleString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setUsers((prev) => [newUser, ...prev]);

    alert(
      `✅ Usuario registrado exitosamente\n\n` +
      `Nombre: ${newUser.fullName}\n` +
      `Correo: ${newUser.email}\n` +
      `Teléfono: ${newUser.phone}\n` +
      `Ciudad: ${newUser.city}\n` +
      `Intereses: ${newUser.interests}\n\n` +
      `¡Bienvenido a la comunidad!`
    );

    setFormData({
      fullName: '',
      email: '',
      phone: '',
      city: '',
      interests: '',
    });
    setErrors({});
    setIsSubmitting(false);
    nameInputRef.current?.focus();
  };

  return (
    <div className="app">
      <div className="deco deco-1"></div>
      <div className="deco deco-2"></div>
      <div className="deco deco-3"></div>

      <header className="app-header">
        <div className="logo">
          <span className="logo-icon">◆</span>
          <span className="logo-text">Undefined</span>
        </div>
        <nav className="nav">
          <span>Inicio</span>
          <span>Proyectos</span>
          <span>Contacto</span>
        </nav>
      </header>

      <main className="app-main">
        <section className="form-section">
          <form className="form" onSubmit={handleSubmit} noValidate>
            <div className="form-head">
              <h1>Crear cuenta</h1>
              <p>Únete a la red de creativos.</p>
            </div>

            <div className="form-body">
              <FormField
                label="Nombre completo"
                id="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Ej. Ana Martínez"
                inputRef={nameInputRef}
              />
              {errors.fullName && <span className="form-error">{errors.fullName}</span>}

              <FormField
                label="Correo electrónico"
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="tu@email.com"
              />
              {errors.email && <span className="form-error">{errors.email}</span>}

              <FormField
                label="Teléfono"
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+57 612 345 678"
              />
              {errors.phone && <span className="form-error">{errors.phone}</span>}

              <FormField
                label="Ciudad"
                id="city"
                value={formData.city}
                onChange={handleChange}
                required
                placeholder="Ej. Barcelona"
              />
              {errors.city && <span className="form-error">{errors.city}</span>}

              <FormField
                label="Intereses"
                as="textarea"
                id="interests"
                value={formData.interests}
                onChange={handleChange}
                required
                placeholder="Diseño, fotografía, arte…"
              />
              {errors.interests && <span className="form-error">{errors.interests}</span>}

              <button type="submit" className="btn-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Registrando…' : 'Registrarse'}
              </button>
            </div>
          </form>
        </section>

        <section className="list-section">
          <div className="list-container">
            {users.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">✦</span>
                <p>No hay usuarios aún</p>
                <span className="empty-sub">Completa el formulario para empezar</span>
              </div>
            ) : (
              <ul className="user-list">
                {users.map((user) => (
                  <li key={user.id} className="user-card">
                    <div className="user-avatar">
                      <span>{user.fullName.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="user-info">
                      <strong className="user-name">{user.fullName}</strong>
                      <div className="user-details">
                        <span>{user.email}</span>
                        <span>{user.phone}</span>
                        <span>{user.city}</span>
                        <span>{user.interests}</span>
                      </div>
                    </div>
                    <div className="user-meta">
                      <span className="user-date">{user.registeredAt}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* IMAGEN FUERA DEL CUADRO - SOLO DECORATIVA */}
        <div className="image-outside-wrapper">
          <img
            src="/images/login_banner.png"
            alt="Login banner"
            className="footer-image-outside"
          />
        </div>
      </main>

      <footer className="app-footer">
        <p>© 2026 gabriel_esteban · Undefined</p>
      </footer>
    </div>
  );
}

export default App;