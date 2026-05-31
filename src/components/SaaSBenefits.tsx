import React from 'react';
import { Check, X, Zap, Sparkles, CreditCard, Bot, MessageSquare, Flame } from 'lucide-react';
import { SubscriptionState } from '../types';

interface SaaSBenefitsProps {
  subscription: SubscriptionState;
  onUpdateSubscription: (sub: SubscriptionState) => void;
}

export const SaaSBenefits: React.FC<SaaSBenefitsProps> = ({
  subscription,
  onUpdateSubscription,
}) => {
  const isPremium = subscription.tier === 'premium';

  const handleSubscribe = () => {
    if (isPremium) {
      // Degrade to Free
      const updated: SubscriptionState = {
        tier: 'free',
        price: 0,
        autoRenewal: false,
        nextRenewalDate: '-',
        paymentMethodTokenText: '',
      };
      onUpdateSubscription(updated);
    } else {
      // Upgrade to Premium
      const updated: SubscriptionState = {
        tier: 'premium',
        price: 29000,
        autoRenewal: true,
        nextRenewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        paymentMethodTokenText: 'GoPay-Agreement-GP8942-SaaS',
        activatedAt: new Date().toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      };
      onUpdateSubscription(updated);
    }
  };

  return (
    <div className="space-y-10" id="saas-plans">
      {/* SaaS Feature Cards */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20 uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
          SaaS subscription model
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-sans">
          Maksimalkan Untung dengan <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-indigo-400 to-violet-400">Akun Premium SaaS</span>
        </h2>
        <p className="text-slate-400 text-md leading-relaxed">
          Pilih skema langganan otomatis bulanan. Sempurna untuk gamer aktif, reseller item game, 
          atau kolektor Fisch & Roblox Robux yang mendambakan bot instan dan harga grosir.
        </p>
      </div>

      {/* Pricing Options Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* FREE CARD */}
        <div className={`relative rounded-3xl p-6 bg-slate-900/60 border ${!isPremium ? 'border-teal-500 bg-slate-900/90 shadow-[0_0_20px_rgba(20,184,166,0.15)]' : 'border-slate-800'} overflow-hidden transition-all duration-300 flex flex-col justify-between`}>
          {!isPremium && (
            <div className="absolute top-0 right-0 bg-teal-500 text-slate-950 px-4 py-1.5 text-xs font-bold uppercase rounded-bl-2xl">
              Aktif Sekarang
            </div>
          )}
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Akun Standar</p>
              <h3 className="text-2xl font-bold text-white mt-1">Free Tier</h3>
              <p className="text-slate-500 text-xs mt-2 min-h-[32px]">Beli item kapan saja dengan harga eceran standar tanpa ikatan.</p>
            </div>
            
            <div className="flex items-baseline gap-1 py-2 border-y border-slate-800/80">
              <span className="text-3xl font-extrabold text-white">Rp 0</span>
              <span className="text-slate-500 text-xs font-medium">/ selamanya</span>
            </div>

            <ul className="space-y-3.5 text-sm">
              <li className="flex items-center gap-3 text-slate-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Akses seluruh Katalog Roblox & Fisch</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Metode Pembayaran Standar</span>
              </li>
              <li className="flex items-center gap-3 text-slate-500">
                <X className="w-4 h-4 text-rose-500 shrink-0" />
                <span className="line-through">Diskon VIP (2% - 10%) per produk</span>
              </li>
              <li className="flex items-center gap-3 text-slate-500">
                <X className="w-4 h-4 text-rose-500 shrink-0" />
                <span className="line-through">Bebas Biaya Admin (Admin Fee Waived)</span>
              </li>
              <li className="flex items-center gap-3 text-slate-500">
                <X className="w-4 h-4 text-rose-500 shrink-0" />
                <span className="line-through">Antrean VIP Bot (Instant prioritised queue)</span>
              </li>
            </ul>
          </div>

          <div className="mt-8">
            <button
              onClick={() => isPremium && handleSubscribe()}
              disabled={!isPremium}
              className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-300 border ${
                !isPremium
                  ? 'bg-slate-800 text-slate-400 border-transparent cursor-not-allowed'
                  : 'bg-transparent text-slate-300 border-slate-700 hover:border-slate-500 hover:text-white'
              }`}
            >
              {!isPremium ? 'Masa Aktif Aktif' : 'Turunkan ke Akun Gratis'}
            </button>
          </div>
        </div>

        {/* PREMIUM CARD */}
        <div className={`relative rounded-3xl p-6 bg-gradient-to-b ${isPremium ? 'from-indigo-950/80 to-slate-900 border-indigo-500 shadow-[0_0_35px_rgba(99,102,241,0.25)]' : 'from-slate-900/80 to-slate-950 border-slate-800'} border overflow-hidden transition-all duration-300 flex flex-col justify-between`}>
          {isPremium && (
            <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-4 py-1.5 text-xs font-bold uppercase rounded-bl-2xl flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-300 animate-bounce" /> Aktif VIP
            </div>
          )}
          
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold tracking-wider text-indigo-400 uppercase">SaaS Subscriber / Reseller</p>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded font-mono">RECOMMENDED</span>
              </div>
              <h3 className="text-2xl font-bold text-white mt-1">Premium VIP</h3>
              <p className="text-slate-400 text-xs mt-2 min-h-[32px]">Harga ter-murah se-Indonesia dengan antrean bot instan zero-delay.</p>
            </div>
            
            <div className="flex items-baseline gap-1 py-1 border-y border-slate-800/80">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200">Rp 29.000</span>
                  <span className="text-slate-400 text-xs font-medium">/ bulan</span>
                </div>
                <p className="text-[10px] text-emerald-400 font-mono mt-0.5">✔ Auto-renewal Aktif (GoPay / Card)</p>
              </div>
            </div>

            <ul className="space-y-3.5 text-sm">
              <li className="flex items-center gap-3 text-slate-200">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold text-emerald-300">Diskon VIP s.d 10% di setiap item Roblox & Fisch</span>
              </li>
              <li className="flex items-center gap-3 text-slate-200">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold text-indigo-300">FREE Admin Biaya (Semua Pembayaran Rp 0)</span>
              </li>
              <li className="flex items-center gap-3 text-slate-200">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Prioritas Bot Instant Delivery (Antrean VIP)</span>
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Fitur Notifikasi WhatsApp / Discord Instan</span>
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Poin Loyalitas Bulanan: +5,000 Poin</span>
              </li>
            </ul>
          </div>

          <div className="mt-8">
            <button
              onClick={handleSubscribe}
              className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-300 shadow-md ${
                isPremium
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/40'
                  : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90 animate-shimmer border-transparent'
              }`}
            >
              {isPremium ? 'Batalkan Berlangganan Auto-Renewal' : 'Berlangganan Premium Sekarang (Rp 29K)'}
            </button>
            <p className="text-[10px] text-center text-slate-500 mt-2">
              Layanan SaaS auto-charging bulanan. Dapat dibatalkan sewaktu-waktu.
            </p>
          </div>
        </div>
      </div>

      {/* Subscription Features Detail Table */}
      <div className="max-w-4xl mx-auto bg-slate-900/40 rounded-2xl border border-slate-800 p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Bot className="w-5 h-5 text-indigo-400" />
          Detail Perbedaan Akun Top-Up & Trading
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="py-3 px-4 text-xs font-semibold text-slate-400 mb-2">Fitur Utama</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-400 mb-2">Akun Gratisan (Free Tier)</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-400 mb-2">Akun Premium (SaaS Subscriber)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              <tr>
                <td className="py-3.5 px-4 font-medium text-slate-300">Harga Item & Robux</td>
                <td className="py-3.5 px-4 text-slate-500">Harga Standar Retail</td>
                <td className="py-3.5 px-4 text-emerald-400 font-semibold">Harga VIP (Potongan 2% - 10%)</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-medium text-slate-300">Biaya Administrasi</td>
                <td className="py-3.5 px-4 text-slate-500">Biaya penuh (Rp 1.000 - Rp 2.500)</td>
                <td className="py-3.5 px-4 text-indigo-400 font-semibold">Bebas Biaya (Rp 0 Admin Fee)</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-medium text-slate-300">Kecepatan Bot & Trading</td>
                <td className="py-3.5 px-4 text-slate-500">Standar (Mengikuti antrean normal)</td>
                <td className="py-3.5 px-4 text-emerald-400 font-semibold flex items-center gap-1">
                  <Zap className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
                  Kecepatan Utama & VIP Server Bot
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-medium text-slate-300">Metode Notifikasi</td>
                <td className="py-3.5 px-4 text-slate-500">Hanya Email / Riwayat Aplikasi</td>
                <td className="py-3.5 px-4 text-indigo-300">WhatsApp Gateway, Telegram, & Discord Bot</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-medium text-slate-300">Loyalty Cashback & Poin</td>
                <td className="py-3.5 px-4 text-slate-500">Tidak Ada</td>
                <td className="py-3.5 px-4 text-white">Mendapatkan Rp 5.000 saldo / 5.000 poin gratis bulanan</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-medium text-slate-300">Auto-Renewal (Langganan)</td>
                <td className="py-3.5 px-4 text-slate-500">N/A</td>
                <td className="py-3.5 px-4 text-slate-400">Recurring Payment otomatis via Token Gateway</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
