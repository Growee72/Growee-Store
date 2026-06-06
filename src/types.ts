export type ItemCategory = 'Robux' | 'Fisch' | 'Blox Fruits' | 'Pet Simulator X';

export interface GameProduct {
  id: string;
  category: ItemCategory;
  name: string;
  description: string;
  price: number; // in IDR
  originalPrice: number;
  stock: number;
  deliveryType: 'Automatic Bot' | 'Instant Gamepass' | 'Secure Trading Server' | 'Group Funds';
  imagePlaceholder: string; // Describes the color/motif for SVG rendering
  badge?: string;
  vipPriceDiscount: number; // percentage (e.g. 5 means 5% off)
  status?: 'Pending' | 'Active' | 'Rejected'; // Approval system status
  addedBy?: string; // e.g. "Admin Rian" or "System Preset"
  rejectionReason?: string; // Reason for rejection
  isPro?: boolean; // If prioritised / created by a Seller PRO
}

export interface UserAccount {
  id: string;
  username: string;
  email: string;
  role: 'developer' | 'admin' | 'buyer';
  status: 'Active' | 'Banned';
  createdAt: string;
  lastLogin: string;
  isPro?: boolean; // For Admin / Seller PRO subscripton status (Rp 49.000/month)
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  role: 'developer' | 'admin' | 'buyer';
  action: string;
  details?: string;
  type: 'info' | 'success' | 'warning' | 'danger';
}

export interface BotLog {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'bot';
}

export type OrderStatus = 'PENDING_PAYMENT' | 'PAYING' | 'PROCESSING_BOT' | 'DELIVERING' | 'COMPLETED' | 'FAILED';

export interface ActiveOrder {
  id: string;
  product: GameProduct;
  robloxUsername: string;
  paymentMethod: string;
  baseAmount: number;
  adminFee: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  logs: BotLog[];
  botQueuePosition: number;
  gamepassId?: string; // If Robux gamepass
}

export interface SubscriptionState {
  tier: 'free' | 'premium';
  price: number;
  autoRenewal: boolean;
  nextRenewalDate: string;
  paymentMethodTokenText: string;
  activatedAt?: string;
}

export interface SellerDashboardStats {
  storeName: string;
  totalRevenue: number;
  walletBalance: number;
  ordersCount: number;
  activeBots: number;
  botStatus: 'ONLINE' | 'MAINTENANCE' | 'OFFLINE';
  inventorySize: number;
  monthlySaaSFee: number;
}
