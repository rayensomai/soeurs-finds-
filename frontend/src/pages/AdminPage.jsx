import { useCallback, useEffect, useRef, useState } from 'react';
import {
  fetchNewOrderCount,
  fetchOrders,
  formatDate,
  formatPhoneDisplay,
  formatPrice,
  updateOrderStatus,
} from '../api';
import AdminProducts from '../components/AdminProducts';
import Logo from '../components/Logo';

const STATUS_LABELS = {
  nouveau: { label: 'Nouveau', color: 'bg-red-100 text-red-700' },
  contacte: { label: 'Contacté', color: 'bg-yellow-100 text-yellow-700' },
  confirme: { label: 'Confirmé', color: 'bg-green-100 text-green-700' },
  annule: { label: 'Annulé', color: 'bg-gray-100 text-gray-600' },
};

export default function AdminPage() {
  const [password, setPassword] = useState(() => sessionStorage.getItem('admin_pw') || '');
  const [authenticated, setAuthenticated] = useState(false);
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [newCount, setNewCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const prevCountRef = useRef(0);

  const loadOrders = useCallback(async (pw) => {
    try {
      const [ordersData, countData] = await Promise.all([
        fetchOrders(pw),
        fetchNewOrderCount(pw),
      ]);
      setOrders(ordersData);
      setNewCount(countData.count);

      if (countData.count > prevCountRef.current && prevCountRef.current > 0) {
        playNotification();
      }
      prevCountRef.current = countData.count;

      setAuthenticated(true);
      setError('');
    } catch {
      setAuthenticated(false);
      setError('Mot de passe incorrect');
    }
  }, []);

  useEffect(() => {
    if (password && sessionStorage.getItem('admin_pw')) {
      loadOrders(password);
    }
  }, [password, loadOrders]);

  useEffect(() => {
    if (!authenticated || tab !== 'orders') return;

    const interval = setInterval(() => loadOrders(password), 10000);
    return () => clearInterval(interval);
  }, [authenticated, password, loadOrders, tab]);

  const playNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Nouvelle commande !', {
        body: 'Un client souhaite acheter un produit. Appelez-le rapidement !',
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    sessionStorage.setItem('admin_pw', password);
    await loadOrders(password);
    setLoading(false);

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status, password);
      await loadOrders(password);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_pw');
    setAuthenticated(false);
    setPassword('');
    setOrders([]);
  };

  if (!authenticated) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="glass-card w-full max-w-md p-8">
          <div className="mb-6 text-center">
            <div className="mb-4 flex justify-center">
              <Logo className="h-16 w-auto" />
            </div>
            <h1 className="font-display text-2xl font-bold">Espace Admin</h1>
            <p className="mt-2 text-sm text-gray-600">
              Connectez-vous pour gérer les commandes et les produits
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              className="input-field"
              placeholder="Mot de passe admin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-gray-400">
            Mot de passe par défaut : admin123
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900">Administration</h1>
          <p className="mt-1 text-gray-600">Gérez vos commandes et votre catalogue — Canada</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {tab === 'orders' && newCount > 0 && (
            <span className="flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-sm font-bold text-white animate-pulse-soft">
              🔔 {newCount} nouvelle{newCount > 1 ? 's' : ''} commande{newCount > 1 ? 's' : ''}
            </span>
          )}
          {tab === 'orders' && (
            <button
              onClick={() => loadOrders(password)}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Actualiser
            </button>
          )}
          <button
            onClick={handleLogout}
            className="rounded-full px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100"
          >
            Déconnexion
          </button>
        </div>
      </div>

      <div className="mb-8 flex gap-2 rounded-2xl bg-white/80 p-1.5 shadow-sm">
        <button
          onClick={() => setTab('orders')}
          className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
            tab === 'orders' ? 'bg-brand-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          📋 Commandes
        </button>
        <button
          onClick={() => setTab('products')}
          className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
            tab === 'products' ? 'bg-brand-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          📦 Produits
        </button>
      </div>

      {tab === 'products' ? (
        <AdminProducts password={password} />
      ) : orders.length === 0 ? (
        <div className="glass-card py-20 text-center">
          <span className="text-5xl">📭</span>
          <p className="mt-4 text-lg text-gray-600">Aucune commande pour le moment</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusInfo = STATUS_LABELS[order.status] || STATUS_LABELS.nouveau;
            return (
              <div
                key={order.id}
                className={`glass-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between ${
                  order.status === 'nouveau' ? 'ring-2 ring-red-200' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {order.image ? (
                    <img
                      src={order.image}
                      alt={order.product_name}
                      className="h-16 w-16 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-2xl">
                      📦
                    </div>
                  )}
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{order.product_name}</h3>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {order.category_name || 'Produit supprimé'} — {formatPrice(order.price)}
                    </p>
                    <p className="mt-2 text-sm">
                      <strong>{order.prenom} {order.nom}</strong>
                    </p>
                    <a
                      href={`tel:${order.telephone}`}
                      className="mt-1 inline-flex items-center gap-1 text-lg font-bold text-brand-600 hover:text-brand-700"
                    >
                      📞 {formatPhoneDisplay(order.telephone)}
                    </a>
                    <p className="mt-1 text-xs text-gray-400">{formatDate(order.created_at)}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {order.status === 'nouveau' && (
                    <>
                      <a href={`tel:${order.telephone}`} className="btn-primary !px-4 !py-2 !text-xs">
                        Appeler
                      </a>
                      <button
                        onClick={() => handleStatusChange(order.id, 'contacte')}
                        className="rounded-full bg-yellow-100 px-4 py-2 text-xs font-semibold text-yellow-700 hover:bg-yellow-200"
                      >
                        Marquer contacté
                      </button>
                    </>
                  )}
                  {order.status === 'contacte' && (
                    <button
                      onClick={() => handleStatusChange(order.id, 'confirme')}
                      className="rounded-full bg-green-100 px-4 py-2 text-xs font-semibold text-green-700 hover:bg-green-200"
                    >
                      Confirmer
                    </button>
                  )}
                  {['nouveau', 'contacte'].includes(order.status) && (
                    <button
                      onClick={() => handleStatusChange(order.id, 'annule')}
                      className="rounded-full bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-200"
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
