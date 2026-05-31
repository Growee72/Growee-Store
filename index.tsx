import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI } from '@google/genai';
import { 
  Sparkles, MessageSquare, SendHorizontal, Bot, Check, Info, Bell, Shield, Zap
} from 'lucide-react';

import { Header } from './src/components/Header';
import { Footer } from './src/components/Footer';
import { BuyerConsole } from './src/components/BuyerConsole';
import { SellerConsole } from './src/components/SellerConsole';
import { SaaSBenefits } from './src/components/SaaSBenefits';
import { GameAnalytics } from './src/components/GameAnalytics';
import { AdminConsole } from './src/components/AdminConsole';
import { LoginPortal } from './src/components/LoginPortal';
import { DevConsole } from './src/components/DevConsole';
import { INITIAL_PRODUCTS } from './src/data';
import { SubscriptionState, ActiveOrder, BotLog, OrderStatus, GameProduct, UserAccount, ActivityLog } from './src/types';

function App() {
  const [currentTab, setCurrentTab] = useState<'buyer' | 'saas' | 'seller' | 'growth' | 'admin' | 'developer'>('buyer');
  
  // Dynamic products catalog state with Active preset status
  const [products, setProducts] = useState<GameProduct[]>(() => 
    INITIAL_PRODUCTS.map(p => ({ ...p, status: 'Active', addedBy: 'System Preset' }))
  );
  const [isStoreClosed, setIsStoreClosed] = useState(false);
  
  // Track active global subscription state
  const [subscription, setSubscription] = useState<SubscriptionState>({
    tier: 'free',
    price: 0,
    autoRenewal: false,
    nextRenewalDate: '-',
    paymentMethodTokenText: ''
  });

  // Global track active simulated order transactions
  const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>([]);

  // User accounts list with Role & Banned capability
  const [users, setUsers] = useState<UserAccount[]>([
    {
      id: 'user-dev',
      username: 'Developer Utama (Super Admin)',
      email: 'developer@growee.id',
      role: 'developer',
      status: 'Active',
      createdAt: '2026-01-10',
      lastLogin: '2026-05-31 06:12'
    },
    {
      id: 'user-admin-rian',
      username: 'Admin Rian (Penyedia Item)',
      email: 'rian@growee.id',
      role: 'admin',
      status: 'Active',
      createdAt: '2026-02-15',
      lastLogin: '2026-05-31 06:22'
    },
    {
      id: 'user-admin-syifa',
      username: 'Admin Syifa (Penyedia Item)',
      email: 'syifa@growee.id',
      role: 'admin',
      status: 'Active',
      createdAt: '2026-02-18',
      lastLogin: '2026-05-30 18:40'
    },
    {
      id: 'user-buyer-roblox',
      username: 'RobloxGamer99 (Buyer)',
      email: 'buyer@growee.id',
      role: 'buyer',
      status: 'Active',
      createdAt: '2026-03-01',
      lastLogin: '2026-05-31 06:30'
    }
  ]);

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  // System audit records logs management
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    {
      id: 'log-1',
      timestamp: '2026-05-31 06:12',
      user: 'developer@growee.id',
      role: 'developer',
      action: 'Developer Login',
      details: 'Melakukan monitoring rutin & audit sistem security.',
      type: 'info'
    },
    {
      id: 'log-2',
      timestamp: '2026-05-31 06:22',
      user: 'rian@growee.id',
      role: 'admin',
      action: 'Admin Login',
      details: 'Melakukan inspeksi stok Robux in-game.',
      type: 'info'
    }
  ]);

  const addActivityLog = (
    user: string, 
    role: 'developer' | 'admin' | 'buyer', 
    action: string, 
    details: string, 
    type: 'info' | 'success' | 'warning' | 'danger'
  ) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user,
      role,
      action,
      details,
      type
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    if (user.role === 'developer') {
      setCurrentTab('developer');
    } else if (user.role === 'admin') {
      setCurrentTab('admin');
    } else {
      setCurrentTab('buyer');
    }
    // Update lastLogin on database
    setUsers(prev => prev.map(u => {
      if (u.id === user.id) {
        return { ...u, lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 16) };
      }
      return u;
    }));
    addActivityLog(
      user.email,
      user.role,
      'User Login',
      `Autentikasi role ${user.role.toUpperCase()} diperbolehkan masuk ke sistem.`,
      'info'
    );
  };

  const handleLogout = () => {
    if (currentUser) {
      addActivityLog(
        currentUser.email,
        currentUser.role,
        'User Logout',
        `Aktivitas sesi pengguna "${currentUser.username}" diakhiri secara aman.`,
        'info'
      );
    }
    setCurrentUser(null);
    setCurrentTab('buyer');
  };

  const handleApproveProduct = (productId: string) => {
    const prod = products.find(p => p.id === productId);
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, status: 'Active' };
      }
      return p;
    }));
    addActivityLog(
      currentUser?.email || 'developer@growee.id',
      'developer',
      'Approve Item',
      `Menyetujui rilis item "${prod?.name || productId}" ke dalam Katalog Pembeli. status: Active`,
      'success'
    );
  };

  const handleRejectProduct = (productId: string, reason: string) => {
    const prod = products.find(p => p.id === productId);
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, status: 'Rejected', rejectionReason: reason };
      }
      return p;
    }));
    addActivityLog(
      currentUser?.email || 'developer@growee.id',
      'developer',
      'Reject Item',
      `Menolak rilis item "${prod?.name || productId}". Alasan: ${reason}`,
      'danger'
    );
  };

  const handleToggleUserBan = (userId: string) => {
    const u = users.find(account => account.id === userId);
    if (!u) return;
    const nextStatus = u.status === 'Active' ? 'Banned' : 'Active';
    setUsers(prev => prev.map(account => {
      if (account.id === userId) {
        return { ...account, status: nextStatus };
      }
      return account;
    }));
    addActivityLog(
      currentUser?.email || 'developer@growee.id',
      'developer',
      nextStatus === 'Banned' ? 'Sanksi Ban' : 'Pencabutan Ban',
      `Mengubah status perizinan login account ${u.username} (${u.email}) menjadi ${nextStatus}.`,
      nextStatus === 'Banned' ? 'danger' : 'success'
    );
  };

  // AI Chat widget simulator states
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { sender: 'ai', text: 'Halo! Saya Growee AI Assistant. Ada yang bisa saya bantu mengenai kurs Robux, rekomendasi Joran Fisch, atau cara kerja sistem langganan SaaS kami? 😎' }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAddOrder = (order: ActiveOrder) => {
    setActiveOrders(prev => [...prev, order]);
  };

  const handleAddProduct = (newProduct: GameProduct) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  const handleUpdateStockAndPrice = (productId: string, addStock: number, newPrice?: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          stock: p.stock + addStock,
          price: newPrice !== undefined ? newPrice : p.price,
          originalPrice: newPrice !== undefined ? Math.round(newPrice * 1.3) : p.originalPrice
        };
      }
      return p;
    }));
  };

  const handleToggleStoreStatus = () => {
    setIsStoreClosed(prev => !prev);
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus, logs: BotLog[]) => {
    setActiveOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        return { ...ord, status, logs };
      }
      return ord;
    }));
  };

  const handleUpdateSubscription = (newSub: SubscriptionState) => {
    setSubscription(newSub);
  };

  // AI query handler with graceful fallback
  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim() || isAiLoading) return;

    const userQuery = aiInput;
    setAiInput('');
    setAiMessages(prev => [...prev, { sender: 'user', text: userQuery }]);
    setIsAiLoading(true);

    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

    try {
      if (!apiKey || apiKey === 'undefined' || apiKey.startsWith('__')) {
        // Fallback simulation responses for unconfigured API Keys
        setTimeout(() => {
          let reply = "";
          const queryLower = userQuery.toLowerCase();
          
          if (queryLower.includes('pajak') || queryLower.includes('tax') || queryLower.includes('robux')) {
            reply = "Pajak standar di game Roblox adalah **30%** untuk pembelian aset gamepass. Di Growee Store, bot kami secara otomatis menghitung transfer agar jumlah Robux yang masuk ke akun Anda bersih (100% utuh) tanpa terpotong pajak roblox!";
          } else if (queryLower.includes('fisch') || queryLower.includes('joran') || queryLower.includes('rod')) {
            reply = "Di peta *Fisch* Roblox, joran terbaik adalah **Abyssal Rod [Legendary]** (luck +250% untuk menangkap monster laut dalam) dan **Auroral Rod [Divine]** (meningkatkan tangkapan varian mutation langka sebesar 3x lipat). Kedua joran legendaris tersebut tersedia siap dikirim bot kami!";
          } else if (queryLower.includes('saas') || queryLower.includes('langganan') || queryLower.includes('premium')) {
            reply = "Sistem SaaS Growee memberikan otomatisasi luar biasa! Akun **Premium VIP** mendapat prioritas antrean bot urutan kesatu, zero admin fee untuk seluruh e-wallet/bank, dan diskon VIP langsung sebesar 2% - 10% di setiap item game.";
          } else {
            reply = "Growee Store mengintegrasikan sistem SaaS Top-up Roblox & Fisch terdepan dengan robot autopilot. Anda hanya perlu checkout dengan Username Roblox tanpa harus memasukkan sandi / password akun demi keamanan mutlak.";
          }
          setAiMessages(prev => [...prev, { sender: 'ai', text: reply }]);
          setIsAiLoading(false);
        }, 1000);
        return;
      }

      const ai = new GoogleGenAI({ apiKey: apiKey });
      const prompt = `Anda adalah "Growee AI Assistant", asisten profesional untuk website marketplace SaaS top-up & trading item Roblox (Robux, Fisch items, Blox Fruits). Berikan jawaban yang informatif, ramah, dan singkat dalam Bahasa Indonesia.
      Pertanyaan User: ${userQuery}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      const responseText = response.text || "Terjadi kendala menanggapi pertanyaan.";
      setAiMessages(prev => [...prev, { sender: 'ai', text: responseText }]);
    } catch (err: any) {
      console.error(err);
      setAiMessages(prev => [
        ...prev, 
        { sender: 'ai', text: `Asisten offline sementara. Tetapi info umum: Kurs Robux saat ini adalah standar tinggi dan pengiriman Fisch Rod dijamin aman lewat trading in-game!` }
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 selection:bg-indigo-500/30 selection:text-white flex flex-col justify-between">
      
      {/* HEADER SECTION */}
      <Header 
        currentTab={currentTab} 
        onTabChange={setCurrentTab} 
        subscription={subscription} 
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* NEW PROMOTION ALERTS / ticker */}
      <div className="w-full bg-indigo-950/30 border-b border-indigo-900/40 py-2.5 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-[11px] text-indigo-300">
          <div className="flex items-center gap-2">
            <Bell className="w-3.5 h-3.5 animate-bounce shrink-0" />
            <span>🎉 <strong>PROMO SAAS BULAN INI:</strong> Aktifkan Premium VIP untuk menikmati gratis biaya admin dan diskon joran Fisch legendaris hingga 10% !</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono">Bot Server status: OK (Response: &lt;5s)</span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-bold">2,481 Transaksi Hari Ini</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl w-full mx-auto px-4 py-8 flex-1 space-y-12">
        
        {/* HERO BANNER SECTION (ONLY DISPLAY FOR MAIN TAB) */}
        {currentUser && currentTab === 'buyer' && (
          <div className="relative rounded-3xl p-6 md:p-10 bg-gradient-to-tr from-slate-950 via-slate-900/90 to-indigo-950/40 border border-slate-800 overflow-hidden shadow-2xl">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-5 text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  100% Aman & Tanpa Password
                </div>
                
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight m-0 text-left font-sans">
                  Pusat Top-Up & Trading Otomatis <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">Robles & Fisch Item</span>
                </h1>
                
                <p className="text-slate-400 text-sm md:text-md leading-relaxed">
                  Growee Store menghadirkan pengalaman berbelanja item game tercepat menggunakan integrasi asisten bot in-game. Beli Robux via Gamepass atau pancingan mitis map Fisch, bayar instan pakai QRIS, dan saksikan pengiriman bot bekerja di depan mata Anda!
                </p>

                <div className="flex flex-wrap gap-4 pt-1 text-xs">
                  <div className="flex items-center gap-1 text-slate-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Layanan Bot 24/7</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Instant Payment QRIS</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Tanpa Login Akun</span>
                  </div>
                </div>
              </div>

              {/* Stat Highlights Panel */}
              <div className="grid grid-cols-2 gap-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-850 backdrop-blur-sm">
                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Kecepatan Bot</p>
                  <h3 className="text-xl md:text-2xl font-extrabold text-white font-mono flex items-center gap-1">
                    &lt; 30 Detik <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                  </h3>
                  <p className="text-[10px] text-slate-400">Pengiriman tercepat di Asia Tenggara</p>
                </div>

                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Bebas Admin Fee</p>
                  <h3 className="text-xl md:text-2xl font-extrabold text-indigo-400 font-mono">Premium VIP</h3>
                  <p className="text-[10px] text-slate-400">Nikmati biaya admin Rp 0 selamanya</p>
                </div>

                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1 col-span-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
                    <span>Proteksi Dana Pembeli (Sistem Rekber)</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono">SAFE</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug mt-1.5">
                    Dana pembayaran Anda akan ditahan oleh platform Growee Store, dan baru diteruskan ke merchant setelah bot memvalidasi item terkirim dengan sukses ke ID game Anda.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CONDITIONALLY RENDER TAB CONTENTS OR LOGIN PORTAL */}
        {currentUser === null ? (
          <LoginPortal 
            users={users} 
            onLoginSuccess={handleLoginSuccess} 
          />
        ) : (
          <>
            {currentTab === 'buyer' && (
              <BuyerConsole 
                subscription={subscription} 
                onAddOrder={handleAddOrder}
                activeOrders={activeOrders}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                products={products}
                isStoreClosed={isStoreClosed}
              />
            )}

            {currentTab === 'saas' && (
              <SaaSBenefits 
                subscription={subscription} 
                onUpdateSubscription={handleUpdateSubscription} 
              />
            )}

            {currentTab === 'seller' && (
              <SellerConsole 
                subscription={subscription} 
              />
            )}

            {currentTab === 'growth' && (
              <GameAnalytics subscription={subscription} />
            )}

            {currentTab === 'admin' && (
              <AdminConsole 
                products={products}
                isStoreClosed={isStoreClosed}
                onToggleStoreStatus={handleToggleStoreStatus}
                onAddProduct={handleAddProduct}
                onUpdateStockAndPrice={handleUpdateStockAndPrice}
                currentUser={currentUser}
              />
            )}

            {currentTab === 'developer' && (
              <DevConsole 
                products={products}
                users={users}
                activityLogs={activityLogs}
                activeOrders={activeOrders}
                onApproveProduct={handleApproveProduct}
                onRejectProduct={handleRejectProduct}
                onToggleUserBan={handleToggleUserBan}
              />
            )}
          </>
        )}

        {/* GEMINI AI ASSISTANT PANEL */}
        <div className="bg-slate-900/40 rounded-3xl p-6 border border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Info panel */}
            <div className="md:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20 uppercase tracking-widest">
                <Bot className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                Asisten Robot
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                Konsultasikan Rencana Trading Anda dengan AI
              </h2>
              <p className="text-slate-450 text-xs leading-relaxed">
                Butuh saran mengenai persentase pajak Robux Roblox? Ragu cara membuat Gamepass Roblox atau mencari letak trading aman item pancing Fisch? Tanya asisten kecerdasan buatan kami langsung di sini.
              </p>

              {/* Popular tags suggestion */}
              <div className="space-y-2 pt-1 text-xs">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Coba Pertanyaan Contoh:</p>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setAiInput("Berapa pajak Gamepass Roblox?")}
                    className="p-1.5 px-2.5 rounded bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-400 text-[11px] transition"
                  >
                    "Berapa pajak Robux Roblox?"
                  </button>
                  <button 
                    onClick={() => setAiInput("Joran Fisch mana yang paling langka?")}
                    className="p-1.5 px-2.5 rounded bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-400 text-[11px] transition"
                  >
                    "Joran terbaik di Fisch map?"
                  </button>
                  <button 
                    onClick={() => setAiInput("Bagaimana sistem SaaS member menguntungkan?")}
                    className="p-1.5 px-2.5 rounded bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-400 text-[11px] transition"
                  >
                    "Apa keuntungan premium?"
                  </button>
                </div>
              </div>
            </div>

            {/* Simulated Live Chat terminal widget */}
            <div className="md:col-span-7 bg-slate-950 p-4 rounded-2xl border border-slate-850 flex flex-col justify-between min-h-[280px]">
              {/* Chat screen logs */}
              <div className="space-y-3 max-h-[190px] overflow-y-auto pr-1 no-scrollbar text-xs">
                {aiMessages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-indigo-500 text-white rounded-tr-none'
                        : 'bg-slate-900 text-slate-300 rounded-tl-none border border-slate-800'
                    }`}>
                      <p className="whitespace-pre-line text-xs">{msg.text}</p>
                    </div>
                  </div>
                ))}

                {isAiLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-900 text-slate-400 p-3 rounded-2xl rounded-tl-none border border-slate-800 flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                      <span>Growee AI sedang mengetik...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat submit form */}
              <form onSubmit={handleAskAI} className="mt-4 pt-3 border-t border-slate-900 flex gap-2">
                <input
                  type="text"
                  required
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder="Ketik pertanyaan trading Roblox/Fisch di sini..."
                  className="flex-1 bg-slate-900 placeholder-slate-650 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-indigo-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isAiLoading}
                  className="p-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white transition-colors duration-200"
                >
                  <SendHorizontal className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>
        </div>

      </main>

      {/* FOOTER SECTION */}
      <Footer />

    </div>
  );
}

const container = document.getElementById('root') as HTMLElement;
let root = (window as any).__reactRoot;
if (!root) {
  root = ReactDOM.createRoot(container);
  (window as any).__reactRoot = root;
}
root.render(<App />);
