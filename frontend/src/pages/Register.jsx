import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { register } from '../services/authService';

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { login: setUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await register(formData);
      setUser(user);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2 className="form-title">Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="form-input"
            required
            placeholder="Enter name"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="form-input"
            required
            placeholder="Enter email"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="form-input"
            required
            placeholder="Enter password"
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="submit-button">
          Register
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '10px' }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Register;