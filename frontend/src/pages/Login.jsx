import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { login } from '../services/authService';


function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login: setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(formData);
      setUser(user);
      setError('');
      navigate('/');  // instead of '/dashboard'
 // ✅ redirects!
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2 className="form-title">Login</h2>
      <form onSubmit={handleSubmit}>
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
          Login
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '10px' }}>
        Don’t have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;
