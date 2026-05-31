import React, { useState } from 'react';
import { 
  Check, X, ShieldAlert, Users, TrendingUp, History, 
  Ban, ShieldCheck, AlertCircle, ShoppingCart, RefreshCw, Layers
} from 'lucide-react';
import { GameProduct, UserAccount, ActivityLog, ActiveOrder } from '../types';

interface DevConsoleProps {
  products: GameProduct[];
  users: UserAccount[];
  activityLogs: ActivityLog[];
  activeOrders: ActiveOrder[];
  onApproveProduct: (productId: string) => void;
  onRejectProduct: (productId: string, reason: string) => void;
  onToggleUserBan: (userId: string) => void;
}

export const DevConsole: React.FC<DevConsoleProps> = ({
  products,
  users,
  activityLogs,
  activeOrders,
  onApproveProduct,
  onRejectProduct,
  onToggleUserBan,
}) => {
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [reasonText, setReasonText] = useState('');
  const [userSearch, setUserSearch] = useState('');

  const pendingProducts = products.filter(p => !p.status || p.status === 'Pending');
  const activeProducts = products.filter(p => p.status === 'Active');
  const rejectedProducts = products.filter(p => p.status === 'Rejected');

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectId || !reasonText.trim()) {
      alert('Alasan penolakan wajib ditulis.');
      return;
    }
    onRejectProduct(rejectId, reasonText);
    setRejectId(null);
    setReasonText('');
  };

  return (
    <div className="space-y-8 text-left">
      
      {/* DEVELOPER DASHBOARD INTRO */}
      <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-indigo-950/40 p-6 rounded-3xl border border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <ShieldAlert className="w-5 h-5 text-amber-400 animate-pulse" />
          <span className="text-xs font-bold text-amber-300 uppercase tracking-widest font-mono">DEVELOPER CONTROL MODULE</span>
        </div>
        <h2 className="text-2xl font-extrabold text-white leading-tight font-sans m-0">
          Super Admin & Developer Monitoring Board
        </h2>
        <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
          Pusat integrasi keamanan dan alur supply. Di sini Anda bertindak sebagai Super Admin untuk me-review pengajuan pancingan Frisch, skin, atau koin dari Admin, mengendalikan perizinan status akun pengguna, serta mendapat log transaksi QRIS dan audit in-game secara terpusat.
        </p>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 p-4.5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Persetujuan Pending</p>
            <h3 className="text-xl font-mono font-extrabold text-white">{pendingProducts.length} Item</h3>
            <p className="text-[10px] text-slate-500">Menanti verifikasi rilis</p>
          </div>
          <div className="w-9 h-9 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center font-bold">
            ⚡
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4.5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Item Aktif Live</p>
            <h3 className="text-xl font-mono font-extrabold text-white">{activeProducts.length} Items</h3>
            <p className="text-[10px] text-slate-500">Tayang di etalase/buyer</p>
          </div>
          <div className="w-9 h-9 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center font-bold">
            ✓
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4.5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Total User Terdaftar</p>
            <h3 className="text-xl font-mono font-extrabold text-white">{users.length} Akun</h3>
            <p className="text-[10px] text-slate-500">3 Level hak akses</p>
          </div>
          <div className="w-9 h-9 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4.5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">Akun Di-Ban (Sanksi)</p>
            <h3 className="text-xl font-mono font-extrabold text-rose-400">
              {users.filter(u => u.status === 'Banned').length} Akun
            </h3>
            <p className="text-[10px] text-slate-500">Blokir aktivitas mencurigakan</p>
          </div>
          <div className="w-9 h-9 bg-rose-500/10 text-rose-400 rounded-xl flex items-center justify-center">
            <Ban className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 2 COLUMN INTERACTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUMN LEFT: SUPPLY APPROVAL & BAN PORTAL (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* PERSETUJUAN SUPLAI (PANDING LIST) */}
          <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-3xl space-y-4">
            <div className="border-b border-slate-800/80 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-400" />
                  Antrean Perizinan Suplai Item Roblox & Fisch
                </h3>
                <p className="text-slate-500 text-[11px] mt-0.5">Daftar item game baru yang diajukan oleh para Admin. Harap periksa detail sebelum rilis.</p>
              </div>
              <span className="bg-amber-400/20 text-amber-300 px-2 py-0.5 border border-amber-500/30 rounded text-[10px] font-mono font-bold uppercase">{pendingProducts.length} Pending</span>
            </div>

            {pendingProducts.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500 space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-850">
                <AlertCircle className="w-6 h-6 text-slate-650 mx-auto" />
                <p>Tidak ada pengajuan suplai item 'Pending' saat ini.</p>
                <p className="text-[10px] text-slate-600">Semua pancingan Fisch, skins, dan Robux sudah ter-approve atau ditolak.</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {pendingProducts.map(product => (
                  <div key={product.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-850 flex flex-col md:flex-row md:items-center justify-between gap-4 transition hover:border-slate-800">
                    <div className="space-y-1.5 text-left flex-1">
                      <div className="flex gap-2 items-center flex-wrap">
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {product.category}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-slate-900 text-slate-400 border border-slate-800">
                          ID: {product.id}
                        </span>
                        <span className="text-[10px] text-amber-300 font-bold bg-amber-400/10 border border-amber-500/20 px-1.5 py-0.5 rounded flex items-center gap-1">
                          ● Menunggu Persetujuan
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{product.name}</h4>
                      <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">{product.description}</p>
                      
                      <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[10px]">
                        <div>
                          <span className="text-slate-500">Harga: </span>
                          <strong className="text-emerald-400">Rp {product.price.toLocaleString('id-ID')}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500">Stok Pasok: </span>
                          <strong className="text-white">{product.stock}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500">Oleh: </span>
                          <strong className="text-sky-300">{product.addedBy || 'Admin Rian'}</strong>
                        </div>
                      </div>
                    </div>

                    {/* ACTIONS ACTION */}
                    <div className="flex md:flex-col gap-2 shrink-0 justify-end pt-1 md:pt-0">
                      <button
                        onClick={() => onApproveProduct(product.id)}
                        className="p-2 px-3 rounded-xl bg-emerald-400 text-slate-950 hover:bg-emerald-500 text-xs font-bold transition flex items-center gap-1 justify-center cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve (Live)
                      </button>
                      <button
                        onClick={() => setRejectId(product.id)}
                        className="p-2 px-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500 hover:text-white text-xs font-bold transition flex items-center gap-1 justify-center cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" /> Reject (Tolak)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* REJECTION REASON MODAL POP SECTION */}
            {rejectId && (
              <div className="p-4 bg-slate-950 border-2 border-rose-500/40 rounded-2xl space-y-3">
                <p className="text-xs font-bold text-rose-300 flex items-center gap-1">
                  ⚠️ Masukkan Alasan Penolakan untuk ID: <strong className="font-mono text-white">"{rejectId}"</strong>
                </p>
                <form onSubmit={handleRejectSubmit} className="space-y-3">
                  <input
                    type="text"
                    required
                    value={reasonText}
                    onChange={(e) => setReasonText(e.target.value)}
                    placeholder="Alasan penolakan, misal: Stok terlalu kecil / Harga tidak sesuai eceran tertinggi."
                    className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 text-xs focus:outline-none"
                  />
                  <div className="flex justify-end gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setRejectId(null)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-rose-500 text-white font-bold"
                    >
                      Tolak Permanen
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>

          {/* REGISTERED USERS MANAGEMENT & BAN/UNBAN (DATABASE PELESTARIAN) */}
          <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-3xl space-y-4">
            <div className="border-b border-slate-800/80 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4.5 h-4.5 text-indigo-400" />
                Sistem Manajemen Database Pengguna & Perizinan Login (Ban Tool)
              </h3>
              <p className="text-slate-500 text-[11px] mt-0.5">Cari akun instan di seluruh peranan. Anda memiliki kuasa memblokir (Ban) member nakal atau admin nakal demi integritas toko.</p>
            </div>

            {/* SEARCH */}
            <div className="flex bg-slate-950/80 p-2 rounded-xl border border-slate-850 items-center px-3 gap-2">
              <Users className="w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Cari email, username, atau role (e.g. developer, admin, buyer)..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full bg-transparent p-1 px-1.5 text-white text-xs focus:outline-none"
              />
            </div>

            {/* USERS TABLE LIST */}
            <div className="overflow-x-auto rounded-xl border border-slate-900 bg-slate-950">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-slate-400 font-bold border-b border-slate-850 text-[10px]">
                    <th className="p-3">Username / Email</th>
                    <th className="p-3">Hak Akses Role</th>
                    <th className="p-3">Status Kontrol</th>
                    <th className="p-3">Last Login</th>
                    <th className="p-3 text-right">Aksi Ban</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/60 font-mono">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-slate-500">Tidak ada data akun yang cocok.</td>
                    </tr>
                  ) : (
                    filteredUsers.map(user => {
                      let roleBadge = '';
                      if (user.role === 'developer') roleBadge = 'bg-amber-400/10 text-amber-300 border-amber-500/20';
                      else if (user.role === 'admin') roleBadge = 'bg-sky-400/10 text-sky-300 border-sky-500/20';
                      else roleBadge = 'bg-emerald-400/10 text-emerald-300 border-emerald-500/20';

                      return (
                        <tr key={user.id} className="hover:bg-slate-900/40">
                          <td className="p-3">
                            <p className="font-bold font-sans text-white text-[11px]">{user.username}</p>
                            <p className="text-[10px] text-slate-550 select-text">{user.email}</p>
                          </td>
                          <td className="p-3">
                            <span className={`px-1.5 py-0.5 rounded border text-[9px] uppercase font-bold ${roleBadge}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              user.status === 'Active' 
                                ? 'bg-emerald-400/10 text-emerald-300 font-semibold border border-emerald-500/20' 
                                : 'bg-rose-500/10 text-rose-300 font-semibold border border-rose-500/30'
                            }`}>
                              ● {user.status}
                            </span>
                          </td>
                          <td className="p-3 text-slate-400 text-[10px]">{user.lastLogin || user.createdAt}</td>
                          <td className="p-3 text-right font-sans">
                            {user.role === 'developer' ? (
                              <span className="text-[10px] text-slate-600 font-semibold italic">Developer Utama</span>
                            ) : (
                              <button
                                onClick={() => onToggleUserBan(user.id)}
                                className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer transition ${
                                  user.status === 'Active'
                                    ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white'
                                    : 'bg-emerald-400/10 border border-emerald-500/20 text-emerald-300 hover:bg-emerald-400 hover:text-slate-950'
                                }`}
                              >
                                {user.status === 'Active' ? 'Ban Acc' : 'Unban Acc'}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* COLUMN RIGHT: LIVE TRANSATION LOGS & AUDIT ACTIVITIES (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* LATEST TRANSACTIONS DISPLAY */}
          <div className="bg-slate-900/60 p-5 rounded-3xl border border-slate-800 space-y-4">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <ShoppingCart className="w-4 h-4 text-emerald-400" />
                  Monitoring Transaksi Buyer (Real-time)
                </h3>
                <p className="text-slate-500 text-[11px] mt-0.5">Riwayat pembelian item oleh pembeli. Sinkronisasi instan dengan Server Bot.</p>
              </div>
            </div>

            {activeOrders.length === 0 ? (
              <div className="p-4 rounded-xl text-center text-slate-500 text-xs bg-slate-950/60 border border-slate-900">
                Belum ada transaksi pembelian live dari buyer saat ini.
              </div>
            ) : (
              <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1 no-scrollbar text-left">
                {activeOrders.slice().reverse().map(order => (
                  <div key={order.id} className="p-3 bg-slate-950 rounded-xl border border-slate-900 text-[11px] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white max-w-[150px] truncate">{order.product.name}</span>
                      <span className="font-mono font-bold text-emerald-400">Rp {order.totalAmount.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[10px]">
                      <span>User: <strong className="text-slate-300 font-sans">"{order.robloxUsername}"</strong></span>
                      <span className={`uppercase font-bold ${
                        order.status === 'COMPLETED' ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {order.status === 'COMPLETED' ? 'Lunas / Sukses' : 'Menunggu / Proses'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* LOG AUDIT AKTIVITAS RINGKAS */}
          <div className="bg-slate-900/60 p-5 rounded-3xl border border-slate-800 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <History className="w-4.5 h-4.5 text-indigo-400 animate-pulse" />
                Situs Log Aktivitas Audit Sistem (Trace Log)
              </h3>
              <p className="text-slate-500 text-[11px] mt-0.5">Segala aktivitas Admin (input supply) & Developer (Approve/Reject/Banning) tersimpan rapi di sini.</p>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 no-scrollbar text-xs font-mono">
              {activityLogs.map(log => {
                let badgeClr = 'text-blue-400';
                if (log.type === 'success') badgeClr = 'text-green-400';
                if (log.type === 'danger') badgeClr = 'text-rose-400';
                if (log.type === 'warning') badgeClr = 'text-amber-400';

                return (
                  <div key={log.id} className="p-2.5 rounded-xl border border-slate-900/40 bg-slate-950/80 text-[11px] space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500">[{log.timestamp}]</span>
                      <span className={`font-bold ${badgeClr}`}>{log.action}</span>
                    </div>
                    <p className="text-slate-300 font-sans text-xs">{log.details}</p>
                    <div className="text-[10px] text-slate-500">
                      Oleh: <strong className="text-slate-400">{log.user}</strong> ({log.role.toUpperCase()})
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
