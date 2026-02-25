import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const res = await login(email, password);
      signIn(res.token, res.user);
      navigate('/');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>登录</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            type="email"
            placeholder="邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p style={styles.error}>{error}</p>}
          <button style={styles.btn} type="submit">登录</button>
        </form>
        <p style={styles.footer}>
          没有账号？<Link to="/register">注册</Link>
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' },
  card: { background: '#fff', padding: 32, borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.1)', width: 360 },
  title: { marginBottom: 24, textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  input: { padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 },
  btn: { padding: '10px', background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 },
  error: { color: '#dc2626', fontSize: 13, margin: 0 },
  footer: { textAlign: 'center', marginTop: 16, fontSize: 14 },
};
