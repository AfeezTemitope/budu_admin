import { useState, useCallback } from 'react'
import { Plus, Edit, Trash2, Package, ShoppingCart, Image, X, Save, Loader } from 'lucide-react'
import toast from 'react-hot-toast'
import { useApi, useMutation } from '../../hooks'
import { storeService } from '../../api'
import { LoadingState, ErrorState, EmptyState } from '../../components/common/States'
import { formatDate } from '../../utils/helpers'

const EMPTY_PRODUCT = { name: '', price: '', size: '', description: '', in_stock: true }
const ORDER_STATUSES = ['pending', 'placed', 'shipped', 'delivered', 'cancelled']
const statusColors = {
  pending: 'text-amber-400 bg-amber-400/10',
  placed: 'text-blue-400 bg-blue-400/10',
  shipped: 'text-purple-400 bg-purple-400/10',
  delivered: 'text-befa-green bg-befa-green/10',
  cancelled: 'text-red-400 bg-red-400/10',
}

export default function StorePage() {
  const [tab, setTab] = useState('products')

  const fetchProducts = useCallback(() => storeService.listProducts(), [])
  const fetchOrders = useCallback(() => storeService.listOrders(), [])
  const { data: products, loading: pLoading, error: pError, execute: refetchProducts } = useApi(fetchProducts, [], { initialData: [] })
  const { data: orders, loading: oLoading, error: oError, execute: refetchOrders } = useApi(fetchOrders, [], { initialData: [] })
  const { execute: createProduct, loading: creating } = useMutation(storeService.createProduct)
  const { execute: updateProduct, loading: updating } = useMutation((id, data) => storeService.updateProduct(id, data))
  const { execute: deleteProduct } = useMutation(storeService.deleteProduct)
  const { execute: updateOrder } = useMutation((id, data) => storeService.updateOrder(id, data))

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ ...EMPTY_PRODUCT })

  const upd = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }))

  const openCreate = () => { setForm({ ...EMPTY_PRODUCT }); setEditingId(null); setShowForm(true) }
  const openEdit = (p) => {
    setForm({ name: p.name, price: p.price, size: p.size, description: p.description || '', in_stock: p.in_stock ?? true })
    setEditingId(p.id)
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.price) { toast.error('Name and price are required'); return }
    try {
      if (editingId) { await updateProduct(editingId, form); toast.success('Product updated') }
      else { await createProduct(form); toast.success('Product created') }
      setShowForm(false)
      refetchProducts()
    } catch (err) { toast.error(err.message || 'Failed to save') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    try { await deleteProduct(id); toast.success('Deleted'); refetchProducts() }
    catch (err) { toast.error(err.message) }
  }

  const handleOrderStatus = async (id, status) => {
    try { await updateOrder(id, { status }); toast.success('Order updated'); refetchOrders() }
    catch (err) { toast.error(err.message) }
  }

  const productList = Array.isArray(products) ? products : products?.results || []
  const orderList = Array.isArray(orders) ? orders : orders?.results || []

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Store</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage products and orders</p>
        </div>
        {tab === 'products' && (
          <button onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-befa-green text-black text-sm font-semibold rounded-lg hover:bg-befa-green-dark transition-colors cursor-pointer">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1 w-fit">
        {[{ key: 'products', label: 'Products', icon: Package }, { key: 'orders', label: 'Orders', icon: ShoppingCart }].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              tab === t.key ? 'bg-zinc-800 text-white' : 'text-gray-500 hover:text-white'
            }`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Product Form */}
      {showForm && tab === 'products' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-white">{editingId ? 'Edit Product' : 'New Product'}</h2>
            <button onClick={() => setShowForm(false)} className="p-1 text-gray-500 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400">Name *</label>
              <input value={form.name} onChange={upd('name')} placeholder="Product name"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-500 outline-hidden focus:border-befa-green/60 transition-colors" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400">Price (₦) *</label>
              <input type="number" value={form.price} onChange={upd('price')} placeholder="0.00"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-500 outline-hidden focus:border-befa-green/60 transition-colors" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400">Size</label>
              <input value={form.size} onChange={upd('size')} placeholder="e.g. M, L, XL"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-500 outline-hidden focus:border-befa-green/60 transition-colors" />
            </div>
          </div>
          <div className="mt-4 space-y-1.5">
            <label className="text-xs font-medium text-gray-400">Description</label>
            <textarea value={form.description} onChange={upd('description')} rows={2} placeholder="Product description..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-500 outline-hidden resize-none focus:border-befa-green/60 transition-colors" />
          </div>
          <div className="flex items-center justify-between mt-4">
            <label className="inline-flex items-center gap-3 cursor-pointer">
              <button type="button" onClick={() => setForm((p) => ({ ...p, in_stock: !p.in_stock }))}
                className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${form.in_stock ? 'bg-befa-green' : 'bg-zinc-600'}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.in_stock ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
              <span className="text-xs text-gray-300">{form.in_stock ? 'In Stock' : 'Out of Stock'}</span>
            </label>
            <div className="flex gap-3">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-400 cursor-pointer">Cancel</button>
              <button onClick={handleSave} disabled={creating || updating}
                className="flex items-center gap-2 px-5 py-2 bg-befa-green text-black text-sm font-semibold rounded-lg hover:bg-befa-green-dark disabled:opacity-50 cursor-pointer">
                {(creating || updating) ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {tab === 'products' && (
        pLoading ? <LoadingState message="Loading products..." /> :
        pError ? <ErrorState message={pError} onRetry={refetchProducts} /> :
        productList.length === 0 ? (
          <EmptyState title="No products" description="Add your first product to the store." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {productList.map((p) => (
              <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-40 bg-zinc-800 flex items-center justify-center">
                    <Package className="w-10 h-10 text-gray-700" />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-sm font-semibold text-white">{p.name}</h3>
                      <p className="text-xs text-gray-500">{p.size}</p>
                    </div>
                    <span className="text-sm font-bold text-befa-green">₦{Number(p.price).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${p.in_stock ? 'text-befa-green bg-befa-green/10' : 'text-red-400 bg-red-400/10'}`}>
                      {p.in_stock ? 'In Stock' : 'Out of Stock'}
                    </span>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(p)} className="p-1.5 text-gray-500 hover:text-white rounded hover:bg-zinc-800 cursor-pointer"><Edit className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 text-gray-500 hover:text-red-400 rounded hover:bg-zinc-800 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Orders Tab */}
      {tab === 'orders' && (
        oLoading ? <LoadingState message="Loading orders..." /> :
        oError ? <ErrorState message={oError} onRetry={refetchOrders} /> :
        orderList.length === 0 ? (
          <EmptyState title="No orders yet" description="Orders will appear here when customers place them." />
        ) : (
          <div className="space-y-3">
            {orderList.map((order) => (
              <div key={order.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-sm font-semibold text-white">Order #{order.id}</span>
                    <span className="text-xs text-gray-500 ml-3">{order.user}</span>
                    <span className="text-xs text-gray-600 ml-2">{formatDate(order.created_at)}</span>
                  </div>
                  <select value={order.status} onChange={(e) => handleOrderStatus(order.id, e.target.value)}
                    className="bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1 text-xs text-white outline-hidden appearance-none cursor-pointer">
                    {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                </div>
                <div className="flex flex-wrap gap-2">
                  {order.products?.map((p) => (
                    <span key={p.id} className="text-[11px] px-2 py-1 bg-zinc-800 rounded text-gray-300">
                      {p.name} ({p.size}) — ₦{Number(p.price).toLocaleString()}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}
