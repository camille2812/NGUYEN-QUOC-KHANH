
import { Battery, KTV, Order, OrderStatus, Customer, DiscountPolicy, BatteryBrand } from './types';

export const BATTERY_BRANDS: BatteryBrand[] = ['GS', 'Varta', 'Đồng Nai', 'Panasonic', 'Exide'];

export const MOCK_BATTERIES: Battery[] = [
  { id: 'b1', name: 'GS Platinum GTZ5V', brand: 'GS', capacity: '5Ah', stock: 45, price: 350000, type: 'Motorbike' },
  { id: 'b2', name: 'Varta Silver Dynamic', brand: 'Varta', capacity: '75Ah', stock: 12, price: 2850000, type: 'Car' },
  { id: 'b3', name: 'Đồng Nai Pinaco N100', brand: 'Đồng Nai', capacity: '100Ah', stock: 8, price: 1950000, type: 'Car' },
  { id: 'b4', name: 'GS MF 80D26L', brand: 'GS', capacity: '70Ah', stock: 15, price: 1800000, type: 'Car' },
  { id: 'b5', name: 'Panasonic Blue Battery', brand: 'Panasonic', capacity: '45Ah', stock: 20, price: 1450000, type: 'Car' },
];

export const MOCK_KTVS: KTV[] = [
  { id: 'k1', name: 'Nguyễn Văn A', phone: '0901234567', status: 'Available' },
  { id: 'k2', name: 'Trần Văn B', phone: '0907654321', status: 'Available' },
  { id: 'k3', name: 'Lê Văn C', phone: '0911223344', status: 'Busy' },
];

export const MOCK_INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-001',
    customerName: 'Anh Hoàng - Quận 1',
    address: '123 Lê Lợi, Phường Bến Thành, Quận 1',
    batteryId: 'b2',
    quantity: 1,
    status: OrderStatus.NEW,
    totalAmount: 2850000,
    discountAmount: 0,
    createdAt: new Date(),
    paidAmount: 0
  },
  {
    id: 'ord-002',
    customerName: 'Gara Ô tô Thành Phát',
    address: '45/12 Xô Viết Nghệ Tĩnh, Bình Thạnh',
    batteryId: 'b1',
    quantity: 10,
    status: OrderStatus.ASSIGNED,
    ktvId: 'k1',
    totalAmount: 3325000, // 350k * 10 * 0.95 (5% discount)
    discountAmount: 175000,
    createdAt: new Date(),
    paidAmount: 0
  }
];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Gara Ô tô Thành Phát', type: 'agent', tier: 'Gold', totalDebt: 15400000, creditLimit: 50000000, lastOrderDate: new Date(), phone: '0988123456', monthlyQuantity: 35, debtSince: new Date(new Date().setDate(new Date().getDate() - 45)) }, // Nợ quá hạn
  { id: 'c2', name: 'Taxi Group Xanh', type: 'agent', tier: 'VIP', totalDebt: 8200000, creditLimit: 100000000, lastOrderDate: new Date(), phone: '0977222333', monthlyQuantity: 62, debtSince: new Date(new Date().setDate(new Date().getDate() - 25)) }, // Nợ trong hạn
  { id: 'c3', name: 'Đại lý Xe Máy Hòa Bình', type: 'agent', tier: 'Silver', totalDebt: 0, creditLimit: 20000000, lastOrderDate: new Date(), phone: '0966444555', monthlyQuantity: 12, debtSince: null }, // Không nợ
  { id: 'c4', name: 'Anh Hoàng - Quận 1', type: 'retail', tier: 'Bronze', totalDebt: 0, creditLimit: 0, lastOrderDate: new Date(), phone: '0911555666', monthlyQuantity: 1, debtSince: null },
];

export const QUANTITY_DISCOUNTS: DiscountPolicy[] = [
  { minQuantity: 50, discountPercent: 12 },
  { minQuantity: 20, discountPercent: 8 },
  { minQuantity: 10, discountPercent: 5 },
  { minQuantity: 5, discountPercent: 2 },
];
