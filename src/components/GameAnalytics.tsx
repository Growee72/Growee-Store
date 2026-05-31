import React, { useState } from 'react';
import { 
  BarChart3, Coins, Users, ShieldAlert, Zap, Gift, Award, 
  Activity, ArrowUpRight, Search, Bell, Heart, ToggleLeft, 
  ToggleRight, RefreshCw, Layers, CheckCircle2, AlertTriangle, 
  Settings, Database, ChevronRight, Globe, TrendingUp, Sparkles, Send
} from 'lucide-react';
import { SubscriptionState } from '../types';

interface GameAnalyticsProps {
  subscription: SubscriptionState;
}

export const GameAnalytics: React.FC<GameAnalyticsProps> = ({ subscription }) => {
  // Mock monetization state that can be mutated interactively
  const [currencySource, setCurrencySource] = useState(1850000); // Coins sourced from Quests/Codes
  const [currencySink, setCurrencySink] = useState(1200000); // Coins sunk in Gacha/Upgrades
  const [activeRegionalFilter, setActiveRegionalFilter] = useState<'All' | 'IDN' | 'PH' | 'GLO'>('All');
  const [timeScale, setTimeScale] = useState<'Daily' | 'Weekly' | 'Monthly'>('Weekly');
  const [isAntiFraudActive, setIsAntiFraudActive] = useState(true);
  
  // Growth simulation state
  const [levelFailCount, setLevelFailCount] = useState(0);
  const [isFlashSaleTriggered, setIsFlashSaleTriggered] = useState(false);
  const [customFlashSaleProduct, setCustomFlashSaleProduct] = useState('Abyssal Rod [Special Combo]');
  
  // Notification logs
  const [analyticsLogs, setAnalyticsLogs] = useState<string[]>([
    "[SYSTEM] Game Analytics engine initialized successfully.",
    "[ANTI-FRAUD] Automated refund monitoring is ON.",
    "[LIVEOPS] Checking daily retention trends: Day-1 is at 42.1%."
  ]);

  // Payment states
  const [paymentGateways, setPaymentGateways] = useState([
    { name: 'Codashop SDK', status: true, key: 'coda_live_83921...x92' },
    { name: 'UniPin Aggregator', status: true, key: 'unipin_prod_52102...j19' },
    { name: 'Xsolla Global', status: false, key: 'xsolla_sandbox_00392...a44' },
    { name: 'Stripe payments', status: false, key: 'sk_live_51Psd7...w09' },
  ]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setAnalyticsLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 8)]);
  };

  // Inflation calculations
  const inflationRatio = currencySource > 0 ? (currencySource / currencySink) * 100 : 100;
  const hasInflationAlert = inflationRatio >= 140;

  // Key performance indicators
  const grossRevenue = activeRegionalFilter === 'All' ? 24500000 : activeRegionalFilter === 'IDN' ? 14900000 : activeRegionalFilter === 'PH' ? 6200000 : 3400000;
  const totalPayingUsers = activeRegionalFilter === 'All' ? 840 : activeRegionalFilter === 'IDN' ? 510 : activeRegionalFilter === 'PH' ? 210 : 120;
  const totalActiveUsers = activeRegionalFilter === 'All' ? 12000 : activeRegionalFilter === 'IDN' ? 7400 : activeRegionalFilter === 'PH' ? 3100 : 1500;
  
  const arpu = Math.round(grossRevenue / totalActiveUsers);
  const arppu = Math.round(grossRevenue / totalPayingUsers);

  // Growth & Simulation handles
  const handleSimulateLevelFail = () => {
    const nextFail = levelFailCount + 1;
    setLevelFailCount(nextFail);
    if (nextFail >= 3) {
      setIsFlashSaleTriggered(true);
      addLog(`[LIVEOPS-EVENT] Player "RobloxGamer_99" gagal melewati Level 3 kali berturut-turut. Memicu Penawaran Flash Sale Otomatis!`);
    } else {
      addLog(`[LIVEOPS] Username "RobloxGamer_99" gagal level (${nextFail}/3). Memantau deteksi Churn...`);
    }
  };

  const handleClaimFlashSale = () => {
    setIsFlashSaleTriggered(false);
    setLevelFailCount(0);
    setCurrencySink(prev => prev + 150000);
    addLog(`[LIVEOPS-EVENT] Player "RobloxGamer_99" membeli paket Flash Sale senilai Rp 49.000! 150K Gold masuk ke Sink.`);
  };

  const toggleGateway = (index: number) => {
    const updated = [...paymentGateways];
    updated[index].status = !updated[index].status;
    setPaymentGateways(updated);
    addLog(`[B2B-GATEWAY] Status integrasi ${updated[index].name} dirubah menjadi ${updated[index].status ? 'AKTIF' : 'NON-AKTIF'}.`);
  };

  const handleManuallyReduceInflation = () => {
    setCurrencySink(prev => prev + 400000);
    addLog(`[ECONOMY-FIX] Menambahkan Gacha sink event & kenaikan harga joran pancing. Menyerap 400.000 Game Coins ke Sink Pool.`);
  };

  return (
    <div className="space-y-10">
      {/* SECTION TITLE */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 uppercase tracking-widest">
          <BarChart3 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          Game Analytics & Growth Suite
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-sans">
          Analisis, Otomatisasi & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-indigo-400 to-violet-400">Lipat Gandakan Penghasilan</span> Game Anda
        </h2>
        <p className="text-slate-400 text-md leading-relaxed">
          Modul SaaS B2B premium ini menyediakan data analitik mendalam tentang ekonomi in-game, segmentasi pemain Whales, deteksi fraud refund palsu, serta trigger penawaran otomatis LiveOps.
        </p>
      </div>

      {/* FILTERS TOOLBAR */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-slate-500" />
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Metrik Regional:</span>
          <div className="flex items-center gap-1">
            {(['All', 'IDN', 'PH', 'GLO'] as const).map(reg => (
              <button
                key={reg}
                onClick={() => {
                  setActiveRegionalFilter(reg);
                  addLog(`[ANALYTICS] Menyaring laporan metrics berdasarkan wilayah regional: ${reg}`);
                }}
                className={`px-2.5 py-1 rounded text-xs font-semibold border ${
                  activeRegionalFilter === reg 
                    ? 'bg-emerald-500 border-transparent text-slate-950 font-bold' 
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-slate-600 hidden sm:block" />
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Skala Waktu:</span>
          <div className="flex gap-1.5">
            {(['Daily', 'Weekly', 'Monthly'] as const).map(scale => (
              <button
                key={scale}
                onClick={() => {
                  setTimeScale(scale);
                  addLog(`[ANALYTICS] Mengubah grafik tren ke skala waktu: ${scale}`);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  timeScale === scale 
                    ? 'bg-indigo-500 text-white shadow-md' 
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {scale}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ================= PILAR 1: MONETIZATION ANALYTICS ================= */}
      <div className="space-y-6">
        <div className="border-b border-slate-900 pb-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Coins className="w-5 h-5 text-emerald-400" />
            1. Modul Monetisasi & Kesehatan Ekonomi Game
          </h3>
          <p className="text-slate-500 text-xs mt-1">Lacak kesehatan finansial IAP, perputaran mata uang virtual, dan performa item best-seller.</p>
        </div>

        {/* METRICS CARD ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Gross revenue (IAP)</span>
              <h4 className="text-2xl font-extrabold text-white font-mono">Rp {grossRevenue.toLocaleString('id-ID')}</h4>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% dibanding periode lalu
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-between text-[10px] text-slate-400">
              <span>Metode Populer: <strong>QRIS ({activeRegionalFilter === 'PH' ? 'Gcash' : 'Gopay'})</strong></span>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">ARPU (Per-Active User)</span>
              <h4 className="text-2xl font-extrabold text-indigo-300 font-mono">Rp {arpu.toLocaleString('id-ID')}</h4>
              <p className="text-[10px] text-slate-400">Rataan monetisasi per user masuk</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-between text-[10px] text-slate-400">
              <span>Total Active User: <strong>{totalActiveUsers.toLocaleString('id-ID')} Players</strong></span>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">ARPPU (Per-Paying User)</span>
              <h4 className="text-2xl font-extrabold text-violet-300 font-mono">Rp {arppu.toLocaleString('id-ID')}</h4>
              <p className="text-[10px] text-emerald-400">Tingkat keloyalan spender</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-between text-[10px] text-slate-400">
              <span>Rasio Conversion Rate: <strong className="text-white font-mono">7.0%</strong></span>
            </div>
          </div>
        </div>

        {/* ECOSYSTEM CHART INFLATION & BEST SELLERS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Virtual Currency Sink & Source Tracker (Left - 7 cols) */}
          <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800 p-6 rounded-3xl space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-emerald-400" />
                  Mata Uang Virtual: Sink vs Source Simulator
                </h4>
                <p className="text-slate-500 text-[10px]">Lacak perputaran koin / diamond demi menghindari inflasi game ekonomi.</p>
              </div>
              <button 
                onClick={handleManuallyReduceInflation}
                className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-indigo-500 text-white hover:brightness-110 flex items-center gap-1 transition"
              >
                <Zap className="w-3.5 h-3.5" /> Picu Sink Event
              </button>
            </div>

            {/* Interactive sliders to see mock inflation reaction */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                  <span>Source (Koin Diperoleh/Quest):</span>
                  <span className="font-mono text-emerald-400">+{currencySource.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="800000"
                  max="3000000"
                  step="50000"
                  value={currencySource}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setCurrencySource(val);
                    if (val / currencySink >= 1.4) {
                      addLog(`[ALERT] Rasio inflasi meningkat tajam! Koin Source terlalu aktif melampaui Sink.`);
                    }
                  }}
                  className="w-full h-1 bg-slate-800 rounded accent-emerald-400 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                  <span>Sink (Koin Terbuang/Gacha):</span>
                  <span className="font-mono text-indigo-400">-{currencySink.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="600000"
                  max="2000000"
                  step="50000"
                  value={currencySink}
                  onChange={(e) => {
                    setCurrencySink(parseInt(e.target.value));
                  }}
                  className="w-full h-1 bg-slate-800 rounded accent-indigo-400 cursor-pointer"
                />
              </div>
            </div>

            {/* INFLATION GRAPHIC METER */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Rasio Perputaran Ekonomi (Source / Sink):</span>
                <span className={`font-mono font-bold text-xs ${hasInflationAlert ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                  {inflationRatio.toFixed(1)}% {hasInflationAlert ? '⚠️ (INFLASI TINGGI)' : '✅ (SEHAT)'}
                </span>
              </div>

              {/* Progress bar visual container */}
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden flex border border-slate-800">
                <div 
                  className={`h-full transition-all duration-300 ${
                    hasInflationAlert ? 'bg-gradient-to-r from-red-500 to-amber-500' : 'bg-gradient-to-r from-emerald-500 to-indigo-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(30, inflationRatio - 50))}%` }}
                />
              </div>

              {hasInflationAlert ? (
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-start gap-1.5 text-[10px] text-rose-300">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <p>
                    <strong>Pemain Menimbun Koin!</strong> Pengguna memiliki terlalu banyak kekayaan dan tidak memiliki dorongan spending. Segera ciptakan promo Gacha pancingan baru atau joran langka untuk menarik kembali mata uang berlebih.
                  </p>
                </div>
              ) : (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-start gap-1.5 text-[10px] text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <p>
                    <strong>Ekonomi Sehat!</strong> Jumlah koin yang keluar dari sistem via Pembelian Joran/Metode Gacha seimbang dengan koin dari quest harian. Tingkat retensi dan stabilitas harga barang terjaga sempurna.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Item & Bundle Performance (Right - 5 cols) */}
          <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800 p-6 rounded-3xl space-y-4">
            <div>
              <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                <Award className="w-4 h-4 text-indigo-400" />
                Daftar Performa Item Game (Fisch & Roblox)
              </h4>
              <p className="text-slate-500 text-[10px]">Urutan item game paling banyak dibeli dan item yang mengendap.</p>
            </div>

            {/* Item Category lists */}
            <div className="space-y-2.5">
              <div className="p-2 px-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold bg-emerald-500/5 px-2 py-0.5 rounded text-[10px]">BEST</span>
                  <div>
                    <p className="font-semibold text-white truncate text-xs">1,000 R$ Gamepass</p>
                    <p className="text-[10px] text-slate-500">Konversi bot otomatis & instan</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white font-mono">180 Unit / hr</p>
                  <p className="text-[9px] text-emerald-400 font-bold">Terlaris #1</p>
                </div>
              </div>

              <div className="p-2 px-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold bg-emerald-500/5 px-2 py-0.5 rounded text-[10px]">BEST</span>
                  <div>
                    <p className="font-semibold text-white truncate text-xs">Abyssal Rod [Fisch Map]</p>
                    <p className="text-[10px] text-slate-500">Upgrade luck monster laut dalam</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white font-mono">54 Unit / hr</p>
                  <p className="text-[9px] text-indigo-300 font-bold">Profit Terbesar</p>
                </div>
              </div>

              <div className="p-2 px-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-bold bg-slate-550/5 px-2 py-0.5 rounded text-[10px]">WEAK</span>
                  <div>
                    <p className="font-semibold text-slate-300 truncate text-xs">50x Golden Bait Bundle</p>
                    <p className="text-[10px] text-slate-500">Umpan emas tier pancing biasa</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-400 font-mono">3 Unit / hr</p>
                  <p className="text-[9px] text-amber-400 font-bold">Dead Stock</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-xl">
              <p className="text-[10px] text-slate-400 leading-snug">
                💡 <strong>Saran Rekomendasi AI:</strong> Bundel jorand dan umpan emas di atas menjadi satu paket <strong>"Gold Fisher Bundle"</strong> seharga Rp 35.000 untuk melikuidasi Dead Stock secara efektif!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= PILAR 2: GROWTH & RETENTION TOOLS ================= */}
      <div className="space-y-6">
        <div className="border-b border-slate-900 pb-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            2. Fitur Pertumbuhan & Retensi Pemain (LiveOps Engine)
          </h3>
          <p className="text-slate-500 text-xs mt-1">Konversi pemain gratisan menjadi paying user melalui sistem otomatis LiveOps Flash Sale dan Segmentasi Whales.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Smart Player Segmentation & Churn Panel (Left - 7 cols) */}
          <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800 p-6 rounded-3xl space-y-4">
            <div>
              <h4 className="font-bold text-white text-md flex items-center gap-1.5">
                <Users className="w-5 h-5 text-indigo-400" />
                Smart Segmentation & Deteksi Churn
              </h4>
              <p className="text-slate-500 text-[10px]">Secara otomatis mengelompokkan pembeli berdasarkan bobot belanja bulanan dan memprediksi risiko Churn.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] text-slate-500 uppercase tracking-widest">
                    <th className="py-2.5 px-3">Username</th>
                    <th className="py-2.5 px-3">Segmen</th>
                    <th className="py-2.5 px-3">Transaksi</th>
                    <th className="py-2.5 px-3">Churn Risk</th>
                    <th className="py-2.5 px-3 text-right">Aksi Cepat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300 font-medium">
                  <tr>
                    <td className="py-3 px-3 text-white font-mono">FischGamerXX</td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] bg-red-400/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded font-bold">
                        🐋 WHALE
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-white">Rp 1.450K</td>
                    <td className="py-3 px-3 text-rose-400 font-bold">TINGGI (Inactive Day-7)</td>
                    <td className="py-3 px-3 text-right">
                      <button 
                        onClick={() => {
                          addLog("[PROMO-VIP] Mengirimkan kupon WhatsApp eksklusif Gratis 1,000 Robux & Voucher Abyssal Rod ke FischGamerXX.");
                        }}
                        className="py-1 px-2.5 rounded bg-indigo-500 text-white font-bold text-[9px] hover:brightness-110"
                      >
                        Kirim Kupon VIP
                      </button>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3 px-3 text-white font-mono">BloxFruitsSlayer</td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded font-bold">
                        🐬 DOLPHIN
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-white">Rp 350K</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">RENDAH (Aktif)</td>
                    <td className="py-3 px-3 text-right">
                      <button 
                        onClick={() => {
                          addLog("[PROMO-EVENT] Mengundang BloxFruitsSlayer ke Trading Server Premium VIP.");
                        }}
                        className="py-1 px-2.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-bold text-[9px] hover:bg-slate-800"
                      >
                        Undang Event
                      </button>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3 px-3 text-white font-mono">NoobPancake_22</td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-bold">
                        🐠 NON-PAYER
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500">Rp 0 (Gratisan)</td>
                    <td className="py-3 px-3 text-slate-400 font-medium">Sedang (Terjebak Level 3)</td>
                    <td className="py-3 px-3 text-right">
                      <button 
                        onClick={() => {
                          setIsFlashSaleTriggered(true);
                          setLevelFailCount(3);
                          addLog("[LIVEOPS] Memicu paksa penawaran diskon 40% joran pancing untuk NoobPancake_22.");
                        }}
                        className="py-1 px-2.5 rounded bg-emerald-500 text-slate-950 font-bold text-[9px]"
                      >
                        Trigger Diskon
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-550/10 text-[10px] text-slate-400">
              📌 <strong>Fungsi AI Tracker:</strong> Robot mendeteksi pemicu Churn (Whale tidak bermain selama 7 hari), sistem database otomatis mengirimkan penawaran diskon top up khusus ke e-wallet mereka.
            </div>
          </div>

          {/* Interactive Dynamic Pricing & LiveOps Simulator (Right - 5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-indigo-950/40 to-slate-900 border border-indigo-500/20 p-6 rounded-3xl space-y-4">
            <div>
              <span className="text-[9px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/35 px-2 py-0.5 rounded font-mono font-bold">LIVEOPS INTERACTIVE SIMULATOR</span>
              <h4 className="font-bold text-white text-sm mt-1 flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-emerald-400 animate-bounce" />
                LiveOps & Flash Sale Trigger
              </h4>
              <p className="text-slate-400 text-[10px]">Uji coba memicu promo belanja diskon jika pemain gagal melewati rintangan / level map roblox berkali-kali.</p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3.5">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Player gagal level:</span>
                <span className="font-mono font-bold text-indigo-400">{levelFailCount} / 3 kali</span>
              </div>

              {/* LEVEL FAIL ACTION BUTTON */}
              <button
                onClick={handleSimulateLevelFail}
                className="w-full py-2.5 px-3 rounded-lg text-xs font-bold uppercase bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-850 flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" /> Simulasikan Gagal Level (+1)
              </button>
            </div>

            {/* Simulated Live Flash Sale Offer Window */}
            {isFlashSaleTriggered && (
              <div className="p-4 bg-indigo-500/10 border-2 border-indigo-500 border-dashed rounded-2xl relative overflow-hidden space-y-3 text-center">
                <div className="absolute top-0 right-0 bg-indigo-500 text-white px-2 py-0.5 text-[9px] font-bold uppercase rounded-bl">
                  LIVEOPS TRIGGER
                </div>
                <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto text-indigo-300 animate-ping">
                  ⚡
                </div>
                <div>
                  <h5 className="font-bold text-white text-xs">Penawaran Eksklusif Churn-Prevention!</h5>
                  <p className="text-[10px] text-slate-300 mt-1">Kami mendeteksi Anda kesulitan melewati Level. Dapatkan bantuan pancingan dewa sekarang!</p>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-lg text-left text-[11px] leading-snug space-y-1">
                  <div className="flex justify-between">
                    <span>Bundel Item:</span>
                    <strong className="text-emerald-400">{customFlashSaleProduct}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Harga Penyelamat:</span>
                    <strong className="text-white"><span className="line-through text-slate-500 mr-1">R$ 500</span> R$ 199 (Save 60%)</strong>
                  </div>
                </div>
                <button
                  onClick={handleClaimFlashSale}
                  className="w-full py-2 rounded-lg bg-emerald-400 text-slate-950 text-xs font-bold uppercase hover:brightness-105"
                >
                  Beli & Bantu Player Sekarang
                </button>
              </div>
            )}
            
            <div className="space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-800 text-[10px] text-slate-400">
              <span className="font-bold text-slate-300 block">Localized Pricing Config:</span>
              <div className="flex justify-between mt-1 text-[9px] text-slate-500 border-t border-slate-900 pt-1.5">
                <span>Indonesia (IDR): <strong className="text-white">Rp 49,000</strong></span>
                <span>Philippines (PHP): <strong className="text-white">₱ 180</strong></span>
                <span>Global GLO (USD): <strong className="text-white">$ 3.49</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= PILAR 3 & 4: INTEGRATIONS, ECCOSYSTEM & VISUAL TABLES ================= */}
      <div className="space-y-6">
        <div className="border-b border-slate-900 pb-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-violet-400" />
            3 & 4. Integrasi B2B, Anti-Fraud & Visual Dashboard Funnel
          </h3>
          <p className="text-slate-500 text-xs mt-1">Status proteksi keamanan sanksi refund palsu, endpoint API penyedia pembayaran, serta analisis konversi corong IAP.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Payment SDKs + Anti-Fraud Dashboard (Left - 6 cols) */}
          <div className="lg:col-span-6 bg-slate-900/40 border border-slate-800 p-6 rounded-3xl space-y-5">
            <div>
              <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-violet-400" />
                Aggregator Payment Gateway SDK & Anti-Fraud
              </h4>
              <p className="text-slate-500 text-[10px]">Kelola kunci koneksi gerbang pembayaran pihak ketiga dan amankan tokonya.</p>
            </div>

            {/* Anti Fraud Toggler */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-emerald-400 animate-pulse" />
                  Anti-Fraud & Refund Shield Firewalls
                </p>
                <p className="text-slate-500 text-[10px] mt-0.5">Otomatis deteksi & kembalikan (ban) akun melakukan refund curang pasca item diklaim.</p>
              </div>
              <button 
                onClick={() => {
                  setIsAntiFraudActive(!isAntiFraudActive);
                  addLog(`[ANTI-FRAUD] Mengubah sistem keamanan kecurangan ke: ${!isAntiFraudActive ? 'TENANG / AKTIF' : 'NON-AKTIF / RAWAN'}.`);
                }}
                className="p-1 px-2 text-xs rounded uppercase font-bold"
              >
                {isAntiFraudActive ? (
                  <span className="text-emerald-400 flex items-center gap-1">🟢 AKTIF</span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-1">🔴 MATI</span>
                )}
              </button>
            </div>

            {/* SDK Key Switchers */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Kunci Hubungan SDK Payment:</span>
              
              {paymentGateways.map((gate, idx) => (
                <div key={idx} className="p-2.5 bg-slate-950 rounded-lg border border-slate-850 flex items-center justify-between text-xs font-mono">
                  <div>
                    <p className="text-slate-300 font-bold">{gate.name}</p>
                    <span className="text-[9px] text-slate-500">{gate.key}</span>
                  </div>
                  
                  <button 
                    onClick={() => toggleGateway(idx)}
                    className={`p-1 px-2.5 rounded font-bold font-sans text-[9px] ${
                      gate.status 
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' 
                        : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                    }`}
                  >
                    {gate.status ? 'CONNECTED' : 'DISABLED'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Tables and metrics (Right - 6 cols) */}
          <div className="lg:col-span-6 bg-slate-900/40 border border-slate-800 p-6 rounded-3xl space-y-5">
            <div>
              <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                Funnel Analytics & Gacha Drop-Rate Table
              </h4>
              <p className="text-slate-500 text-[10px]">Detail diagram corong transaksi top-up dan statistik kepuasan Lootbox.</p>
            </div>

            {/* Funnel list rendering */}
            <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-850">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">📊 Top-Up Funnel Conversion:</span>
              
              <div className="space-y-2.5 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">1. Pengunjung Toko (Marketplace)</span>
                    <strong className="text-white">100% (12,000)</strong>
                  </div>
                  <div className="w-full bg-slate-900 h-1 rounded"><div className="bg-slate-600 h-full w-full" /></div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">2. Membuka Konfiguratur Checkout</span>
                    <strong className="text-white">45% (5,400)</strong>
                  </div>
                  <div className="w-full bg-slate-900 h-1 rounded"><div className="bg-indigo-500 h-full w-[45%]" /></div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">3. Menulis Username & Generate QRIS</span>
                    <strong className="text-white">22% (2,640)</strong>
                  </div>
                  <div className="w-full bg-slate-900 h-1 rounded"><div className="bg-violet-500 h-full w-[22%]" /></div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">4. Gateway Webhook Lunas / Bot Delivered</span>
                    <strong className="text-emerald-400 font-bold">7% (840) ✅</strong>
                  </div>
                  <div className="w-full bg-slate-900 h-1 rounded"><div className="bg-emerald-400 h-full w-[7%]" /></div>
                </div>
              </div>
            </div>

            {/* Gacha analytics inside table */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 space-y-2 text-[10px]">
              <span className="font-bold text-slate-300 block">🎲 Gacha lootbox & Battle Pass Tracker status:</span>
              <div className="grid grid-cols-3 gap-2 text-center mt-1 text-[9px] leading-tight">
                <div className="p-1 px-1.5 bg-slate-900 rounded border border-slate-800">
                  <p className="text-slate-500 text-[8px]">Drop Legendary</p>
                  <strong className="text-emerald-400 font-mono">0.5% (Fair)</strong>
                </div>
                <div className="p-1 px-1.5 bg-slate-900 rounded border border-slate-800">
                  <p className="text-slate-500 text-[8px]">Pity Counter</p>
                  <strong className="text-white font-mono">80 Pull Lock</strong>
                </div>
                <div className="p-1 px-1.5 bg-slate-900 rounded border border-slate-800">
                  <p className="text-slate-500 text-[8px]">Pass Activation</p>
                  <strong className="text-indigo-400 font-mono">34.2% Rate</strong>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* RECENT LIVE LOGS IN ANALYTICS SYSTEM */}
      <div className="bg-slate-950/85 p-4 rounded-2xl border border-slate-850 font-mono text-[10.5px]">
        <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-2.5">
          <span className="font-bold text-slate-400 flex items-center gap-1 text-[11px]">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            Live Logs Console: Game Analytics & Webhooks
          </span>
          <span className="text-slate-600 text-[9px]">SaaS-Tracker-Service / online</span>
        </div>
        <div className="max-h-[140px] overflow-y-auto space-y-2 text-slate-300">
          {analyticsLogs.map((log, index) => (
            <div key={index} className="flex gap-1.5">
              <span className="text-slate-600 truncate">[{log.slice(1,9)}]</span>
              <span className="text-indigo-300">{log.slice(11)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
