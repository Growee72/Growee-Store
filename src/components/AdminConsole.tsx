import React, { useState } from 'react';
import { 
  Database, Plus, Settings, Info, ShoppingBag, 
  Check, Shield, Sparkles, Sliders, ToggleLeft, ToggleRight, ArrowUpRight, Cpu, HelpCircle, XOctagon
} from 'lucide-react';
import { GameProduct, ItemCategory, UserAccount } from '../types';

interface AdminConsoleProps {
  products: GameProduct[];
  isStoreClosed: boolean;
  onToggleStoreStatus: () => void;
  onAddProduct: (product: GameProduct) => void;
  onUpdateStockAndPrice: (productId: string, addStock: number, newPrice?: number) => void;
  currentUser: UserAccount | null;
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({
  products,
  isStoreClosed,
  onToggleStoreStatus,
  onAddProduct,
  onUpdateStockAndPrice,
  currentUser,
}) => {
  // Add product form states
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<ItemCategory>('Fisch');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductPrice, setNewProductPrice] = useState(25000);
  const [newProductStock, setNewProductStock] = useState(100);
  const [newProductDelivery, setNewProductDelivery] = useState<'Automatic Bot' | 'Instant Gamepass' | 'Secure Trading Server' | 'Group Funds'>('Secure Trading Server');
  const [newProductBadge, setNewProductBadge] = useState('Secret');
  const [newProductVipDiscount, setNewProductVipDiscount] = useState(8);

  // Supply stock form states
  const [selectedProductId, setSelectedProductId] = useState('');
  const [amountToSupply, setAmountToSupply] = useState(50);
  const [newPriceInput, setNewPriceInput] = useState('');

  // UI state feedback
  const [showToast, setShowToast] = useState(false);
  const [toastText, setToastText] = useState('');

  const triggerToast = (text: string) => {
    setToastText(text);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim() || !newProductDesc.trim()) {
      alert('Nama dan deskripsi produk wajib diisi.');
      return;
    }

    const randomId = `${newProductCategory.toLowerCase().replace(/\s+/g, '-')}-${Math.floor(100 + Math.random() * 900)}`;
    const imageGradients = ['nebula-gradient', 'gold-shimmer-gradient', 'deep-blue-gradient', 'purple-gold-gradient', 'emerald-gradient'];
    const chosenGradient = imageGradients[Math.floor(Math.random() * imageGradients.length)];

    const createdProduct: GameProduct = {
      id: randomId,
      category: newProductCategory,
      name: newProductName,
      description: newProductDesc,
      price: Number(newProductPrice),
      originalPrice: Math.round(Number(newProductPrice) * 1.3),
      stock: Number(newProductStock),
      deliveryType: newProductDelivery,
      imagePlaceholder: chosenGradient,
      badge: newProductBadge || undefined,
      vipPriceDiscount: Number(newProductVipDiscount),
      status: 'Pending', // Force default pending approval status as requested
      addedBy: currentUser ? currentUser.username : 'Admin Rian', // Attach the applicant's name
    };

    onAddProduct(createdProduct);
    triggerToast(`Pengajuan suplai item "${newProductName}" sukses masuk antrean pending!`);

