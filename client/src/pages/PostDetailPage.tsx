import { useEffect, useState, FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getPost, getComments, createComment, deleteComment,
  likePost, unlikePost, getLikes,
  type Post, type Comment, type Like,
} from '../api/posts';
import { useAuth } from '../contexts/AuthContext';

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [likes, setLikes] = useState<Like[]>([]);
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const postId = Number(id);
    Promise.all([getPost(postId), getComments(postId), getLikes()])
      .then(([p, c, l]) => {
        setPost(p.post);
        setComments(c.comments);
        setLikes(l.likes.filter((lk) => lk.postId === postId));
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleComment(e: FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    const res = await createComment(Number(id), body);
    setComments((prev) => [...prev, res.comment]);
    setBody('');
  }

  async function handleDeleteComment(commentId: number) {
    await deleteComment(commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  }

  async function toggleLike() {
    const postId = Number(id);
    const liked = likes.some((l) => l.userId === user!.id);
    if (liked) {
      await unlikePost(postId);
      setLikes((prev) => prev.filter((l) => l.userId !== user!.id));
    } else {
      const res = await likePost(postId);
      setLikes((prev) => [...prev, res.like]);
    }
  }

  if (loading) return <p style={styles.center}>加载中...</p>;
  if (!post) return <p style={styles.center}>帖子不存在</p>;

  const liked = likes.some((l) => l.userId === user!.id);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Link to="/" style={styles.back}>← 返回</Link>

        {/* 帖子 */}
        <div style={styles.card}>
          <div style={styles.postHeader}>
            <Link to={`/users/${post.author.id}`} style={styles.authorLink}>
              {post.author.name ?? post.author.email}
            </Link>
            <span style={styles.time}>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
          <h2 style={styles.title}>{post.title}</h2>
          {post.content && <p style={styles.content}>{post.content}</p>}
          <button
            style={{ ...styles.likeBtn, color: liked ? '#1d4ed8' : '#666' }}
            onClick={toggleLike}
          >
            {liked ? '❤️' : '🤍'} {likes.length} 点赞
          </button>
        </div>

        {/* 评论 */}
        <div style={styles.card}>
          <h3 style={{ marginBottom: 16 }}>评论 ({comments.length})</h3>
          <form onSubmit={handleComment} style={styles.commentForm}>
            <input
              style={styles.input}
              placeholder="写评论..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            />
            <button style={styles.btn} type="submit">发送</button>
          </form>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {comments.map((c) => (
              <div key={c.id} style={styles.comment}>
                <div style={styles.commentHeader}>
                  <Link to={`/users/${c.author.id}`} style={styles.authorLink}>
                    {c.author.name ?? c.author.email}
                  </Link>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={styles.time}>{new Date(c.createdAt).toLocaleDateString()}</span>
                    {c.authorId === user!.id && (
                      <button style={styles.deleteBtn} onClick={() => handleDeleteComment(c.id)}>删除</button>
                    )}
                  </div>
                </div>
                <p style={styles.commentBody}>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { background: '#f3f4f6', minHeight: '100vh', padding: '24px 0' },
  container: { maxWidth: 640, margin: '0 auto', padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 16 },
  back: { color: '#1d4ed8', textDecoration: 'none', fontSize: 14 },
  card: { background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  postHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: 8 },
  authorLink: { color: '#1d4ed8', textDecoration: 'none', fontWeight: 600, fontSize: 14 },
  time: { color: '#9ca3af', fontSize: 13 },
  title: { fontSize: 22, fontWeight: 700, marginBottom: 12 },
  content: { color: '#4b5563', fontSize: 15, marginBottom: 16 },
  likeBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 15 },
  commentForm: { display: 'flex', gap: 8 },
  input: { flex: 1, padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 },
  btn: { padding: '10px 16px', background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 },
  comment: { padding: '12px 0', borderBottom: '1px solid #f3f4f6' },
  commentHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: 4 },
  commentBody: { color: '#374151', fontSize: 14, margin: 0 },
  deleteBtn: { background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 12 },
  center: { textAlign: 'center', color: '#9ca3af', padding: 32 },
};
