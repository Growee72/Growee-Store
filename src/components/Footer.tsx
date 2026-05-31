import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';
import groweeLogo from '../assets/images/growee_logo_1780212815449.png';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-900 mt-16 px-4 py-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* UPPER ROW */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-900 pb-6">
          <div className="flex items-center gap-2">
            <img 
              src={groweeLogo} 
              alt="Growee Store Logo" 
              className="w-5 h-5 rounded-md object-cover opacity-80"
              referrerPolicy="no-referrer"
            />
            <span className="font-extrabold text-white">Growee Store Inc.</span>
            <span className="text-slate-600">|</span>
            <span>Platform SaaS Top-up Otomatis Terpercaya</span>
          </div>

          <div className="flex items-center gap-4 text-[10px]">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Roblox Secure Trading certified
            </span>
            <span>•</span>
            <span className="text-emerald-400 font-mono">● All Delivery Bots: ONLINE</span>
          </div>
        </div>

        {/* BOTTOM ROW (Disclaimers) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] leading-relaxed text-slate-500">
          <p>
            <strong>Disclaimer Game Roblox:</strong> Growee Store adalah portal SaaS independen penyedia otomatisasi bot trading dan tidak berafiliasi maupun didukung secara resmi oleh Roblox Corporation maupun pembuat map Fisch secara langsung. Nama game, nama item, dan merek dagang adalah sepenuhnya hak milik masing-masing pengembang.
          </p>
          <div className="md:text-right space-y-1">
            <p>&copy; {new Date().getFullYear()} Growee Store. Seluruh hak cipta dilindungi undang-undang.</p>
            <p className="flex items-center justify-end gap-1 text-[10px] text-slate-600">
              SaaS Marketplace crafted securely with <Heart className="w-3 h-3 text-rose-500" /> for Roblox Gamers.
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};