    // Reset Form
    setNewProductName('');
    setNewProductDesc('');
    setNewProductPrice(29000);
    setNewProductStock(50);
  };

  const handleUpdateStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) {
      alert('Pilih produk yang ingin disuplai.');
      return;
    }

    const prod = products.find(p => p.id === selectedProductId);
    if (!prod) return;

    const newPriceVal = newPriceInput.trim() ? Number(newPriceInput) : undefined;
    onUpdateStockAndPrice(selectedProductId, Number(amountToSupply), newPriceVal);

    triggerToast(`Sukses menambah suplai sebanyak +${amountToSupply} unit untuk "${prod.name}"!`);
    setNewPriceInput('');
  };

  const handleQuickPreset = (presetType: 'secret-fish' | 'skin-rod' | 'top-up') => {
    if (presetType === 'secret-fish') {
      setNewProductName('Ikan Secret: Celestial Leviathan');
      setNewProductCategory('Fisch');
      setNewProductDesc('Predator purba samudra bertanduk kristal. Memiliki modifier mistis yang memberikan kelipatan koin in-game 5x lipat!');
      setNewProductPrice(89000);
      setNewProductStock(15);
      setNewProductDelivery('Secure Trading Server');
      setNewProductBadge('Secret Mythic');
      setNewProductVipDiscount(15);
    } else if (presetType === 'skin-rod') {
      setNewProductName('Rod Skin: Holographic Dragon Scales');
      setNewProductCategory('Fisch');
      setNewProductDesc('Skin joran legendaris dengan tekstur sisik naga hologram yang berganti warna setiap kali pancing dilempar.');
      setNewProductPrice(38000);
      setNewProductStock(75);
      setNewProductDelivery('Automatic Bot');
      setNewProductBadge('Rare Skin');
      setNewProductVipDiscount(8);
    } else if (presetType === 'top-up') {
      setNewProductName('Top Up: 100,000 Coins Fisch Game + 10x Bait Premium');
      setNewProductCategory('Fisch');
      setNewProductDesc('Paket kaya koin emas instan ditambah bundle umpan laut dalam premium untuk keperluan gacha instan.');
      setNewProductPrice(99000);
      setNewProductStock(300);
      setNewProductDelivery('Automatic Bot');
      setNewProductBadge('Top-Up Best');
      setNewProductVipDiscount(10);
    }
    triggerToast('Preset data berhasil di-load! Silakan klik "Kirim Pengajuan Suplai"');
  };

  // Stats Counters
  const adminName = currentUser ? currentUser.username : 'Admin Rian';
  const myProposedProducts = products.filter(p => p.addedBy === adminName);
  
  const lowStockProducts = products.filter(p => p.stock <= 10 && (p.status === 'Active' || p.addedBy === adminName));
  const totalStock = products.reduce((acc, curr) => acc + curr.stock, 0);

  return (
    <div className="space-y-8 relative text-left">
      {/* Dynamic Toast Portal */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/80 text-emerald-300 font-medium px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastText}</span>
        </div>
      )}

      {/* ADMIN INTRO HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/40 p-6 rounded-3xl border border-slate-800">
        <div className="space-y-1.5 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-semibold border border-sky-500/20 uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 text-sky-400" />
            ADMIN / SELLER PANEL – {adminName.toUpperCase()}
          </div>
          <h2 className="text-2xl font-extrabold text-white leading-tight font-sans m-0 text-left">
            Konsol Pengadaan & Suplai Toko Growee
          </h2>
          <p className="text-slate-400 text-xs select-none">
            Gunakan dashboard ini untuk merancang suplai, menyunting persediaan stok, memuat presets barang pancingan Fisch & Robux, serta mengontrol status toko.
          </p>
        </div>

        {/* Master Buka / Tutup Toko Switch */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-6 min-w-[240px]">
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Status Buka Toko (Live)</p>
            <p className={`text-xs font-bold ${isStoreClosed ? 'text-rose-400 font-semibold' : 'text-emerald-400 font-semibold'}`}>
              ● {isStoreClosed ? 'Toko Tutup (Re-Stocking)' : 'Toko Buka (Menerima Order)'}
            </p>
          </div>

          <button
            onClick={() => {
              onToggleStoreStatus();
              triggerToast(isStoreClosed ? 'Toko berhasil DIBUKA kembali! Pembeli sudah bisa bertransaksi.' : 'Toko berhasil DITUTUP sementara untuk restok!');
            }}
            className={`p-2 px-3 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 ${
              isStoreClosed 
                ? 'bg-emerald-400 text-slate-950 hover:bg-emerald-500' 
                : 'bg-rose-500 text-white hover:bg-rose-600'
            }`}
          >
            {isStoreClosed ? (
              <>
                <ToggleRight className="w-4 h-4" /> Buka Toko
              </>
            ) : (
              <>
                <ToggleLeft className="w-4 h-4" /> Tutup Toko
              </>
            )}
          </button>
        </div>
      </div>

      {/* QUICK STATUS METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Katalog Saya</p>
            <h4 className="text-xl font-extrabold text-white font-mono">{myProposedProducts.length} Varian</h4>
            <p className="text-[10px] text-slate-500">Ikan Secret, Skin & Items</p>
          </div>
          <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Total Keseluruhan Stok</p>
            <h4 className="text-xl font-extrabold text-white font-mono">{totalStock.toLocaleString('id-ID')} Unit</h4>
            <p className="text-[10px] text-emerald-400 font-bold font-mono">Robot Stock Ready</p>
          </div>
          <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Persetujuan Pending</p>
            <h4 className="text-xl font-extrabold text-amber-400 font-mono">
              {myProposedProducts.filter(p => p.status === 'Pending').length} Varian
            </h4>
            <p className="text-[10px] text-slate-500">Butuh approval Developer</p>
          </div>
          <div className="w-10 h-10 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center font-bold font-sans">
            ⏳
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Sync API Server Roblox</p>
            <h4 className="text-xl font-extrabold text-emerald-400 font-mono">TERHUBUNG</h4>
            <p className="text-[10px] text-slate-500">Bot Autopilot Ready</p>
          </div>
          <div className="w-10 h-10 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center font-bold">
            ✓
          </div>
        </div>
      </div>

      {/* WARNING NOTIFICATION AREA */}
      <div className="p-4 bg-sky-950/15 border border-sky-500/20 text-xs text-sky-300 rounded-2xl flex items-start gap-3">
        <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-slate-200">ℹ️ Kebijakan Penayangan Etalase Toko</p>
          <p className="leading-relaxed text-slate-400 text-[11px]">
            Sesuai aturan operasional, setiap item baru yang Anda pasang lewat formulir <strong>"Buka & Pasang Produk Baru"</strong> akan berada dalam status <strong>"Pending Approval"</strong> dan tidak akan langsung tayang di marketplace pembeli. Supervisor/Developer Utama harus mengklik <strong>"Approve"</strong> di Dashboard Developer terlebih dahulu murni agar ketersediaan produk terjamin secara legal.
          </p>
        </div>
      </div>

      {/* DUAL WORKSPACE FOR ADMIN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: SUPPLY INVENTORY & PRESETS (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Restock & Price Adjust Form */}
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl space-y-4">
            <div className="border-b border-slate-800/80 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-sky-400" />
                Suplai Stok Item Katalog (Restock Engine)
              </h3>
              <p className="text-slate-500 text-xs mt-0.5">Pilih salah satu item yang telah disetujui, tentukan besaran kuantitas suplai tambahan yang dikirim oleh robot pancing, dan simpan.</p>
            </div>

            <form onSubmit={handleUpdateStock} className="space-y-4 font-sans">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">Pilih Item Game untuk Di-Supply</label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => {
                      setSelectedProductId(e.target.value);
                      const p = products.find(prod => prod.id === e.target.value);
                      if (p) {
                        setNewPriceInput(String(p.price));
                      }
                    }}
                    className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 focus:border-sky-500 focus:outline-none text-xs"
                  >
                    <option value="">-- Pilih produk yang ingin di-restok --</option>
                    {products.filter(p => p.status === 'Active' || p.addedBy === adminName).map(p => (
                      <option key={p.id} value={p.id}>
                        [{p.category}] {p.name} (Stok saat ini: {p.stock})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 block">Jumlah Pasokan Tambahan (+)</label>
                    <div className="flex bg-slate-950 p-2 rounded-xl border border-slate-800 items-center">
                      <input
                        type="number"
                        min="1"
                        value={amountToSupply}
                        onChange={(e) => setAmountToSupply(Math.max(1, parseInt(e.target.value) || 0))}
                        className="w-full bg-transparent p-1 text-white font-mono font-bold focus:outline-none text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 block">Ubah Harga Eceran Baru (Rp) [Opsional]</label>
                    <div className="flex bg-slate-950 p-2 rounded-xl border border-slate-800 items-center">
                      <span className="text-slate-600 text-xs font-mono px-1">Rp</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="Biarkan kosong jika tetap"
                        value={newPriceInput}
                        onChange={(e) => setNewPriceInput(e.target.value)}
                        className="w-full bg-transparent p-1 text-white font-mono focus:outline-none text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-slate-950 bg-sky-400 hover:bg-sky-500 font-extrabold text-xs uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" /> Lakukan Suplai Produk
                </button>
              </div>
            </form>
          </div>

          {/* QUICK PRESETS LOADER */}
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl space-y-4">
            <div className="border-b border-slate-800/80 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-400" />
                Quick Presets: Fisch & Robux Luxury Items
              </h3>
              <p className="text-slate-500 text-xs">Klik salah satu tombol asisten untuk merancang template pengajuan barang bernilai tinggi secara otomatis ke input form kanan.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleQuickPreset('secret-fish')}
                className="p-3.5 bg-slate-950 hover:bg-slate-900/80 rounded-2xl border border-indigo-500/20 text-left space-y-1.5 transition-all text-xs"
              >
                <div className="text-xs font-bold text-white flex items-center justify-between">
                  <span>🐋 Ikan Secret Mitis</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <p className="text-[10px] text-slate-400 leading-snug">Celestial Leviathan dengan kelipatan koin x5.</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickPreset('skin-rod')}
                className="p-3.5 bg-slate-950 hover:bg-slate-900/80 rounded-2xl border border-indigo-500/20 text-left space-y-1.5 transition-all text-xs"
              >
                <div className="text-xs font-bold text-white flex items-center justify-between">
                  <span>🪄 Skin Rod Legend</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <p className="text-[10px] text-slate-400 leading-snug">Holographic Dragon Scales kustomisasi pancing.</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickPreset('top-up')}
                className="p-3.5 bg-slate-950 hover:bg-slate-900/80 rounded-2xl border border-indigo-500/20 text-left space-y-1.5 transition-all text-xs"
              >
                <div className="text-xs font-bold text-white flex items-center justify-between">
                  <span>🪙 Coins & Baits pack</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <p className="text-[10px] text-slate-400 leading-snug">Top up 100K Coins game Fisch + 10x Bait Premium.</p>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: FORM SUPPLIER (5 Columns) */}
        <div className="lg:col-span-5">
          <div className="bg-slate-900/60 rounded-3xl p-6 border border-slate-800 backdrop-blur-md space-y-5 text-left font-sans">
            
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-sky-400" />
                Form Suplai Item Baru (Kirim Pengajuan)
              </h3>
              <p className="text-slate-500 text-[11px] mt-0.5">Isi detail di bawah untuk mengajukan item game baru ke sistem. Status default pendirian awal akan bernilai 'Pending'.</p>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-300 uppercase block font-mono">Nama Produk atau Gamepass</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Secret Fish: Kraken Claw"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full bg-slate-950 text-white p-2.5 rounded-xl border border-slate-850 focus:border-sky-500 focus:outline-none text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-300 uppercase block font-mono">Kategori game</label>
                  <select
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value as ItemCategory)}
                    className="w-full bg-slate-950 text-white p-2.5 rounded-xl border border-slate-850 focus:border-sky-500 focus:outline-none text-xs"
                  >
                    <option value="Fisch">Fisch (Pancingan)</option>
                    <option value="Robux">Robux</option>
                    <option value="Blox Fruits">Blox Fruits</option>
                    <option value="Pet Simulator X">Pet Simulator X</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-300 uppercase block font-mono">Metode Pengiriman</label>
                  <select
                    value={newProductDelivery}
                    onChange={(e) => setNewProductDelivery(e.target.value as any)}
                    className="w-full bg-slate-950 text-white p-2.5 rounded-xl border border-slate-850 focus:border-sky-500 focus:outline-none text-xs"
                  >
                    <option value="Secure Trading Server">Secure Trading (Bagi Fisch)</option>
                    <option value="Automatic Bot">Automatic Bot Mailbox</option>
                    <option value="Instant Gamepass">Instant Gamepass Link</option>
                    <option value="Group Funds">Group Funds Transfer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-300 uppercase block font-mono">Harga Eceran (Rp)</label>
                  <input
                    type="number"
                    required
                    min="1000"
                    placeholder="25000"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 text-white p-2.5 rounded-xl border border-slate-850 focus:outline-none text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-300 uppercase block font-mono">Stok Awal Suplai</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="100"
                    value={newProductStock}
                    onChange={(e) => setNewProductStock(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 text-white p-2.5 rounded-xl border border-slate-850 focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-300 uppercase block font-mono">Lencana Badge</label>
                  <input
                    type="text"
                    placeholder="Rare / Terlaris"
                    value={newProductBadge}
                    onChange={(e) => setNewProductBadge(e.target.value)}
                    className="w-full bg-slate-950 text-white p-2.5 rounded-xl border border-slate-850 focus:outline-none text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-300 uppercase block font-mono">Diskon VIP (%)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="99"
                    value={newProductVipDiscount}
                    onChange={(e) => setNewProductVipDiscount(Math.min(99, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-full bg-slate-950 text-white p-2.5 rounded-xl border border-slate-850 focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-300 uppercase block font-mono">Deskripsi Spesifikasi Produk</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ceritakan status detail produk, rincian kelebihan di in-game..."
                  value={newProductDesc}
                  onChange={(e) => setNewProductDesc(e.target.value)}
                  className="w-full bg-slate-950 text-white p-2.5 rounded-xl border border-slate-850 focus:border-sky-500 focus:outline-none text-xs leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-sky-400 to-indigo-500 text-slate-950 hover:brightness-105 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-slate-950" /> Kirim Pengajuan Suplai (Pending)
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* TRACKING SYSTEM TABLE (STATUS PENGAJUAN ADMIN) */}
      <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl space-y-4">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-sky-400" />
              Status Tracking Pengajuan Supply Saya (Daftar Riwayat)
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">Daftar item game yang Anda ajukan beserta status verifikasi real-time dari Developer Utama.</p>
          </div>
          <span className="bg-slate-950 border border-slate-855 text-slate-400 font-mono text-[10px] px-2 py-0.5 rounded">
            Total Log: {myProposedProducts.length} Item
          </span>
        </div>

        {myProposedProducts.length === 0 ? (
          <div className="py-8 bg-slate-950 rounded-2xl border border-slate-850 text-center text-xs text-slate-500 font-sans space-y-1">
            <p>Anda belum pernah mensubmit pengajuan produk pancingan Fisch atau Robux baru.</p>
            <p className="text-[10px] text-slate-600">Gunakan formulir "Kirim Pengajuan Suplai" di sebelah kanan untuk memulai.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-900 bg-slate-950">
            <table className="w-full text-xs text-left border-collapse font-sans">
              <thead>
                <tr className="bg-slate-900 text-slate-400 font-bold border-b border-slate-850 text-[10px]">
                  <th className="p-3">Nama Produk / Kategori</th>
                  <th className="p-3">Stok Unit</th>
                  <th className="p-3">Harga IDR</th>
                  <th className="p-3">Status Verifikasi</th>
                  <th className="p-3">Detail Verifikator & Catatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/50 font-mono">
                {myProposedProducts.map(p => {
                  let statusBadge = '';
                  if (p.status === 'Active') {
                    statusBadge = 'bg-emerald-400/10 text-emerald-300 border-emerald-500/20';
                  } else if (p.status === 'Rejected') {
                    statusBadge = 'bg-rose-500/10 text-rose-300 border-rose-500/30';
                  } else {
                    statusBadge = 'bg-amber-400/10 text-amber-300 border-amber-500/20 animate-pulse';
                  }

                  return (
                    <tr key={p.id} className="hover:bg-slate-900/40">
                      <td className="p-3 font-sans">
                        <div className="font-bold text-white text-[11px]">{p.name}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Kat: {p.category} | Delivery: {p.deliveryType}</div>
                      </td>
                      <td className="p-3 text-slate-300">{p.stock.toLocaleString('id-ID')} unit</td>
                      <td className="p-3 text-emerald-400 font-bold">Rp {p.price.toLocaleString('id-ID')}</td>
                      <td className="p-3 font-sans">
                        <span className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider ${statusBadge}`}>
                          {p.status || 'Pending'}
                        </span>
                      </td>
                      <td className="p-3 font-sans text-[11px]">
                        {p.status === 'Active' && (
                          <span className="text-emerald-400">✓ Berhasil Ditayangkan di Marketplace Pembeli</span>
                        )}
                        {p.status === 'Rejected' && (
                          <div className="text-rose-300">
                            <p className="font-bold">❌ Ditolak Developer</p>
                            <p className="text-[10px] text-slate-400 leading-snug font-mono mt-0.5">Alasan: {p.rejectionReason || 'Spesifikasi produk kurang lengkap.'}</p>
                          </div>
                        )}
                        {(!p.status || p.status === 'Pending') && (
                          <span className="text-slate-500 italic">Menunggu audit tim Super Admin...</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
