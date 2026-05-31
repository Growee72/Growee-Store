import React from 'react';
import { Sparkles, Flame, LogOut, Shield, User } from 'lucide-react';
import { SubscriptionState, UserAccount } from '../types';
import groweeLogo from '../assets/images/growee_logo_1780212815449.png';

interface HeaderProps {
  currentTab: 'buyer' | 'saas' | 'seller' | 'growth' | 'admin' | 'developer';
  onTabChange: (tab: 'buyer' | 'saas' | 'seller' | 'growth' | 'admin' | 'developer') => void;
  subscription: SubscriptionState;
  currentUser: UserAccount | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  subscription,
  currentUser,
  onLogout,
}) => {
  const isPremium = subscription.tier === 'premium';

  // Determine if tabs are allowed
  const canSeeBuyer = !currentUser || currentUser.role === 'buyer' || currentUser.role === 'developer';
  const canSeeAdmin = currentUser && (currentUser.role === 'admin' || currentUser.role === 'developer');
  const canSeeDeveloper = currentUser && currentUser.role === 'developer';

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* LOGO & TITLE */}
        <div className="flex items-center gap-2.5 shrink-0">
          <img 
            src={groweeLogo} 
            alt="Growee Store Logo" 
            className="w-10 h-10 rounded-xl object-cover border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)] animate-pulse" 
            referrerPolicy="no-referrer"
          />
          <div className="text-left font-sans">
            <div className="flex items-center gap-1.5">
              <h1 className="text-md font-extrabold tracking-tight text-white m-0 leading-tight">
                Growee Store
              </h1>
              <span className="text-[8px] bg-indigo-500/15 text-indigo-400 border border-indigo-505/20 px-1 py-0.5 rounded font-mono font-bold tracking-wide">
                SAAS V3.8
              </span>
            </div>
            <p className="text-[9px] text-slate-500 font-medium m-0">Auto Top-Up & Trading Bots Hub</p>
          </div>
        </div>

        {/* INTERACTIVE NAVIGATION TABS BASED ON ROLE */}
        {currentUser && (
          <nav className="flex flex-wrap items-center justify-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80">
            {canSeeBuyer && (
              <>
                <button
                  onClick={() => onTabChange('buyer')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentTab === 'buyer'
                      ? 'bg-slate-950 text-white shadow border border-slate-800/80'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🛒 Marketplace Game
                </button>
                
                <button
                  onClick={() => onTabChange('saas')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentTab === 'saas'
                      ? 'bg-slate-950 text-white shadow border border-slate-800/80'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  💎 SaaS Premium Plan
                </button>

                <button
                  onClick={() => onTabChange('seller')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentTab === 'seller'
                      ? 'bg-slate-950 text-white shadow border border-slate-800/80'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🏢 Console Merchant
                </button>

                <button
                  onClick={() => onTabChange('growth')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentTab === 'growth'
                      ? 'bg-slate-950 text-white shadow border border-slate-800/80'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  📈 Game Analytics
                </button>
              </>
            )}

            {canSeeAdmin && (
              <button
                onClick={() => onTabChange('admin')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentTab === 'admin'
                    ? 'bg-slate-950 text-sky-300 shadow border border-slate-850'
                    : 'text-slate-400 hover:text-slate-250'
                }`}
              >
                📦 Admin Supply
              </button>
            )}

            {canSeeDeveloper && (
              <button
                onClick={() => onTabChange('developer')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentTab === 'developer'
                    ? 'bg-slate-950 text-amber-300 shadow border border-slate-850'
                    : 'text-slate-400 hover:text-slate-250'
                }`}
              >
                🛡️ Developer Board
              </button>
            )}
          </nav>
        )}

        {/* PROFILE CHIP AND LOGOUT */}
        <div className="flex items-center gap-3 shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-2 bg-slate-950 p-1.5 px-3 rounded-2xl border border-slate-850 text-left">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-white max-w-[100px] truncate block">{currentUser.username}</span>
                  <span className={`text-[9px] px-1 py-0.2 rounded font-bold uppercase font-mono ${
                    currentUser.role === 'developer' 
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-500/30' 
                      : currentUser.role === 'admin'
                      ? 'bg-sky-400/20 text-sky-300 border border-sky-500/30'
                      : 'bg-emerald-400/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {currentUser.role}
                  </span>
                </div>
                <p className="text-[9px] text-slate-500 m-0 font-mono italic">Status: {currentUser.status}</p>
              </div>

              {/* LOGOUT BUTTON */}
              <button
                onClick={onLogout}
                title="Keluar Akun"
                className="ml-2 w-7.5 h-7.5 rounded-lg bg-rose-500/10 text-rose-450 hover:bg-rose-500 hover:text-white transition cursor-pointer flex items-center justify-center border border-rose-500/20"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-full px-3 py-1 text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>Autentikasi Terkunci</span>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
