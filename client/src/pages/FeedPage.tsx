import { useEffect, useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { getPosts, createPost, likePost, unlikePost, getLikes, type Post, type Like } from '../api/posts';
import { useAuth } from '../contexts/AuthContext';

export function FeedPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [likes, setLikes] = useState<Like[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getPosts(), getLikes()])
      .then(([p, l]) => {
        setPosts(p.posts);
        setLikes(l.likes);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handlePost(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const res = await createPost(title, content);
      setPosts((prev) => [res.post, ...prev]);
      setTitle('');
      setContent('');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function toggleLike(postId: number) {
    const already = likes.some((l) => l.postId === postId && l.userId === user!.id);
    try {
      if (already) {
        await unlikePost(postId);
        setLikes((prev) => prev.filter((l) => !(l.postId === postId && l.userId === user!.id)));
      } else {
        const res = await likePost(postId);
        setLikes((prev) => [...prev, res.like]);
      }
    } catch {
      // already liked/unliked by another action
    }
  }

  if (loading) return <p style={styles.center}>加载中...</p>;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* 发布新帖 */}
        <div style={styles.card}>
          <h3 style={{ marginBottom: 12 }}>发布新帖</h3>
          <form onSubmit={handlePost} style={styles.form}>
            <input
              style={styles.input}
              placeholder="标题"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              style={{ ...styles.input, height: 80, resize: 'vertical' }}
              placeholder="内容（可选）"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            {error && <p style={styles.error}>{error}</p>}
            <button style={styles.btn} type="submit">发布</button>
          </form>
        </div>

        {/* 帖子列表 */}
        {posts.length === 0 ? (
          <p style={styles.center}>还没有帖子，发第一条吧！</p>
        ) : (
          posts.map((post) => {
            const postLikes = likes.filter((l) => l.postId === post.id);
            const liked = postLikes.some((l) => l.userId === user!.id);
            return (
              <div key={post.id} style={styles.card}>
                <div style={styles.postHeader}>
                  <Link to={`/users/${post.author.id}`} style={styles.authorLink}>
                    {post.author.name ?? post.author.email}
                  </Link>
                  <span style={styles.time}>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <Link to={`/posts/${post.id}`} style={styles.postTitle}>{post.title}</Link>
                {post.content && <p style={styles.postContent}>{post.content}</p>}
                <div style={styles.actions}>
                  <button
                    style={{ ...styles.actionBtn, color: liked ? '#1d4ed8' : '#666' }}
                    onClick={() => toggleLike(post.id)}
                  >
                    {liked ? '❤️' : '🤍'} {postLikes.length}
                  </button>
                  <Link to={`/posts/${post.id}`} style={styles.commentLink}>
                    💬 评论
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { background: '#f3f4f6', minHeight: '100vh', padding: '24px 0' },
  container: { maxWidth: 640, margin: '0 auto', padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 16 },
  card: { background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  form: { display: 'flex', flexDirection: 'column', gap: 10 },
  input: { padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, fontFamily: 'inherit' },
  btn: { padding: '10px', background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 },
  error: { color: '#dc2626', fontSize: 13, margin: 0 },
  postHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: 8 },
  authorLink: { color: '#1d4ed8', textDecoration: 'none', fontWeight: 600, fontSize: 14 },
  time: { color: '#9ca3af', fontSize: 13 },
  postTitle: { fontSize: 18, fontWeight: 700, color: '#111', textDecoration: 'none', display: 'block', marginBottom: 8 },
  postContent: { color: '#4b5563', fontSize: 14, marginBottom: 12 },
  actions: { display: 'flex', gap: 16, paddingTop: 8, borderTop: '1px solid #f3f4f6' },
  actionBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 },
  commentLink: { color: '#666', textDecoration: 'none', fontSize: 14 },
  center: { textAlign: 'center', color: '#9ca3af', padding: 32 },
};
