
export type BatteryBrand = 'GS' | 'Varta' | 'Đồng Nai' | 'Panasonic' | 'Exide';

export enum OrderStatus {
  NEW = 'Mới',
  ASSIGNED = 'Đã giao việc',
  EN_ROUTE = 'Đang đến',
  INSTALLING = 'Đang lắp',
  COMPLETED = 'Hoàn thành',
  PAID = 'Đã thanh toán'
}

export type CustomerTier = 'Bronze' | 'Silver' | 'Gold' | 'VIP';

export interface Battery {
  id: string;
  name: string;
  brand: BatteryBrand;
  capacity: string;
  stock: number;
  price: number;
  type: 'Car' | 'Motorbike';
}

export interface KTV {
  id: string;
  name: string;
  phone: string;
  status: 'Available' | 'Busy';
}

export interface Order {
  id: string;
  customerName: string;
  address: string;
  batteryId: string;
  quantity: number;
  ktvId?: string;
  status: OrderStatus;
  totalAmount: number;
  discountAmount: number;
  createdAt: Date;
  paidAmount: number;
}

export interface Customer {
  id: string;
  name: string;
  type: 'retail' | 'agent';
  tier: CustomerTier;
  totalDebt: number;
  creditLimit: number;
  lastOrderDate: Date;
  phone: string;
  monthlyQuantity: number; 
  debtSince: Date | null; // Ngày bắt đầu kỳ công nợ
}

export interface DiscountPolicy {
  minQuantity: number;
  discountPercent: number;
}
