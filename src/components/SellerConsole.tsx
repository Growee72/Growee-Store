import React, { useState } from 'react';
import { 
  TrendingUp, Wallet, Bot, ListFilter, Cpu, ToggleLeft, 
  ToggleRight, RefreshCw, AlertCircle, Save, Settings, CreditCard, Activity 
} from 'lucide-react';
import { SubscriptionState, SellerDashboardStats } from '../types';

interface SellerConsoleProps {
  subscription: SubscriptionState;
}

export const SellerConsole: React.FC<SellerConsoleProps> = ({ subscription }) => {
  const [stats, setStats] = useState<SellerDashboardStats>({
    storeName: "Growee Gaming Shop",
    totalRevenue: 4890000,
    walletBalance: 1450000,
    ordersCount: 452,
    activeBots: 3,
    botStatus: 'ONLINE',
    inventorySize: 845,
    monthlySaaSFee: 99000,
  });

  // Simulator States
  const [robuxRate, setRobuxRate] = useState(115); // in Rp per Robux (x1000)
  const [isUpdatingRate, setIsUpdatingRate] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Simulated list of automated bots running on Roblox servers
  const [botsList, setBotsList] = useState([
    { id: 'fisch-bot-1', name: 'Bot-Fisch-Alpha', type: 'Roblox Trading Bot', game: 'Fisch', status: 'ONLINE', load: '12%', privateServer: 'VIP-Moosewood-04' },
    { id: 'robux-bot-1', name: 'Bot-Robux-Beta', type: 'API Gamepass Purchaser', game: 'Robux Store', status: 'ONLINE', load: '45%', privateServer: 'N/A (Group API)' },
    { id: 'blox-bot-1', name: 'Bot-Blox-Omega', type: 'In-Game Gift Trading', game: 'Blox Fruits', status: 'MAINTENANCE', load: '0%', privateServer: 'VIP-Cafe-Sea2' }
  ]);

  const [withdrawAmount, setWithdrawAmount] = useState('500000');
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const handleUpdateRobuxRate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingRate(true);
    setTimeout(() => {
      setIsUpdatingRate(false);
      showToast(`Kurs Robux berhasil diperbarui menjadi Rp ${(robuxRate * 1000).toLocaleString('id-ID')} / 1,000 Robux!`);
    }, 1200);
  };

  const toggleBotStatus = (botId: string) => {
    const updated = botsList.map(bot => {
      if (bot.id === botId) {
        const nextStatus = bot.status === 'ONLINE' ? 'OFFLINE' : bot.status === 'OFFLINE' ? 'MAINTENANCE' : 'ONLINE';
        return { ...bot, status: nextStatus, load: nextStatus === 'ONLINE' ? '15%' : '0%' };
      }
      return bot;
    });
    setBotsList(updated);
    
    // Recount active bots
    const activeCount = updated.filter(b => b.status === 'ONLINE').length;
    setStats(prev => ({
      ...prev,
      activeBots: activeCount,
      botStatus: activeCount === 0 ? 'OFFLINE' : activeCount < updated.length ? 'MAINTENANCE' : 'ONLINE'
    }));

    showToast(`Status bot berhasil diubah!`);
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Pencairan saldo tidak valid');
      return;
    }
    if (amount > stats.walletBalance) {
      alert('Saldo dompet merchant Anda tidak mencukupi');
      return;
    }

    setIsWithdrawing(true);
    setTimeout(() => {
      setStats(prev => ({
        ...prev,
        walletBalance: prev.walletBalance - amount
      }));
      setIsWithdrawing(false);
      showToast(`Sukses mencairkan dana Rp ${amount.toLocaleString('id-ID')} ke akun Bank/GoPay terdaftar!`);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Toast Alert message */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-indigo-500/80 text-indigo-300 font-medium px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* DASHBOARD STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Omset */}
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Total Hasil Penjualan</p>
            <h4 className="text-xl font-extrabold text-white font-mono">Rp {stats.totalRevenue.toLocaleString('id-ID')}</h4>
            <p className="text-[10px] text-emerald-400 font-mono">↗ 12.4% bulan ini</p>
          </div>
          <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Wallet Withdraw */}
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Saldo Siap Tarik (Wallet)</p>
            <h4 className="text-xl font-extrabold text-indigo-300 font-mono">Rp {stats.walletBalance.toLocaleString('id-ID')}</h4>
            <p className="text-[10px] text-slate-400">Merchant payout instan</p>
          </div>
          <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        {/* Active Bots */}
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Bot Roblox Beroperasi</p>
            <h4 className="text-xl font-extrabold text-white font-mono">{stats.activeBots} / 3 Aktif</h4>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`w-2 h-2 rounded-full ${stats.botStatus === 'ONLINE' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <p className="text-[9px] text-slate-400 uppercase font-mono font-bold">{stats.botStatus}</p>
            </div>
          </div>
          <div className="w-10 h-10 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
        </div>

        {/* Orders Processed */}
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Transaksi Otomatis Bot</p>
            <h4 className="text-xl font-extrabold text-white font-mono">{stats.ordersCount} Sukses</h4>
            <p className="text-[10px] text-indigo-400">SaaS Auto-Trading Online</p>
          </div>
          <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* DUAL COLUMN BOTTOM PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: MERCHANT AUTOMATION METRIC CONTROLS (7 columns) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Robux Price Management Form */}
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl space-y-4">
            <div className="border-b border-slate-800/80 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-indigo-400" />
                Manajemen Toko & Sistem Kurs Robux
              </h3>
              <p className="text-slate-500 text-xs mt-0.5">Atur harga eceran barang Roblox/Fisch Anda agar bot menghitung harga katalog secara real-time.</p>
            </div>

            <form onSubmit={handleUpdateRobuxRate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">Metode Konversi Robux (per 1K)</label>
                  <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-500 font-mono">Rp</span>
                    <input
                      type="number"
                      value={robuxRate * 1000}
                      onChange={(e) => setRobuxRate(Math.max(1, Math.round(parseInt(e.target.value) / 1000 || 0)))}
                      className="w-full bg-transparent text-white font-mono font-bold focus:outline-none text-xs"
                      placeholder="115000"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">Stok Pool Robux Admin (Roblox Group)</label>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="font-mono text-xs text-indigo-300 font-bold">124,500 Robux Pool</span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-bold font-mono">CUKUP</span>
                  </div>
                </div>
              </div>

              {/* Slider simulation */}
              <div className="space-y-1.5 bg-slate-950/50 p-3.5 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Regulator Harga Eceran (Slider):</span>
                  <strong className="text-indigo-400 font-mono">Rp {(robuxRate * 1000).toLocaleString('id-ID')} / 1,000 R$</strong>
                </div>
                <input
                  type="range"
                  min="80"
                  max="160"
                  value={robuxRate}
                  onChange={(e) => setRobuxRate(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 bg-slate-800 rounded-lg cursor-pointer h-1.5"
                />
                <div className="flex justify-between text-[9px] text-slate-500">
                  <span>Murah (Rp 80K)</span>
                  <span>Standar Kurs Grosir</span>
                  <span>Mahal (Rp 160K)</span>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdatingRate}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-indigo-500 text-white hover:bg-indigo-600 transition flex items-center gap-2 disabled:opacity-50"
                >
                  {isUpdatingRate ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Memasukkan ke Sistem...
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      Simpan Harga & Update Katalog
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* SENSOR / BOT MANAGEMENT INTERFACE */}
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl space-y-4">
            <div className="border-b border-slate-800/80 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Bot className="w-4 h-4 text-emerald-400" />
                Robot In-Game Autopilot Management (Roblox API)
              </h3>
              <p className="text-slate-500 text-xs mt-0.5">Pantau status aktif bot server Anda. Bot ini otomatis login ke map Roblox (seperti Fisch) untuk melakukan trade barang.</p>
            </div>

            <div className="space-y-3">
              {botsList.map(bot => (
                <div key={bot.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400 font-bold">{bot.name}</span>
                      <span className={`text-[8px] uppercase font-bold font-mono px-1.5 py-0.5 rounded ${
                        bot.status === 'ONLINE'
                          ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                          : bot.status === 'MAINTENANCE'
                          ? 'bg-amber-500/10 text-amber-300'
                          : 'bg-rose-500/10 text-rose-300'
                      }`}>
                        {bot.status}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[10px] mt-1">{bot.type} | Game: <span className="text-slate-300">{bot.game}</span></p>
                    {bot.status === 'ONLINE' && (
                      <p className="text-[10px] text-indigo-400 mt-0.5">Server: <span className="font-mono">{bot.privateServer}</span></p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 justify-between sm:justify-end">
                    <div className="text-left sm:text-right">
                      <p className="text-[10px] text-slate-500">Beban CPU</p>
                      <p className="text-xs font-mono font-bold text-white">{bot.load}</p>
                    </div>
                    
                    <button
                      onClick={() => toggleBotStatus(bot.id)}
                      className="p-1 px-3 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[10px] hover:bg-slate-800 transition"
                    >
                      Ubah Daya Bot
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10 text-[10px] text-slate-400 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <p>
                <strong>Catatan Bot:</strong> Jika Robux-Beta mengalami kegagalan trading, pastikan status API Cookie Roblox in-game Anda tidak terblokir firewall eksternal game Roblox.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: REVENUE WITHDRAWAL & SAAS MERCHANT STATUS (5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Cashout Wallet Form */}
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl space-y-4">
            <div className="border-b border-slate-800/80 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Wallet className="w-4 h-4 text-indigo-400" />
                Pencairan Saldo Toko (Merchant Cashout)
              </h3>
              <p className="text-slate-500 text-xs">Cairkan saldo penjualan item Anda ke Rekening Bank atau E-Wallet pilihan Anda secara otomatis.</p>
            </div>

            <form onSubmit={handleWithdraw} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold block">Masukkan Nominal Pencairan (Rp)</label>
                <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-500 font-mono">Rp</span>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full bg-transparent text-white font-mono font-bold focus:outline-none text-xs"
                    placeholder="500000"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-2">
                <div className="flex justify-between">
                  <span>Nama Bank Penerima:</span>
                  <strong className="text-white">BCA INDONESIA</strong>
                </div>
                <div className="flex justify-between">
                  <span>Nomor Rekening:</span>
                  <strong className="text-white font-mono">824-0012-901</strong>
                </div>
                <div className="flex justify-between">
                  <span>Nama di Rekening:</span>
                  <strong className="text-white uppercase">Song Raebin</strong>
                </div>
              </div>

              <button
                type="submit"
                disabled={isWithdrawing || stats.walletBalance <= 0}
                className="w-full py-3 px-4 rounded-xl text-slate-950 bg-emerald-400 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xs uppercase tracking-wider transition-all"
              >
                {isWithdrawing ? 'Sedang Memproses Penarikan...' : 'Tarik Saldo Sekarang'}
              </button>
            </form>
          </div>

          {/* MERCHANT SAAS SUBSCRIPTION CONTROLLER */}
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl space-y-4">
            <div className="border-b border-slate-800/80 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                SaaS Subscription & Auto-Renewal Billing
              </h3>
              <p className="text-slate-500 text-xs">Informasi penagihan dan status premium merchant SaaS dari platform penagihan Growee Store.</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3.5 text-xs text-slate-400">
              <div className="flex justify-between items-center">
                <span>Status SaaS Plan:</span>
                <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-bold font-mono uppercase text-[10px]">
                  Merchant Premium Active
                </span>
              </div>

              <div className="flex justify-between">
                <span>Paket Langganan:</span>
                <strong className="text-white">Growee Merchant Pro</strong>
              </div>

              <div className="flex justify-between">
                <span>Biaya SaaS Bulanan:</span>
                <strong className="text-indigo-400 font-mono">Rp {stats.monthlySaaSFee.toLocaleString('id-ID')} / bulan</strong>
              </div>

              <div className="flex justify-between">
                <span>Metode Pembayaran Utama:</span>
                <span className="text-emerald-400 font-mono font-bold">GoPay Tokenized-ID (Auto-Debit)</span>
              </div>

              <div className="flex justify-between">
                <span>Tanggal Tagihan Berikutnya:</span>
                <strong className="text-white font-mono">30 Juni 2026</strong>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                <div className="text-left">
                  <p className="text-[11px] font-semibold text-slate-300">Skema Auto-Renewal</p>
                  <span className="text-[9px] text-slate-500 leading-none">Auto billing tanpa ribet</span>
                </div>
                
                {/* Simulated auto-renewal slider */}
                <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded border border-slate-800 text-[10px] text-emerald-400 font-bold">
                  <span>ACTIVE</span>
                </div>
              </div>
            </div>

            {/* Simulated Transaction cron history */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Riwayat Tagihan Berlangganan SaaS</p>
              
              <div className="p-2 border border-slate-800/65 bg-slate-950/70 rounded-lg text-[10px] text-slate-400 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">SaaS Invoice #INV-552</p>
                  <p className="text-slate-500 font-mono">31 Mei 2026, 05:50 | GoPay-Agreement</p>
                </div>
                <span className="font-mono text-emerald-400 font-bold">Rp 99,000 (PAID)</span>
              </div>

              <div className="p-2 border border-slate-800/65 bg-slate-950/70 rounded-lg text-[10px] text-slate-400 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">SaaS Invoice #INV-493</p>
                  <p className="text-slate-500 font-mono">30 April 2026, 06:12 | GoPay-Agreement</p>
                </div>
                <span className="font-mono text-emerald-400 font-bold">Rp 99,000 (PAID)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
