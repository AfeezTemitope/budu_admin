import { useState, useCallback } from 'react'
import { Plus, Edit, Trash2, Image, Eye, EyeOff, X, Save, Loader } from 'lucide-react'
import toast from 'react-hot-toast'
import { useApi, useMutation } from '../../hooks'
import { contentService, uploadService } from '../../api'
import { LoadingState, ErrorState, EmptyState } from '../../components/common/States'
import { formatDate } from '../../utils/helpers'

const EMPTY_POST = { title: '', description: '', is_published: true }

export default function NewsPage() {
  const fetchPosts = useCallback(() => contentService.list(), [])
  const { data: posts, loading, error, execute: refetch } = useApi(fetchPosts, [], { initialData: [] })
  const { execute: createPost, loading: creating } = useMutation(contentService.create)
  const { execute: updatePost, loading: updating } = useMutation((id, data) => contentService.update(id, data))
  const { execute: deletePost } = useMutation(contentService.delete)

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ ...EMPTY_POST })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)

  const update = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }))

  const openCreate = () => {
    setForm({ ...EMPTY_POST })
    setEditingId(null)
    setImageFile(null)
    setImagePreview('')
    setShowForm(true)
  }

  const openEdit = (post) => {
    setForm({ title: post.title || '', description: post.description || '', is_published: post.is_published ?? true })
    setEditingId(post.id)
    setImagePreview(post.image_url || '')
    setImageFile(null)
    setShowForm(true)
  }

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    if (!form.description) {
      toast.error('Content is required')
      return
    }
    try {
      let savedPost
      if (editingId) {
        savedPost = await updatePost(editingId, form)
        toast.success('Post updated')
      } else {
        savedPost = await createPost(form)
        toast.success('Post created')
      }

      // Upload image if selected
      if (imageFile && savedPost?.id) {
        setUploadingImage(true)
        try {
          await contentService.uploadImage(savedPost.id, imageFile)
        } catch {
          toast.error('Post saved but image upload failed')
        }
        setUploadingImage(false)
      }

      setShowForm(false)
      setEditingId(null)
      refetch()
    } catch (err) {
      toast.error(err.message || 'Failed to save')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return
    try {
      await deletePost(id)
      toast.success('Post deleted')
      refetch()
    } catch (err) {
      toast.error(err.message || 'Failed to delete')
    }
  }

  const postList = Array.isArray(posts) ? posts : posts?.results || []

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">News & Content</h1>
          <p className="text-sm text-gray-500 mt-0.5">{postList.length} post{postList.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-befa-green text-black text-sm font-semibold rounded-lg hover:bg-befa-green-dark transition-colors cursor-pointer">
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-white">{editingId ? 'Edit Post' : 'Create Post'}</h2>
            <button onClick={() => setShowForm(false)} className="p-1 text-gray-500 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400">Title</label>
              <input value={form.title} onChange={update('title')} placeholder="Post title"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-500 outline-hidden focus:border-befa-green/60 transition-colors" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400">Content *</label>
              <textarea value={form.description} onChange={update('description')} rows={5} placeholder="Write your post content..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-500 outline-hidden resize-none focus:border-befa-green/60 transition-colors" />
            </div>
            <div className="flex items-center gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400">Image</label>
                <label className="flex items-center gap-2 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-gray-300 hover:bg-zinc-700 cursor-pointer transition-colors">
                  <Image className="w-4 h-4" />
                  {imageFile ? imageFile.name : 'Choose image'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                </label>
              </div>
              {imagePreview && (
                <img src={imagePreview} alt="" className="w-16 h-16 rounded-lg object-cover border border-zinc-700" />
              )}
              <label className="inline-flex items-center gap-3 cursor-pointer ml-auto">
                <button type="button" onClick={() => setForm((p) => ({ ...p, is_published: !p.is_published }))}
                  className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${form.is_published ? 'bg-befa-green' : 'bg-zinc-600'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.is_published ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
                <span className="text-xs text-gray-300">{form.is_published ? 'Published' : 'Draft'}</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-5">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white cursor-pointer">Cancel</button>
            <button onClick={handleSave} disabled={creating || updating || uploadingImage}
              className="flex items-center gap-2 px-5 py-2 bg-befa-green text-black text-sm font-semibold rounded-lg hover:bg-befa-green-dark transition-colors disabled:opacity-50 cursor-pointer">
              {(creating || updating || uploadingImage) ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {editingId ? 'Update' : 'Publish'}
            </button>
          </div>
        </div>
      )}

      {/* Posts List */}
      {loading ? <LoadingState message="Loading posts..." /> :
       error ? <ErrorState message={error} onRetry={refetch} /> :
       postList.length === 0 ? (
        <EmptyState title="No posts yet" description="Create your first news post or announcement."
          action={<button onClick={openCreate}
            className="mt-2 flex items-center gap-2 px-4 py-2 text-xs font-medium text-befa-green bg-befa-green/10 border border-befa-green/20 rounded-lg hover:bg-befa-green/20 cursor-pointer">
            <Plus className="w-3.5 h-3.5" /> Create Post
          </button>} />
      ) : (
        <div className="space-y-3">
          {postList.map((post) => (
            <div key={post.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors">
              <div className="flex">
                {post.image_url && (
                  <img src={post.image_url} alt="" className="w-32 h-full object-cover shrink-0 hidden sm:block" />
                )}
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-white">{post.title || 'Untitled'}</h3>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${post.is_published ? 'text-befa-green bg-befa-green/10' : 'text-gray-400 bg-zinc-800'}`}>
                          {post.is_published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2">{post.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-500">
                        <span>{post.author_email || 'Admin'}</span>
                        <span>·</span>
                        <span>{formatDate(post.created_at)}</span>
                        {post.like_count > 0 && <span>· {post.like_count} like{post.like_count !== 1 ? 's' : ''}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-3">
                      <button onClick={() => openEdit(post)}
                        className="p-2 text-gray-500 hover:text-white rounded-lg hover:bg-zinc-800 cursor-pointer"><Edit className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(post.id)}
                        className="p-2 text-gray-500 hover:text-red-400 rounded-lg hover:bg-zinc-800 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
