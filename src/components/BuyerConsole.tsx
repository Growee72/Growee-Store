import React, { useState, useEffect } from 'react';
import { 
  Search, Bot, CheckCircle, Clock, ShieldAlert, 
  HelpCircle, Sparkles, Send, RefreshCw, Smartphone, QrCode
} from 'lucide-react';
import { GameProduct, ActiveOrder, BotLog, OrderStatus, SubscriptionState } from '../types';
import { PAYMENT_METHODS } from '../data';

interface BuyerConsoleProps {
  subscription: SubscriptionState;
  onAddOrder: (order: ActiveOrder) => void;
  activeOrders: ActiveOrder[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus, logs: BotLog[]) => void;
  products: GameProduct[];
  isStoreClosed: boolean;
}

export const BuyerConsole: React.FC<BuyerConsoleProps> = ({
  subscription,
  onAddOrder,
  activeOrders,
  onUpdateOrderStatus,
  products,
  isStoreClosed,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Robux' | 'Fisch' | 'Blox Fruits' | 'Pet Simulator X'>('All');
  
  // Selection states
  const [selectedProduct, setSelectedProduct] = useState<GameProduct | null>(null);

  const activeProductsOnly = products.filter(product => !product.status || product.status === 'Active');

  useEffect(() => {
    if (activeProductsOnly && activeProductsOnly.length > 0 && !selectedProduct) {
      setSelectedProduct(activeProductsOnly[0]);
    }
  }, [products, selectedProduct]);

  const [robloxUsername, setRobloxUsername] = useState('GamerRoblox_99');
  const [selectedPaymentId, setSelectedPaymentId] = useState('qris');
  const [gamepassId, setGamepassId] = useState('294829381');

  // Simulation state for creating a live active checkout workflow
  const [currentCheckoutOrder, setCurrentCheckoutOrder] = useState<ActiveOrder | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(120);
  const [logSimulationIndex, setLogSimulationIndex] = useState(-1);
  const [simulationLogs, setSimulationLogs] = useState<BotLog[]>([]);

  const isPremium = subscription.tier === 'premium';

  // Filter and sort products based on search, category, and seller's PRO plan
  const filteredProducts = activeProductsOnly
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const aPro = a.isPro ? 1 : 0;
      const bPro = b.isPro ? 1 : 0;
      if (bPro !== aPro) {
        return bPro - aPro; // PRO first
      }
      return 0;
    });

  const getPrice = (product: GameProduct) => {
    if (isPremium) {
      // Apply VIP price discount
      const discountAmount = (product.price * product.vipPriceDiscount) / 100;
      return Math.round(product.price - discountAmount);
    }
    return product.price;
  };

  const selectedPayment = PAYMENT_METHODS.find(p => p.id === selectedPaymentId) || PAYMENT_METHODS[0];
  const calculatedAdminFee = isPremium ? 0 : selectedPayment.adminFee;
  const itemPrice = selectedProduct ? getPrice(selectedProduct) : 0;
  const totalCost = itemPrice + calculatedAdminFee;

  // Simulate payment QRIS timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentCheckoutOrder && currentCheckoutOrder.status === 'PENDING_PAYMENT') {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            // Cancel order dynamically if timed out
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentCheckoutOrder]);

  // Handle purchase submission
  const handleCheckoutInit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    if (!robloxUsername.trim()) {
      alert('Masukkan username Roblox Anda terlebih dahulu.');
      return;
    }

    const newOrder: ActiveOrder = {
      id: 'TX-' + Math.floor(100000 + Math.random() * 900000),
      product: selectedProduct,
      robloxUsername,
      paymentMethod: selectedPayment.name,
      baseAmount: itemPrice,
      adminFee: calculatedAdminFee,
      totalAmount: totalCost,
      status: 'PENDING_PAYMENT',
      createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      botQueuePosition: isPremium ? 1 : Math.round(2 + Math.random() * 5),
      logs: [
        { timestamp: '00:00', message: 'Invoice diterbitkan. Menunggu pembayaran dari gateway.', type: 'info' }
      ],
      gamepassId: selectedProduct.category === 'Robux' ? gamepassId : undefined,
    };

    setCurrentCheckoutOrder(newOrder);
    setTimerSeconds(120); // 2 minutes to scan
    setLogSimulationIndex(-1);
    setSimulationLogs([]);
  };

  // Simulates Webhook callback after scanning / payment approval
  const triggerPaymentReceived = () => {
    if (!currentCheckoutOrder) return;
    
    // Update state to paid, transition to Bot Processing
    const updatedOrder: ActiveOrder = {
      ...currentCheckoutOrder,
      status: 'PROCESSING_BOT',
      logs: [
        ...currentCheckoutOrder.logs,
        { timestamp: '00:05', message: 'Webhook Gateway: Pembayaran senilai Rp ' + totalCost.toLocaleString('id-ID') + ' BERHASIL terverifikasi.', type: 'success' },
      ]
    };
    
    setCurrentCheckoutOrder(updatedOrder);
    onAddOrder(updatedOrder);

    // Setup sequence of simulation logs for Discord/In-game Bot automatic transfer
    const isRobux = selectedProduct?.category === 'Robux';
    const isFisch = selectedProduct?.category === 'Fisch';
    
    const steps: BotLog[] = [
      { timestamp: '00:08', message: `[SYSTEM] Memulai pengiriman. Antrean Bot ${isPremium ? 'VIP Priority #1' : `Normal #${updatedOrder.botQueuePosition}`} dialokasikan.`, type: 'info' },
      { timestamp: '00:12', message: `[BOT ENGINE] Menghubungkan ke Roblox API... Session aktif. BotID: Roblox-DeliveryBot-04`, type: 'bot' },
      { timestamp: '00:15', message: `[BOT ENGINE] Memverifikasi Roblox Username: "${robloxUsername}"... Hasil: Akun Ditemukan ✔`, type: 'bot' },
    ];

    if (isRobux) {
      steps.push(
        { timestamp: '00:19', message: `[BOT ENGINE] Menghubungkan ke Roblox Asset ID. Mengidentifikasi Gamepass ID: ${gamepassId || '9382048'}`, type: 'bot' },
        { timestamp: '00:24', message: `[BOT ENGINE] Membeli Gamepass "${selectedProduct?.name}" milik user seharga Robux setara...`, type: 'bot' },
        { timestamp: '00:28', message: `[ROBLOX API] Respon berhasil! Dana ditransfer dari RoboFund-Bot-04. Robux berstatus 'Pending' (Masuk dalam 3-5 hari otomatis aturan game Roblox).`, type: 'success' }
      );
    } else if (isFisch) {
      steps.push(
        { timestamp: '00:20', message: `[BOT SERVER] Bot memasuki Private Trading Server game 'Fisch'.`, type: 'bot' },
        { timestamp: '00:23', message: `[BOT SERVER] Mengirimkan undangan trade in-game ke "${robloxUsername}"...`, type: 'bot' },
        { timestamp: '00:26', message: `[BOT SERVER] Melakukan trade item: "${selectedProduct?.name}" dari Inventory Bot ke Slot Item "${robloxUsername}".`, type: 'bot' },
        { timestamp: '00:30', message: `[ROBLOX TRADE] Pengiriman Fisch Item dikonfirmasi aman oleh Secure Trading API.`, type: 'success' }
      );
    } else {
      steps.push(
        { timestamp: '00:21', message: `[BOT SERVER] Bot bergabung ke Trade Plaza / Mailbox Server.`, type: 'bot' },
        { timestamp: '00:25', message: `[BOT SERVER] Mentransfer item "${selectedProduct?.name}" ke alamat tujuan in-game Mailbox User "${robloxUsername}".`, type: 'bot' },
        { timestamp: '00:29', message: `[SUCCESS] Item dikirim ke mailbox.`, type: 'success' }
      );
    }

    steps.push(
      { timestamp: '00:32', message: `[NOTIFIKASI] WhatsApp / Discord Notification dikirim ke ${isPremium ? 'User Premium +628***' : 'User Standard (Email saja)'}.`, type: 'info' },
      { timestamp: '00:35', message: 'Transaksi selesai sepenuhnya! Terima kasih telah berkendara bersama Growee Store.', type: 'success' }
    );

    setSimulationLogs(steps);
    setLogSimulationIndex(0);
  };

  // Log simulation processing step-by-step
  useEffect(() => {
    if (logSimulationIndex >= 0 && logSimulationIndex < simulationLogs.length && currentCheckoutOrder) {
      const timeout = setTimeout(() => {
        const nextLog = simulationLogs[logSimulationIndex];
        const updatedLogs = [...currentCheckoutOrder.logs, nextLog];
        
        let newStatus: OrderStatus = currentCheckoutOrder.status;
        if (logSimulationIndex === simulationLogs.length - 1) {
          newStatus = 'COMPLETED';
        } else if (logSimulationIndex > 2) {
          newStatus = 'DELIVERING';
        }

        const updatedOrder: ActiveOrder = {
          ...currentCheckoutOrder,
          status: newStatus,
          logs: updatedLogs
        };

        setCurrentCheckoutOrder(updatedOrder);
        onUpdateOrderStatus(currentCheckoutOrder.id, newStatus, updatedLogs);
        
        setLogSimulationIndex(prev => prev + 1);
      }, 1500); // 1.5s delay to make logging super immersive!
      
      return () => clearTimeout(timeout);
    }
  }, [logSimulationIndex, currentCheckoutOrder, simulationLogs]);

  // Reset simulator
  const startNewTransaction = () => {
    setCurrentCheckoutOrder(null);
    setLogSimulationIndex(-1);
    setSimulationLogs([]);
  };

  const getDeliveryIcon = (type: string) => {
    switch (type) {
      case 'Automatic Bot':
      case 'Instant Gamepass':
        return '🤖';
      case 'Secure Trading Server':
        return '⚔️';
      case 'Group Funds':
        return '👥';
      default:
        return '📦';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* LEFT PANEL: CATALOG OF PRODUCTS (8 columns on Desktop) */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Search & Category Filter Header */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Cari item fisch, robux, dll..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 placeholder-slate-600 text-slate-200 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-800/80 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all text-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar py-1">
            {(['All', 'Robux', 'Fisch', 'Blox Fruits', 'Pet Simulator X'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === cat 
                    ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20' 
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredProducts.map(product => {
            const currentPrice = getPrice(product);
            const savedAmount = product.originalPrice - currentPrice;
            const isSelected = selectedProduct?.id === product.id;

            return (
              <div
                key={product.id}
                onClick={() => {
                  if (!currentCheckoutOrder) {
                    setSelectedProduct(product);
                  }
                }}
                className={`relative rounded-2xl p-5 border cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                  isSelected 
                    ? 'border-indigo-500 bg-indigo-950/20 shadow-[0_0_15px_rgba(99,102,241,0.15)]' 
                    : 'border-slate-800 bg-slate-900/40 hover:bg-slate-900/70 hover:border-slate-700'
                } ${currentCheckoutOrder ? 'pointer-events-none opacity-50' : ''}`}
              >
                {/* Badge (PRO Prioritas vs Standar) */}
                {product.isPro ? (
                  <div className="absolute top-3 right-3 bg-amber-400/25 text-amber-300 border border-amber-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 uppercase tracking-wider shadow-[0_0_10px_rgba(251,191,36,0.12)] animate-pulse">
                    <span>🌟 PROMOTED</span>
                  </div>
                ) : product.badge ? (
                  <div className="absolute top-3 right-3 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                    {product.badge}
                  </div>
                ) : null}

                {/* Content */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getDeliveryIcon(product.deliveryType)}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded">
                      {product.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-md tracking-tight leading-tight group-hover:text-indigo-400">
                      {product.name}
                    </h3>
                    <p className="text-slate-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* Pricing & Stock */}
                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-end justify-between">
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-md font-extrabold text-white">
                        Rp {currentPrice.toLocaleString('id-ID')}
                      </span>
                      {product.originalPrice > currentPrice && (
                        <span className="text-[10px] line-through text-slate-500">
                          Rp {product.originalPrice.toLocaleString('id-ID')}
                        </span>
                      )}
                    </div>
                    {isPremium && (
                      <p className="text-[10px] text-emerald-400 font-medium">
                        ✔ Diskon VIP {product.vipPriceDiscount}% Aktif
                      </p>
                    )}
                    {!isPremium && (
                      <p className="text-[9px] text-slate-500 hover:text-indigo-400">
                        Diskon VIP Rp {Math.round(product.price * product.vipPriceDiscount / 100).toLocaleString('id-ID')} dgn Premium
                      </p>
                    )}
                  </div>

                  <span className="text-[10px] text-slate-500 font-medium">
                    Stok: <span className="text-indigo-300 font-mono">{product.stock}</span>
                  </span>
                </div>
              </div>
            );
          })}
          
          {filteredProducts.length === 0 && (
            <div className="col-span-2 py-12 text-center bg-slate-900/20 border border-slate-800 rounded-2xl">
              <ShieldAlert className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400 text-xs">Item game tidak ditemukan. Coba bersihkan pencarian Anda.</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: TRANSACTION CONFIGURATOR & SIMULATOR (5 columns on Desktop) */}
      <div className="lg:col-span-5">
        <div className="bg-slate-900/60 rounded-3xl p-6 border border-slate-800 backdrop-blur-md space-y-6">
          
          {/* STAGE A: Order Selection & Configuration Form */}
          {!currentCheckoutOrder ? (
            <form onSubmit={handleCheckoutInit} className="space-y-5">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-md font-bold text-white flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
                  Konfigurasi Pembelian Item
                </h3>
                <p className="text-slate-500 text-xs mt-1">Konfigurasikan username dan proses pembayaran.</p>
              </div>

              {isStoreClosed && (
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs space-y-1">
                  <p className="font-bold text-rose-450 flex items-center gap-1.5">
                    ⚠️ Toko Sedang Tutup / Re-Stocking
                  </p>
                  <p className="text-slate-400 text-[11px] leading-snug">
                    Admin toko saat ini sedang melakukan restok produk, penataan joran fisch, pengisian item secret, atau penataan koin. Silakan coba sesaat lagi setelah ketersediaan di-supply.
                  </p>
                </div>
              )}

              {selectedProduct ? (
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center text-lg">
                    {getDeliveryIcon(selectedProduct.deliveryType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">{selectedProduct.category}</p>
                    <h4 className="font-bold text-white text-xs truncate">{selectedProduct.name}</h4>
                    <p className="text-slate-400 text-[10px] mt-0.5">Metode: <span className="font-mono text-indigo-300">{selectedProduct.deliveryType}</span></p>
                  </div>
                </div>
              ) : (
                <div className="bg-indigo-500/5 p-4 rounded-xl border border-indigo-500/20 text-center text-slate-400 text-xs">
                  Silakan pilih produk dari katalog terlebih dahulu.
                </div>
              )}

              {/* Username Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Username Roblox Pembeli *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={robloxUsername}
                    onChange={(e) => setRobloxUsername(e.target.value)}
                    placeholder="Masukkan username Roblox asli"
                    className="w-full bg-slate-950 text-slate-200 text-xs pl-3.5 pr-4 py-2.5 rounded-xl border border-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/20"
                  />
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  🚨 <span className="font-bold">Keamanan Terjamin:</span> Kami tidak pernah meminta password Roblox. Bot hanya memerlukan Username untuk perdagangan in-game atau pembelian Gamepass.
                </p>
              </div>

              {/* Dynamic Sub-items parameters (if Robux we need gamepass ID or group fund instruction) */}
              {selectedProduct?.category === 'Robux' && selectedProduct.deliveryType === 'Instant Gamepass' && (
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    Gamepass Asset ID Roblox
                  </label>
                  <input
                    type="text"
                    required
                    value={gamepassId}
                    onChange={(e) => setGamepassId(e.target.value)}
                    placeholder="Contoh: 294829381"
                    className="w-full bg-slate-900 text-slate-200 font-mono text-xs px-3 py-2 rounded-lg border border-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                  <p className="text-[9px] text-slate-500">
                    Buat Gamepass seharga Robux pembelian di Roblox Dashboard Anda, lalu salin angka ID aset tersebut di atas.
                  </p>
                </div>
              )}

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Pilih Saluran Pembayaran
                </label>
                <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1 no-scrollbar">
                  {PAYMENT_METHODS.map(pay => {
                    const activeSelector = selectedPaymentId === pay.id;
                    const fee = isPremium ? 0 : pay.adminFee;
                    return (
                      <div
                        key={pay.id}
                        onClick={() => setSelectedPaymentId(pay.id)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                          activeSelector 
                            ? 'bg-slate-950 border-emerald-500/70 text-white' 
                            : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-950 hover:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-md">{pay.logo}</span>
                          <div className="text-left">
                            <p className="text-xs font-semibold">{pay.name}</p>
                            <span className="text-[9px] text-slate-500 uppercase">{pay.type}</span>
                          </div>
                        </div>
                        <span className="font-mono text-xs text-slate-300">
                          {fee === 0 ? 'Rp 0 admin' : `+Rp ${fee}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Receipt Summary Pricing */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Harga Item ({selectedProduct?.name ? '1x' : '0x'})</span>
                  <span className="font-mono">Rp {itemPrice.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Biaya Administrasi ({selectedPayment.name.split(' (')[0]})</span>
                  <span className="font-mono">
                    {isPremium ? (
                      <span className="text-emerald-400 font-semibold">Rp 0 (VIP Waived)</span>
                    ) : (
                      `Rp ${calculatedAdminFee.toLocaleString('id-ID')}`
                    )}
                  </span>
                </div>
                
                {/* VIP Bonus Info */}
                {isPremium && (
                  <div className="px-2 py-1.5 bg-emerald-500/10 rounded border border-emerald-500/20 text-[10px] text-emerald-400 flex items-center justify-between flex-wrap gap-1">
                    <span>Loyalty Cashback Poin 5%</span>
                    <span>+{Math.round(itemPrice * 0.05)} Poin</span>
                  </div>
                )}

                <div className="flex justify-between text-white font-bold border-t border-slate-800/80 pt-2 text-sm">
                  <span>Total Tagihan</span>
                  <span className="font-mono text-emerald-400">Rp {totalCost.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                type="submit"
                disabled={!selectedProduct || isStoreClosed}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-indigo-500 text-white hover:opacity-90 disabled:opacity-45 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-indigo-500/10"
              >
                {isStoreClosed ? 'Toko Tutup (Sedang Re-Stock)' : 'Bayar & Hubungkan ke Delivery Bot'}
              </button>
            </form>
          ) : (
            // STAGE B: ACTIVE TRANSACTION SIMULATOR (QRIS / AUTO ACTION BOT PROCESSED)
            <div className="space-y-6">
              
              {/* Process Top Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-bold">
                    {currentCheckoutOrder.id}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1">Status Delivery Simulator</h3>
                </div>
                <button
                  onClick={startNewTransaction}
                  className="p-1 px-2.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold transition"
                >
                  Transaksi Baru
                </button>
              </div>

              {/* Active status indicator */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Total Tagihan:</span>
                  <span className="text-emerald-400 font-bold font-mono text-sm">
                    Rp {currentCheckoutOrder.totalAmount.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Status Pembayaran:</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold font-mono ${
                    currentCheckoutOrder.status === 'PENDING_PAYMENT' 
                      ? 'bg-amber-400/20 text-amber-400 border border-amber-400/30 animate-pulse'
                      : 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/30'
                  }`}>
                    {currentCheckoutOrder.status === 'PENDING_PAYMENT' ? 'Menunggu Pembayaran' : 'Terverifikasi (Lunas)'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Queue Alokasi Bot:</span>
                  <span className="text-white font-semibold font-mono">
                    {isPremium ? (
                      <span className="text-indigo-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" /> VIP Queue #1
                      </span>
                    ) : (
                      `Standard Queue #${currentCheckoutOrder.botQueuePosition}`
                    )}
                  </span>
                </div>
              </div>

              {/* Conditionally Show QRIS Code Scanning Screen */}
              {currentCheckoutOrder.status === 'PENDING_PAYMENT' && (
                <div className="p-4 border border-slate-800 bg-slate-950/60 rounded-2xl text-center space-y-4">
                  <div className="inline-block p-4 bg-white rounded-xl">
                    {/* Simulated QR Code representation */}
                    <div className="w-36 h-36 relative flex items-center justify-center border-4 border-slate-200">
                      <QrCode className="w-32 h-32 text-slate-950" />
                      {/* Red crosshair inside the camera center */}
                      <div className="absolute inset-0 border border-red-500/45 m-6 pointer-events-none" />
                    </div>
                  </div>

                  <p className="text-slate-300 font-medium text-xs leading-tight">
                    Pembayaran QRIS Terintegrasi Otomatis
                  </p>
                  
                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 bg-slate-900 py-1.5 px-3 rounded-lg w-fit mx-auto">
                    <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <span>Scan tersisa: <strong className="font-mono text-amber-400">{Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}</strong></span>
                  </div>

                  {/* Simulate sandbox trigger */}
                  <div className="border-t border-slate-900 pt-4 space-y-2">
                    <p className="text-[10px] text-indigo-300 font-mono">🔧 SANBOX SIMULATOR WEBHOOK:</p>
                    <button
                      type="button"
                      onClick={triggerPaymentReceived}
                      className="w-full py-2 px-3 rounded-lg bg-emerald-500 text-slate-950 text-xs font-bold uppercase transition hover:brightness-110 flex items-center justify-center gap-1.5"
                    >
                      <Smartphone className="w-4 h-4" /> Simulasikan Pembayaran Berhasil
                    </button>
                    <p className="text-[9px] text-slate-500">
                      Klik tombol di atas untuk mengirim mock webhook dari Midtrans/Xendit ke Growee Store Server.
                    </p>
                  </div>
                </div>
              )}

              {/* LIVE ROBOT DELIVERING CONSOLE (The actual high-tech delivery bot updates in real-time) */}
              {(currentCheckoutOrder.status !== 'PENDING_PAYMENT') && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                      <Bot className="w-4 h-4 text-indigo-400 text-bold animate-pulse" />
                      Live Log Terminal Bot Delivery
                    </label>
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  </div>

                  {/* Terminal Style view */}
                  <div className="bg-black/90 p-3.5 rounded-xl border border-slate-800 font-mono text-[10px] leading-relaxed space-y-2 min-h-[180px] max-h-[220px] overflow-y-auto no-scrollbar scroll-smooth">
                    {currentCheckoutOrder.logs.map((log, index) => {
                      let color = 'text-green-400';
                      if (log.type === 'error') color = 'text-rose-400';
                      if (log.type === 'warning') color = 'text-amber-400';
                      if (log.type === 'info') color = 'text-slate-400';
                      if (log.type === 'bot') color = 'text-indigo-400';

                      return (
                        <div key={index} className={`flex items-start gap-1 text-xs ${color}`}>
                          <span className="text-slate-600 select-none shrink-0">[{log.timestamp}]</span>
                          <span className="whitespace-pre-wrap">{log.message}</span>
                        </div>
                      );
                    })}

                    {logSimulationIndex >= 0 && logSimulationIndex < simulationLogs.length && (
                      <div className="text-indigo-400/80 animate-pulse text-xs">
                        &gt; Bot sedang memproses langkah berikutnya...
                      </div>
                    )}
                  </div>

                  {/* Dynamic Help Widget */}
                  {currentCheckoutOrder.status === 'COMPLETED' ? (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-2 text-xs">
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div className="space-y-1">
                        <p className="font-bold text-emerald-300">Pengiriman Sukses!</p>
                        <p className="text-slate-400 text-[11px] leading-snug">
                          Item/Robux telah sukses ditaruh ke akun <strong className="text-white">"{currentCheckoutOrder.robloxUsername}"</strong>. Nikmati petualangan game Anda!
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-start gap-2 text-[10px] text-slate-400">
                      <HelpCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                      <p className="leading-snug">
                        Pengiriman menggunakan Server Bot Otomatis Growee Store. Mohon tidak mengganti Username Roblox Anda selama status pengiriman aktif.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Transaction History Logs */}
        {activeOrders.length > 0 && (
          <div className="mt-6 bg-slate-900/40 border border-slate-800 rounded-2xl p-4 space-y-3.5">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Histori Transaksi Sesi Ini</h4>
            
            <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1 no-scrollbar">
              {activeOrders.slice().reverse().map((ord, idx) => (
                <div 
                  key={ord.id + '-' + idx} 
                  className="p-2.5 bg-slate-950/70 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-white truncate text-xs">{ord.product.name}</p>
                    <p className="text-slate-500 text-[10px]">Username: <span className="text-slate-300">{ord.robloxUsername}</span> | {ord.createdAt}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-mono font-bold text-white text-xs">Rp {ord.totalAmount.toLocaleString('id-ID')}</p>
                    <span className={`inline-block text-[9px] px-1.5 py-0.5 rounded font-bold font-mono mt-0.5 ${
                      ord.status === 'COMPLETED' 
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' 
                        : ord.status === 'FAILED'
                        ? 'bg-rose-500/10 text-rose-300'
                        : 'bg-indigo-500/10 text-indigo-300 animate-pulse'
                    }`}>
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
