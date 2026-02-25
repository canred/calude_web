import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function NavBar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  function handleSignOut() {
    signOut();
    navigate('/login');
  }

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>SocialApp</Link>
      <div style={styles.links}>
        {user ? (
          <>
            <Link to={`/users/${user.id}`} style={styles.link}>
              {user.name ?? user.email}
            </Link>
            <button onClick={handleSignOut} style={styles.btn}>登出</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>登录</Link>
            <Link to="/register" style={styles.link}>注册</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 24px',
    background: '#1d4ed8',
    color: '#fff',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  brand: {
    color: '#fff',
    fontWeight: 700,
    fontSize: 20,
    textDecoration: 'none',
  },
  links: { display: 'flex', alignItems: 'center', gap: 16 },
  link: { color: '#fff', textDecoration: 'none' },
  btn: {
    background: 'transparent',
    border: '1px solid #fff',
    color: '#fff',
    padding: '4px 12px',
    borderRadius: 6,
    cursor: 'pointer',
  },
};
