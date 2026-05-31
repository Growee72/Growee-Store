import React, { useState } from 'react';
import { 
  TrendingUp, Users, DollarSign, ArrowUpRight, ArrowDownRight, Sparkles, 
  Bot, ShieldAlert, BadgeCheck, Zap, Layers, RefreshCw, BarChart3, PieChart,
  Code, AlertCircle, ShoppingBag, Eye, Percent, Smartphone, Send, SendHorizontal
} from 'lucide-react';

export const AnalyticsGrowth: React.FC = () => {
  // Stats overview states
  const [currencyExchange, setCurrencyExchange] = useState({ sink: 4500000, source: 5800000 });
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Dynamic pricing flash sale state
  const [flashSaleActive, setFlashSaleActive] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(15); // percent
  const [selectedItemForSale, setSelectedItemForSale] = useState('Abyssal Rod');
  const [flashSaleLogs, setFlashSaleLogs] = useState<string[]>([
    "Sistem LiveOps siap. Menunggu trigger aktivitas pengguna."
  ]);

  // Whales / User segment parameters
  const [vipSegment, setVipSegment] = useState([
    { id: '1', username: 'WhaleKing_Roblox', spend: 4500000, activeDays: 28, status: 'HIGH_RISK_OF_CHURN', actionSent: false },
    { id: '2', username: 'FischMaster_99', spend: 3200000, activeDays: 30, status: 'LOYAL_ACTIVE', actionSent: false },
    { id: '3', username: 'BloxFruit_Whale', spend: 5120000, activeDays: 12, status: 'HIGH_RISK_OF_CHURN', actionSent: false },
    { id: '4', username: 'NoobPro_Gamer', spend: 120000, activeDays: 20, status: 'DOLPHIN', actionSent: false }
  ]);

  // Anti-fraud alerts
  const [fraudAlerts, setFraudAlerts] = useState([
    { id: 'FR-101', user: 'ScammerNoob_X', type: 'Refund Exploitation Attempt', severity: 'HIGH', status: 'AUTO_BLOCKED', timestamp: '10 Mins Ago' },
    { id: 'FR-102', user: 'HackRbx_91', type: 'Multiple Device Rapid Token Exchange', severity: 'CRITICAL', status: 'SUSPENDED', timestamp: '1 Hour Ago' },
    { id: 'FR-103', user: 'FischGlitcher', type: 'Abnormal In-Game Trade Speed', severity: 'MEDIUM', status: 'MONITORED', timestamp: '3 Hours Ago' }
  ]);

  // SDK Choice for Integration tab
  const [selectedPlatform, setSelectedPlatform] = useState<'stripe' | 'xsolla' | 'unipin' | 'codashop'>('codashop');

  // Interactive metrics simulation helper
  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setCurrencyExchange({
        sink: Math.floor(4000000 + Math.random() * 1000000),
        source: Math.floor(5200000 + Math.random() * 1500000)
      });
      // Add fake logs
      showLiveOpsLog("Data metrik perekonomian game berhasil disinkronisasikan dari server Roblox.");
    }, 800000 / 10000); // quick response
  };

  const showLiveOpsLog = (msg: string) => {
    const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setFlashSaleLogs(prev => [`[${time}] ${msg}`, ...prev.slice(0, 5)]);
  };

  const triggerLiveOpsFlashSale = () => {
    setFlashSaleActive(true);
    showLiveOpsLog(`FLASH SALE DIAKTIFKAN: Diskon ${selectedDiscount}% untuk "${selectedItemForSale}" otomatis ditrigger saat pemain gagal 3x.`);
    // Automatically trigger notification simulated alert to VIPs
    showLiveOpsLog(`LiveOps Notifikasi dikirimkan ke segmentasi Dolphin & Whale.`);
  };

  const stopFlashSale = () => {
    setFlashSaleActive(false);
    showLiveOpsLog(`FLASH SALE DINONAKTIFKAN. Statistik harga kembali normal.`);
  };

  const treatVIPChurnRisk = (id: string, username: string) => {
    setVipSegment(prev => prev.map(v => {
      if (v.id === id) {
        return { ...v, actionSent: true, status: 'STABILIZED' };
      }
      return v;
    }));
    showLiveOpsLog(`Kupon Churn-Prevention 20% + Exclusive Fisch Bait dikirimkan ke WhatsApp & Discord "${username}".`);
  };

  const resolveFraudAlert = (id: string) => {
    setFraudAlerts(prev => prev.filter(al => al.id !== id));
    showLiveOpsLog(`Status fraud alert ${id} diproteksi. Transaksi ditarik kembali.`);
  };

  const getClientCode = () => {
    switch(selectedPlatform) {
      case 'codashop':
        return `// Growee SDK: Integrasi CodaPay / Codashop Instant API
import { GroweeAggregatorSDK } from '@growee/saas-sdk';

const client = new GroweeAggregatorSDK({
  apiKey: "env.GROWEE_PUBLISHER_KEY_9281",
  merchantId: "M-CODA-ROBLOX-ID",
  environment: "production"
});

// Jalankan webhook pendeteksi pembayaran item
client.onPaymentReceived(async (payload) => {
  console.log(\`Pembayaran diterima sebesar \${payload.amount} dari \${payload.robloxUsername}\`);
  
  // Alokasikan Delivery Bot Otomatis Growee
  const botOrder = await client.dispatchDeliveryBot({
    targetProduct: payload.itemId,
    robloxUsername: payload.robloxUsername,
    secureTradeProtocol: true
  });
  
  console.log(\`Robot Tersebar dengan ID: \${botOrder.botId}\`);
});`;
      case 'stripe':
        return `// Growee SDK: Integrasi Global Stripe Payment Gateway
import { GroweeStripeGateway } from '@growee/saas-sdk';

const payClient = new GroweeStripeGateway({
  secretKey: process.env.STRIPE_SECRET_KEY,
  autoRecurringBilling: true // Mendukung SaaS Subscription bulanan
});

// Proses pendaftaran Recurring Token
const subscription = await payClient.createSaaSMember({
  customerId: "usr_942851",
  feeIDR: 29000,
  autoRenewalDays: 30
});`;
      case 'xsolla':
        return `// Growee SDK: Integrasi Xsolla Game Store Monetization
import { GroweeXsollaAdapter } from '@growee/saas-sdk';

const adapter = new GroweeXsollaAdapter({
  projectId: "931201",
  tokenAuth: "Bearer ...",
});

// Sync catalog virtual items dari platform Growee ke Xsolla Catalog Store
await adapter.syncVirtualStoreInventory({
  storeName: "Growee Store Fisch Category",
  itemsList: ["Abyssal Rod", "Auroral Rod", "Golden Bait"]
});`;
      case 'unipin':
        return `// Growee SDK: Integrasi UniPin Wallet & Voucher API
import { UniPinAggregator } from '@growee/saas-sdk';

const uniClient = new UniPinAggregator({
  secretToken: "UniPin_Token_Growee_392",
  currency: "IDR"
});

// Cek status transaksi e-wallet UniPin
const status = await uniClient.checkTransactionStatus("TX-UNI-984210");
console.log("Status instan:", status.isPaid ? "LUNAS" : "PENDING");`;
    }
  };

  return (
    <div className="space-y-10">
      
      {/* SECTION TOP HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20 uppercase tracking-widest">
          <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
          Game Growth & Publisher Console
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-sans">
          Dashboard <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-indigo-400 to-indigo-500">Game Analytics & Retention SaaS</span>
        </h2>
        <p className="text-slate-400 text-md leading-relaxed">
          Dirancang khusus untuk developer & publisher game Roblox/Fisch. Lacak pendapatan top-up, 
          ekonomi barang, otomatisasi penawaran diskon, segmentasi pembeli, hingga integrasi backend SDK.
        </p>
      </div>

      {/* METRIC CARD OVERVIEW ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric 1: IAP Top-Up & ARPPU Analytics */}
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 rounded-full blur-xl" />
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">IAP & Top-Up Analytics</h4>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-bold font-mono">
              REAL-TIME
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] text-slate-500">Gross Monthly Revenue</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white font-mono">Rp 124,500,000</span>
              <span className="text-emerald-400 font-mono text-xs flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> +18.4%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-800/80">
            <div>
              <p className="text-[9px] text-slate-500 uppercase">ARPU (Per Player)</p>
              <p className="font-bold text-white font-mono text-sm mt-0.5">Rp 14,500</p>
            </div>
            <div>
              <p className="text-[9px] text-slate-500 uppercase">ARPPU (Per Paying)</p>
              <p className="font-bold text-indigo-300 font-mono text-sm mt-0.5">Rp 185,000</p>
            </div>
          </div>
        </div>

        {/* Metric 2: Virtual Economy Sink & Source */}
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl" />
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Economy Sink & Source Tracker</h4>
            <button 
              onClick={handleRefreshData}
              disabled={isRefreshing}
              className="p-1 px-2 text-[9px] bg-slate-950 border border-slate-800 rounded font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition flex items-center gap-1 shrink-0"
            >
              <RefreshCw className={`w-2.5 h-2.5 ${isRefreshing ? 'animate-spin' : ''}`} /> Sync data
            </button>
          </div>

          <div className="space-y-1.5">
            <p className="text-[10px] text-slate-500">Virtual Currency (Fisch Sea-Gold Group Vault)</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] text-slate-500">Gold Sinks (Spent/Burned)</p>
                <p className="font-bold text-white font-mono text-md">Rp {currencyExchange.sink.toLocaleString('id-ID')}</p>
              </div>
              <div>
                <p className="text-[9px] text-slate-500">Gold Sources (Earned/Rewarded)</p>
                <p className="font-bold text-emerald-400 font-mono text-md">Rp {currencyExchange.source.toLocaleString('id-ID')}</p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Status Inflasi Ekonomi Map:</span>
              <span className="text-emerald-400 font-bold uppercase font-mono">SEHAT (Inflation 1.2x)</span>
            </div>
            {/* Visual health meter bar */}
            <div className="w-full bg-slate-950 h-1.5 rounded-full mt-1.5 overflow-hidden flex">
              <div className="bg-emerald-400 h-full" style={{ width: '45%' }}></div>
              <div className="bg-indigo-500 h-full" style={{ width: '35%' }}></div>
              <div className="bg-slate-800 h-full flex-1"></div>
            </div>
          </div>
        </div>

        {/* Metric 3: Item Performance Marketplace */}
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Item Marketplace Performance</h4>
          
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center p-1.5 bg-slate-950 rounded border border-slate-850">
              <span className="font-medium text-slate-300">⭐ Best Seller: Abyssal Rod</span>
              <span className="font-mono text-emerald-400 font-bold">+Rp 12.4M</span>
            </div>
            <div className="flex justify-between items-center p-1.5 bg-slate-950 rounded border border-slate-850">
              <span className="font-medium text-slate-400">🔥 Kitsune Fruit Bundle</span>
              <span className="font-mono text-indigo-400 font-bold">+Rp 9.2M</span>
            </div>
            <div className="flex justify-between items-center p-1.5 bg-slate-900 rounded">
              <span className="font-medium text-slate-500">📉 Dead Stock: Wooden Bait</span>
              <span className="font-mono text-slate-500 text-[10px]">Stok: 4,000 Pcs</span>
            </div>
          </div>
        </div>

      </div>

      {/* THREE INTERACTIVE BLOCKS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 1. GROWTH & VIP CHURN RETENTION (7 Columns) */}
        <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              Smart Segmentation Engine & VIP Churn Prevention
            </h3>
            <p className="text-slate-500 text-xs mt-1">Mengelompokkan pemain secara otomatis berdasarkan pengeluaran belanja (Whales, Dolphins, Non-Payers) serta menghentikan churn VIP.</p>
          </div>

          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 font-bold font-mono">
                    <th className="py-2.5 px-3">Username Roblox</th>
                    <th className="py-2.5 px-3">Segment</th>
                    <th className="py-2.5 px-3">Total Spend</th>
                    <th className="py-2.5 px-3">Status Resiko Churn</th>
                    <th className="py-2.5 px-3 text-right">Opsi Intervensi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {vipSegment.map(vip => (
                    <tr key={vip.id} className="hover:bg-slate-900/30">
                      <td className="py-3 px-3 font-semibold text-white">{vip.username}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          vip.spend > 4000000 
                            ? 'bg-purple-500/10 text-purple-300 border border-purple-500/25' 
                            : 'bg-indigo-500/10 text-indigo-300'
                        }`}>
                          {vip.spend > 4000000 ? '👑 WHALE' : '🐬 DOLPHIN'}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-300">Rp {vip.spend.toLocaleString('id-ID')}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          vip.status === 'HIGH_RISK_OF_CHURN'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                            : vip.status === 'STABILIZED'
                            ? 'bg-emerald-500/10 text-emerald-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {vip.status === 'HIGH_RISK_OF_CHURN' ? '🚨 HIGH RISK CHURN' : vip.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {vip.status === 'HIGH_RISK_OF_CHURN' ? (
                          <button
                            onClick={() => treatVIPChurnRisk(vip.id, vip.username)}
                            className="text-[10px] font-semibold bg-indigo-500 hover:bg-indigo-600 text-white rounded px-2.5 py-1 transition flex items-center gap-1 ml-auto"
                          >
                            <Zap className="w-3 h-3 text-amber-300" /> Cegah Churn
                          </button>
                        ) : vip.status === 'STABILIZED' ? (
                          <span className="text-[10px] text-emerald-400 font-bold font-mono">✔ SENT (STABLE)</span>
                        ) : (
                          <span className="text-[10px] text-slate-500">No Action Required</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
              <Bot className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <p>
                <strong>AI Churn Prediction Engine:</strong> Algoritma Growee SaaS mendeteksi penurunan aktivitas logins harian segmentasi Whales dan merekomendasikan direct coupons untuk mempertahankan retensi merchant 30-hari.
              </p>
            </div>
          </div>
        </div>

        {/* 2. LIVEOPS & DYNAMIC PRICING ENGINE (5 Columns) */}
        <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
              LiveOps & Dynamic Flash Sale Trigger
            </h3>
            <p className="text-slate-500 text-xs mt-1">Buat tawaran diskon real-time otomatis saat gamer mengalami kesulitan in-game (misal: gagal lewat level 3x berturut-turut).</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              
              {/* Product Trigger choice */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 block">Pilih Item Promo</label>
                <select
                  value={selectedItemForSale}
                  onChange={(e) => setSelectedItemForSale(e.target.value)}
                  className="w-full bg-slate-950 text-slate-300 p-2 text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Abyssal Rod">Abyssal Rod [Legendary]</option>
                  <option value="Auroral Rod">Auroral Rod [Divine]</option>
                  <option value="Kitsune Fruit [Permanent]">Kitsune Fruit [Permanent]</option>
                  <option value="Titanic Cat Pet">Titanic Cat Pet</option>
                </select>
              </div>

              {/* Discount choice */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 block">Dynamic Percent Discount (%)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={selectedDiscount}
                    onChange={(e) => setSelectedDiscount(parseInt(e.target.value))}
                    className="flex-1 accent-emerald-400 bg-slate-800 rounded-lg cursor-pointer h-1.5"
                  />
                  <span className="font-mono text-xs font-bold text-emerald-400 border border-slate-800/80 bg-slate-950 px-2 py-1 rounded w-10 text-center">
                    {selectedDiscount}%
                  </span>
                </div>
              </div>

              {/* Action trigger button */}
              <div className="flex gap-2">
                {!flashSaleActive ? (
                  <button
                    onClick={triggerLiveOpsFlashSale}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-xs uppercase tracking-wide transition hover:brightness-110 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/15"
                  >
                    <Zap className="w-4 h-4 fill-slate-950" />
                    Aktifkan LiveOps Automatons
                  </button>
                ) : (
                  <button
                    onClick={stopFlashSale}
                    className="w-full py-2.5 px-3 rounded-xl bg-rose-500/25 border border-rose-500/30 text-rose-300 font-bold text-xs uppercase tracking-wide transition hover:bg-rose-500/35 flex items-center justify-center gap-2"
                  >
                    Hentikan LiveOps Promo
                  </button>
                )}
              </div>
            </div>

            {/* Simulated Live Terminal logs */}
            <div className="space-y-2">
              <span className="text-[10px] text-slate-500 font-mono block">Status Logs LiveOps:</span>
              <div className="bg-black/80 font-mono text-[10px] p-2.5 rounded-xl border border-slate-850 h-28 overflow-y-auto space-y-1.5 scroll-smooth select-none no-scrollbar text-slate-400">
                {flashSaleLogs.map((log, idx) => (
                  <p key={idx} className="whitespace-pre-wrap leading-relaxed">{log}</p>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* 3. B2B DEVELOPER SDK PORTAL & ANTI-FRAUD ENGINE (FULL WIDTH DUAL SIDE SIDE) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Anti-Fraud Dashboard */}
        <div className="lg:col-span-4 bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Sistem Anti-Fraud & Refunder Guard
            </h3>
            <p className="text-slate-500 text-[11px]">Proteksi merchant SaaS dari percobaan refund ilegal & token swapping bot in-game game Roblox.</p>
          </div>

          <div className="space-y-3">
            {fraudAlerts.map(fr => (
              <div key={fr.id} className="p-3 bg-slate-950 rounded-xl border border-slate-850 space-y-2">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-bold font-mono text-rose-450">{fr.id}</span>
                  <span className="text-slate-650">{fr.timestamp}</span>
                </div>
                
                <div className="text-left select-none">
                  <p className="text-xs font-bold text-white uppercase">{fr.user}</p>
                  <p className="text-slate-500 text-[10px] mt-0.5">{fr.type}</p>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-900">
                  <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded ${
                    fr.status === 'AUTO_BLOCKED' ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {fr.status}
                  </span>

                  <button
                    onClick={() => resolveFraudAlert(fr.id)}
                    className="text-[9px] font-semibold text-indigo-400 hover:text-indigo-300 bg-transparent py-1 border border-transparent"
                  >
                    Abaikan & Amankan
                  </button>
                </div>
              </div>
            ))}

            {fraudAlerts.length === 0 && (
              <div className="text-center py-6 text-slate-600">
                <BadgeCheck className="w-8 h-8 text-emerald-400 mx-auto mb-1.5" />
                <p className="text-xs">Hebat! Tidak ada ancaman transaksi mencurigakan saat ini.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: SDK API Integrations (8 columns) */}
        <div className="lg:col-span-8 bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-indigo-400" />
                Payment Aggregator SDK Explorer
              </h3>
              <p className="text-slate-500 text-[11px] mt-0.5">Integrasikan sistem pembayaran top-up eksternal (Stripe, CodaPay, Unipin, Xsolla) ke dalam kode game buatan Anda hanya dengan beberapa baris.</p>
            </div>

            {/* Segment control */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-850 shrink-0 select-none">
              {(['codashop', 'stripe', 'xsolla', 'unipin'] as const).map(plat => (
                <button
                  key={plat}
                  onClick={() => setSelectedPlatform(plat)}
                  className={`px-2 py-1 text-[9px] font-bold uppercase rounded ${
                    selectedPlatform === plat 
                      ? 'bg-slate-900 text-white' 
                      : 'text-slate-500 hover:text-slate-350'
                  }`}
                >
                  {plat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {/* Immersive syntax terminal code preview */}
            <div className="bg-black/95 p-4 rounded-xl border border-slate-850 font-mono text-[10px] text-indigo-300 relative overflow-x-auto select-all leading-relaxed whitespace-pre min-h-[160px] no-scrollbar">
              <div className="absolute top-2 right-2 text-[9px] bg-indigo-500/25 border border-indigo-500/35 px-1.5 py-0.5 rounded text-indigo-300 shrink-0">
                npm install @growee/saas-sdk
              </div>
              {getClientCode()}
            </div>
            
            <p className="text-[10px] text-slate-550 leading-relaxed">
              💡 <strong>Cara Penggunaan:</strong> Anda dapat mengunduh library SDK Growee Store, mengarahkan port endpoint webhook ke server game Roblox Studio Anda, dan bot pengiriman trading item game akan terhubung langsung tanpa perorangan manual.
            </p>
          </div>
        </div>

      </div>

      {/* DASHD BOARD FUNNEL & METADATA SECTION */}
      <div className="bg-slate-900/45 border border-slate-800 rounded-3xl p-6">
        <h4 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          Detail Corong Konversi & Kampanye Pertumbuhan Game (Growth Funnels)
        </h4>

        {/* Triple Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Funnel 1: Top-Up Funnel */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 space-y-3">
            <h5 className="text-xs font-bold text-white flex justify-between items-center border-b border-slate-900 pb-2">
              <span>📊 Top-Up Funnel</span>
              <span className="text-[10px] text-emerald-400">Avg Conv: 64.5%</span>
            </h5>
            
            <div className="space-y-2 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold uppercase">
                  <span>1. Views Catalog</span>
                  <span>10,000 Users (100%)</span>
                </div>
                <div className="w-full bg-slate-900 h-2.5 rounded overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-indigo-500 h-full" style={{ width: '100%' }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold uppercase">
                  <span>2. Checkout Config (Input Roblox ID)</span>
                  <span>8,500 Users (85%)</span>
                </div>
                <div className="w-full bg-slate-900 h-2.5 rounded overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-indigo-500 h-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold uppercase">
                  <span>3. Payment Scan QRIS Trigger</span>
                  <span>6,450 Users (64.5%)</span>
                </div>
                <div className="w-full bg-slate-900 h-2.5 rounded overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-indigo-500 h-full" style={{ width: '64.5%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Funnel 2: Gacha Drops Analytics */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 space-y-3">
            <h5 className="text-xs font-bold text-white flex justify-between items-center border-b border-slate-900 pb-2">
              <span>🎲 Gacha Lootbox Analytics</span>
              <span className="text-[10px] text-indigo-400">90-Pity Rule</span>
            </h5>
            
            <div className="space-y-2.5 text-xs text-slate-400 select-none">
              <div className="flex justify-between">
                <span>Rasio Drops Divine/Legendary:</span>
                <strong className="text-indigo-400">1.25% (S-Tier)</strong>
              </div>
              <div className="flex justify-between">
                <span>Rasio Gold/Epic Bait:</span>
                <strong className="text-indigo-400">12.5%</strong>
              </div>
              <div className="flex justify-between">
                <span>Sisa Batas Pity System:</span>
                <strong className="text-emerald-400">34x pull to Legendary</strong>
              </div>
              <div className="flex justify-between">
                <span>Tingkat Kepuasan Pemain:</span>
                <strong className="text-white">Sangat Tinggi (94%)</strong>
              </div>
            </div>
          </div>

          {/* Funnel 3: Battle Pass Activation Tracker */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 space-y-3">
            <h5 className="text-xs font-bold text-white flex justify-between items-center border-b border-slate-900 pb-2">
              <span>📅 Battle Pass Activation Tracker</span>
              <span className="text-[10px] text-emerald-400">Tier Completion: 78%</span>
            </h5>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Seasonal Pass Season 4:</span>
                <strong className="text-white">1,500 Pembeli VIP</strong>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] text-slate-500 font-bold uppercase">
                  <span>Progress Aktivasi Season Pass Peta Fisch</span>
                  <span>78% Selesai target murni</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              
              <p className="text-[9px] text-slate-500 leading-tight">
                *Sistem notifikasi Discord Bot Growee secara berkala mengirim alert pengingat agar pengguna menyelesaikan level pass sebelum akhir musim.
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
