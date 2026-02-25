import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUser, getFollowers, getFollowing, follow, unfollow, type User } from '../api/users';
import { getPosts, type Post } from '../api/posts';
import { useAuth } from '../contexts/AuthContext';

export function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user: me } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = Number(id);
  const isMe = me?.id === userId;
  const isFollowing = followers.some((f) => f.id === me?.id);

  useEffect(() => {
    Promise.all([
      getUser(userId),
      getPosts(),
      getFollowers(userId),
      getFollowing(userId),
    ])
      .then(([u, p, frs, fing]) => {
        setProfile(u.user);
        setPosts(p.posts.filter((post) => post.authorId === userId));
        setFollowers(frs.followers);
        setFollowing(fing.following);
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function toggleFollow() {
    if (!me) return;
    try {
      if (isFollowing) {
        await unfollow(me.id, userId);
        setFollowers((prev) => prev.filter((f) => f.id !== me.id));
      } else {
        await follow(me.id, userId);
        setFollowers((prev) => [...prev, { id: me.id, email: me.email, name: me.name, createdAt: '' }]);
      }
    } catch {
      // ignore
    }
  }

  if (loading) return <p style={styles.center}>加载中...</p>;
  if (!profile) return <p style={styles.center}>用户不存在</p>;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* 用户信息 */}
        <div style={styles.card}>
          <div style={styles.avatar}>{(profile.name ?? profile.email)[0].toUpperCase()}</div>
          <h2 style={styles.name}>{profile.name ?? '未设置昵称'}</h2>
          <p style={styles.email}>{profile.email}</p>
          <div style={styles.stats}>
            <div style={styles.stat}>
              <span style={styles.statNum}>{posts.length}</span>
              <span style={styles.statLabel}>帖子</span>
            </div>
            <div style={styles.stat}>
              <span style={styles.statNum}>{followers.length}</span>
              <span style={styles.statLabel}>粉丝</span>
            </div>
            <div style={styles.stat}>
              <span style={styles.statNum}>{following.length}</span>
              <span style={styles.statLabel}>关注</span>
            </div>
          </div>
          {!isMe && (
            <button
              style={{ ...styles.followBtn, background: isFollowing ? '#e5e7eb' : '#1d4ed8', color: isFollowing ? '#111' : '#fff' }}
              onClick={toggleFollow}
            >
              {isFollowing ? '取消关注' : '关注'}
            </button>
          )}
        </div>

        {/* 帖子列表 */}
        <h3 style={{ margin: '8px 0 4px' }}>TA 的帖子</h3>
        {posts.length === 0 ? (
          <p style={styles.center}>还没有帖子</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} style={styles.postCard}>
              <Link to={`/posts/${post.id}`} style={styles.postTitle}>{post.title}</Link>
              {post.content && <p style={styles.postContent}>{post.content}</p>}
              <span style={styles.time}>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          ))
        )}

        {/* 关注列表 */}
        {following.length > 0 && (
          <>
            <h3 style={{ margin: '8px 0 4px' }}>关注了</h3>
            <div style={styles.userList}>
              {following.map((u) => (
                <Link key={u.id} to={`/users/${u.id}`} style={styles.userChip}>
                  {u.name ?? u.email}
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { background: '#f3f4f6', minHeight: '100vh', padding: '24px 0' },
  container: { maxWidth: 640, margin: '0 auto', padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 16 },
  card: { background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', textAlign: 'center' },
  avatar: { width: 72, height: 72, borderRadius: '50%', background: '#1d4ed8', color: '#fff', fontSize: 32, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' },
  name: { fontSize: 20, fontWeight: 700, marginBottom: 4 },
  email: { color: '#6b7280', fontSize: 14, marginBottom: 16 },
  stats: { display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 16 },
  stat: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  statNum: { fontSize: 20, fontWeight: 700 },
  statLabel: { fontSize: 12, color: '#6b7280' },
  followBtn: { padding: '8px 24px', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 },
  postCard: { background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  postTitle: { fontSize: 16, fontWeight: 700, color: '#111', textDecoration: 'none', display: 'block', marginBottom: 6 },
  postContent: { color: '#4b5563', fontSize: 14, marginBottom: 8 },
  time: { color: '#9ca3af', fontSize: 12 },
  userList: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  userChip: { background: '#eff6ff', color: '#1d4ed8', padding: '4px 12px', borderRadius: 20, fontSize: 13, textDecoration: 'none' },
  center: { textAlign: 'center', color: '#9ca3af', padding: 32 },
};
