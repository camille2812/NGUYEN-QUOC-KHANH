
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  CircleDollarSign, 
  X, 
  UserCircle, 
  ArrowLeftRight,
  Plus,
  Bell,
  Search,
  CheckCircle2,
  Clock,
  Navigation,
  Wrench,
  QrCode,
  DollarSign,
  User,
  MapPin,
  Tag,
  ShieldAlert,
  TrendingDown,
  Users,
  History as HistoryIcon,
  Save,
  Trash2,
  Settings,
  Target,
  AlertTriangle,
  Edit
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { 
  Battery, 
  KTV, 
  Order, 
  OrderStatus, 
  Customer,
  DiscountPolicy,
  BatteryBrand
} from './types';
import { 
  MOCK_BATTERIES, 
  MOCK_KTVS, 
  MOCK_INITIAL_ORDERS, 
  MOCK_CUSTOMERS,
  QUANTITY_DISCOUNTS as INITIAL_POLICIES,
  BATTERY_BRANDS
} from './constants';

const DEBT_LIMIT_DAYS = 30;

// --- UTILS ---
const calculateDebtDays = (debtSince: Date | null): number => {
  if (!debtSince) return 0;
  return Math.floor((new Date().getTime() - new Date(debtSince).getTime()) / (1000 * 3600 * 24));
};


// --- ADMIN COMPONENTS ---

const InventoryModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (battery: Battery) => void;
  batteryToEdit: Battery | null;
}> = ({ isOpen, onClose, onSave, batteryToEdit }) => {
  const [battery, setBattery] = useState<Omit<Battery, 'id' | 'type'>>({
    name: '', brand: 'GS', capacity: '', price: 0, stock: 0
  });

  useEffect(() => {
    if (batteryToEdit) {
      setBattery(batteryToEdit);
    } else {
      setBattery({ name: '', brand: 'GS', capacity: '', price: 0, stock: 0 });
    }
  }, [batteryToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof typeof battery, value: string | number | BatteryBrand) => {
    setBattery(prev => ({...prev, [field]: value}));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalBattery: Battery = {
      ...battery,
      id: batteryToEdit?.id || `b-${Date.now()}`,
      type: 'Car', // Default or determine logic
    };
    onSave(finalBattery);
  };
  
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-slate-700 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Package className="text-green-500" /> {batteryToEdit ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
          </h3>
          <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:text-white"><X size={20} /></button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-400">Tên sản phẩm</label>
            <input required value={battery.name} onChange={e => handleChange('name', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400">Thương hiệu</label>
            <select value={battery.brand} onChange={e => handleChange('brand', e.target.value as BatteryBrand)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-green-500">
              {BATTERY_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400">Dung lượng (Ah)</label>
            <input required value={battery.capacity} onChange={e => handleChange('capacity', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400">Giá bán (đ)</label>
            <input required type="number" value={battery.price} onChange={e => handleChange('price', parseInt(e.target.value) || 0)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400">Tồn kho</label>
            <input required type="number" value={battery.stock} onChange={e => handleChange('stock', parseInt(e.target.value) || 0)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500" />
          </div>
        </div>
        <div className="p-4 bg-slate-900/50">
          <button type="submit" className="w-full bg-green-600 hover:bg-green-500 text-black font-black py-3 rounded-xl flex items-center justify-center gap-2">
            <Save size={18} /> {batteryToEdit ? 'Lưu thay đổi' : 'Thêm vào kho'}
          </button>
        </div>
      </form>
    </div>
  );
};


const PolicyModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  policies: DiscountPolicy[];
  onUpdate: (policies: DiscountPolicy[]) => void;
}> = ({ isOpen, onClose, policies, onUpdate }) => {
  const [localPolicies, setLocalPolicies] = useState(policies);

  if (!isOpen) return null;

  const addRow = () => setLocalPolicies([...localPolicies, { minQuantity: 0, discountPercent: 0 }]);
  const removeRow = (index: number) => setLocalPolicies(localPolicies.filter((_, i) => i !== index));
  const updateRow = (index: number, field: keyof DiscountPolicy, value: number) => {
    const next = [...localPolicies];
    next[index] = { ...next[index], [field]: value };
    setLocalPolicies(next);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-slate-700 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Settings className="text-green-500" size={20} /> Cấu hình chiết khấu
          </h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-400 italic">Thiết lập chiết khấu tự động dựa trên tổng sản lượng tích lũy trong tháng của Đại lý.</p>
          <div className="space-y-3">
            {localPolicies.sort((a,b) => b.minQuantity - a.minQuantity).map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex-1 bg-slate-900 border border-slate-700 rounded-lg flex items-center px-3">
                  <span className="text-[10px] text-slate-500 font-bold mr-2">MỨC SL ≥</span>
                  <input 
                    type="number" 
                    value={p.minQuantity} 
                    onChange={(e) => updateRow(i, 'minQuantity', parseInt(e.target.value) || 0)}
                    className="bg-transparent w-full py-2 text-sm outline-none text-white"
                  />
                </div>
                <div className="flex-1 bg-slate-900 border border-slate-700 rounded-lg flex items-center px-3">
                  <span className="text-[10px] text-slate-500 font-bold mr-2">% GIẢM</span>
                  <input 
                    type="number" 
                    value={p.discountPercent} 
                    onChange={(e) => updateRow(i, 'discountPercent', parseInt(e.target.value) || 0)}
                    className="bg-transparent w-full py-2 text-sm outline-none text-green-500 font-bold"
                  />
                </div>
                <button onClick={() => removeRow(i)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
          <button onClick={addRow} className="w-full py-2 border-2 border-dashed border-slate-700 rounded-xl text-slate-500 text-xs font-bold hover:border-green-500 hover:text-green-500 transition-colors">
            + Thêm hạn mức mới
          </button>
          <button 
            onClick={() => { onUpdate(localPolicies); onClose(); }}
            className="w-full bg-green-600 hover:bg-green-500 text-black font-black py-3 rounded-xl mt-4 flex items-center justify-center gap-2"
          >
            <Save size={18} /> Lưu cấu hình
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminHistory: React.FC<{ orders: Order[] }> = ({ orders }) => {
  const completedOrders = orders.filter(o => o.status === OrderStatus.PAID);
  const totalRev = completedOrders.reduce((s, o) => s + o.paidAmount, 0);
  const totalDiscount = completedOrders.reduce((s, o) => s + o.discountAmount, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 border-l-4 border-l-green-500">
          <p className="text-slate-400 text-sm">Doanh thu đã thu</p>
          <h3 className="text-3xl font-black text-white mt-1">{totalRev.toLocaleString()} đ</h3>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 border-l-4 border-l-yellow-500">
          <p className="text-slate-400 text-sm">Tổng chiết khấu đã tặng</p>
          <h3 className="text-3xl font-black text-white mt-1">{totalDiscount.toLocaleString()} đ</h3>
        </div>
      </div>
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
            <tr>
              <th className="px-6 py-4">Ngày</th>
              <th className="px-6 py-4">Mã đơn</th>
              <th className="px-6 py-4">Khách hàng</th>
              <th className="px-6 py-4">Số lượng</th>
              <th className="px-6 py-4 text-right">Thực thu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {completedOrders.map(o => (
              <tr key={o.id} className="text-sm text-slate-300 hover:bg-slate-750 transition-colors">
                <td className="px-6 py-4">{new Date(o.createdAt).toLocaleDateString('vi-VN')}</td>
                <td className="px-6 py-4 font-mono text-xs text-green-500 uppercase">{o.id}</td>
                <td className="px-6 py-4 font-bold text-white">{o.customerName}</td>
                <td className="px-6 py-4">{o.quantity} bình</td>
                <td className="px-6 py-4 text-right font-black text-green-500">{o.paidAmount.toLocaleString()} đ</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const OrderModal: React.FC<{ 
  isOpen: boolean, 
  onClose: () => void, 
  onSave: (order: Order, isAgentOrder: boolean) => void,
  batteries: Battery[],
  customers: Customer[],
  ktvs: KTV[],
  policies: DiscountPolicy[]
}> = ({ isOpen, onClose, onSave, batteries, customers, ktvs, policies }) => {
  const [customerType, setCustomerType] = useState<'retail' | 'agent'>('retail');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [selectedBatteryId, setSelectedBatteryId] = useState(batteries[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const [selectedKtvId, setSelectedKtvId] = useState('');

  if (!isOpen) return null;

  const selectedBattery = batteries.find(b => b.id === selectedBatteryId);
  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
  
  const totalExpectedQuantity = (selectedCustomer?.monthlyQuantity || 0) + quantity;
  const discountPolicy = policies
    .sort((a,b) => b.minQuantity - a.minQuantity)
    .find(p => totalExpectedQuantity >= p.minQuantity);
  
  const discountPercent = discountPolicy ? discountPolicy.discountPercent : 0;
  
  const baseSubtotal = (selectedBattery?.price || 0) * quantity;
  const discountAmount = Math.round(baseSubtotal * (discountPercent / 100));
  const finalTotal = baseSubtotal - discountAmount;

  const debtDays = selectedCustomer ? calculateDebtDays(selectedCustomer.debtSince) : 0;
  const isDebtOverdue = debtDays > DEBT_LIMIT_DAYS;
  const isOverLimit = customerType === 'agent' && selectedCustomer && (selectedCustomer.totalDebt + finalTotal > selectedCustomer.creditLimit);
  const canSubmit = !((isOverLimit || isDebtOverdue) && customerType === 'agent');

  const getButtonText = () => {
    if (customerType === 'agent') {
      if (isOverLimit) return 'Quá hạn mức';
      if (isDebtOverdue) return 'Nợ quá hạn';
      return 'Xác nhận công nợ & Giao hàng';
    }
    if (selectedKtvId) {
        return 'Giao việc & Tạo đơn';
    }
    return 'Lưu & Chờ phân công';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    const isAgentOrder = customerType === 'agent';
    const finalName = isAgentOrder ? selectedCustomer?.name || '' : customerName;
    const isRetailWithKtv = !isAgentOrder && selectedKtvId;

    const newOrder: Order = {
      id: `ORD-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      customerName: finalName, address, batteryId: selectedBatteryId, quantity,
      ktvId: isRetailWithKtv ? selectedKtvId : undefined,
      status: isAgentOrder 
        ? OrderStatus.COMPLETED 
        : isRetailWithKtv
          ? OrderStatus.ASSIGNED
          : OrderStatus.NEW,
      totalAmount: finalTotal, discountAmount,
      createdAt: new Date(), paidAmount: 0
    };
    onSave(newOrder, isAgentOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Plus className="text-green-500" /> Tạo đơn hàng thông minh
          </h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700">
            <button type="button" onClick={() => { setCustomerType('retail'); setSelectedCustomerId(''); setSelectedKtvId(''); }}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${customerType === 'retail' ? 'bg-green-600 text-black shadow-lg' : 'text-slate-400'}`}>
              Khách lẻ
            </button>
            <button type="button" onClick={() => setCustomerType('agent')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${customerType === 'agent' ? 'bg-green-600 text-black shadow-lg' : 'text-slate-400'}`}>
              Đại lý / Giao sỉ
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              {customerType === 'agent' ? (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><User size={14} /> Chọn đại lý</label>
                  <select required value={selectedCustomerId} onChange={(e) => setSelectedCustomerId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors appearance-none">
                    <option value="">-- Danh sách đại lý --</option>
                    {customers.filter(c => c.type === 'agent').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  {selectedCustomer && <p className="text-[10px] text-green-500 font-bold">Tích lũy tháng: {selectedCustomer.monthlyQuantity} bình</p>}
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><User size={14} /> Tên khách hàng</label>
                  <input required type="text" placeholder="Nhập tên..." value={customerName} onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors"/>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><MapPin size={14} /> Địa chỉ</label>
                <input required type="text" placeholder="Giao tại..." value={address} onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors"/>
              </div>
               {customerType === 'retail' && (
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><Truck size={14}/> Phân công KTV (Tùy chọn)</label>
                    <select value={selectedKtvId} onChange={e => setSelectedKtvId(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors appearance-none">
                        <option value="">-- Chọn sau khi tạo đơn --</option>
                        {ktvs.map(k => (
                            <option key={k.id} value={k.id} disabled={k.status === 'Busy'} className={k.status === 'Busy' ? 'text-red-500' : 'text-green-400'}>
                                {k.name} - {k.status === 'Available' ? '🟢 Rảnh' : '🔴 Bận'}
                            </option>
                        ))}
                    </select>
                 </div>
               )}
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><Tag size={14} /> Loại ắc quy</label>
                <select value={selectedBatteryId} onChange={(e) => setSelectedBatteryId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors appearance-none">
                  {batteries.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">Số lượng</label>
                <div className="flex gap-2">
                  <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors"/>
                  {discountPercent > 0 && <div className="bg-green-600/20 text-green-500 px-3 flex items-center rounded-xl font-bold animate-pulse">-{discountPercent}%</div>}
                </div>
              </div>
            </div>
          </div>
          
          {isOverLimit && <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-xl flex items-center gap-3 text-red-500 text-sm"><ShieldAlert size={20} /><p><b>Cảnh báo:</b> Vượt hạn mức công nợ ({selectedCustomer?.creditLimit.toLocaleString()}đ)</p></div>}
          {isDebtOverdue && <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-xl flex items-center gap-3 text-red-500 text-sm"><AlertTriangle size={20} /><p><b>Cảnh báo:</b> Khách hàng có công nợ quá hạn ({debtDays} ngày)</p></div>}

          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-700/50 space-y-1">
            <div className="flex justify-between text-slate-500 text-xs"><span>Giá gốc</span><span>{baseSubtotal.toLocaleString()} đ</span></div>
            {discountAmount > 0 && <div className="flex justify-between text-green-500 text-xs font-medium"><span className="flex items-center gap-1"><TrendingDown size={12}/> Chiết khấu</span><span>-{discountAmount.toLocaleString()} đ</span></div>}
            <div className="h-px bg-slate-800 my-2"></div>
            <div className="flex justify-between items-center"><span className="text-white font-bold">Tổng thanh toán</span><span className="text-2xl font-black text-green-500">{finalTotal.toLocaleString()} đ</span></div>
          </div>
          <button type="submit" disabled={!canSubmit}
            className={`w-full font-black py-4 rounded-xl shadow-lg transition-all active:scale-95 ${!canSubmit ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500 text-black shadow-green-500/20'}`}>
            {getButtonText()}
          </button>
        </form>
      </div>
    </div>
  );
};

const AdminCRM: React.FC<{ customers: Customer[], onConfig: () => void, policies: DiscountPolicy[] }> = ({ customers, onConfig, policies }) => {
  const maxTarget = policies.sort((a,b) => b.minQuantity - a.minQuantity)[0]?.minQuantity || 100;

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
          <h3 className="text-lg font-semibold text-white">Quản lý CRM & Công nợ</h3>
          <button onClick={onConfig} className="text-sm bg-green-600/10 hover:bg-green-600/20 px-3 py-1.5 rounded-lg text-green-500 font-bold transition-colors flex items-center gap-2">
            <Settings size={16} /> Cấu hình chính sách
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-900 text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Khách hàng</th>
                <th className="px-6 py-4">Sản lượng tháng</th>
                <th className="px-6 py-4">Dư nợ</th>
                <th className="px-6 py-4">Thời gian nợ</th>
                <th className="px-6 py-4">Tiến độ thưởng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700 text-slate-300">
              {customers.map((c) => {
                const debtDays = calculateDebtDays(c.debtSince);
                const isOverdue = debtDays > DEBT_LIMIT_DAYS;
                const targetRatio = (c.monthlyQuantity / maxTarget) * 100;
                return (
                  <tr key={c.id} className="hover:bg-slate-750 transition-colors">
                    <td className="px-6 py-4"><div><p className="font-medium text-white">{c.name}</p><p className="text-xs text-slate-500">{c.phone}</p></div></td>
                    <td className="px-6 py-4"><div className="flex items-center gap-2"><Target size={14} className="text-green-500" /><span className="font-bold text-white">{c.monthlyQuantity}</span></div></td>
                    <td className="px-6 py-4"><p className="font-bold text-sm text-slate-300">{c.totalDebt.toLocaleString()} đ</p><p className="text-[10px] text-slate-500">HM: {c.creditLimit.toLocaleString()}</p></td>
                    <td className="px-6 py-4">
                      {c.totalDebt > 0 ? (
                        <div className={`flex items-center gap-2 text-xs font-bold ${isOverdue ? 'text-red-500' : 'text-slate-400'}`}>
                          {isOverdue && <AlertTriangle size={14} />}
                          <span>{debtDays} ngày</span>
                        </div>
                      ) : <span className="text-xs text-slate-500 italic">Không nợ</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-full bg-slate-900 rounded-full h-2 max-w-[120px]"><div className={`h-full bg-green-500`} style={{ width: `${Math.min(100, targetRatio)}%` }}></div></div>
                      <p className="text-[10px] text-slate-400 mt-1">Mức kế: {policies.sort((a,b)=>a.minQuantity-b.minQuantity).find(p=>p.minQuantity > c.monthlyQuantity)?.minQuantity || 'Max'}</p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC<{ orders: Order[], batteries: Battery[], customers: Customer[] }> = ({ orders, batteries, customers }) => {
  const totalRevenue = orders.reduce((sum, o) => sum + o.paidAmount, 0);
  const totalStock = batteries.reduce((sum, b) => sum + b.stock, 0);
  const totalDebt = customers.reduce((sum, d) => sum + d.totalDebt, 0);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Doanh thu', value: totalRevenue.toLocaleString() + ' đ', icon: DollarSign, color: 'text-green-500' },
          { label: 'Đơn hàng mới', value: orders.filter(o => o.status === OrderStatus.NEW).length, icon: Bell, color: 'text-blue-500' },
          { label: 'Tồn kho', value: totalStock + ' bình', icon: Package, color: 'text-yellow-500' },
          { label: 'Công nợ (CRM)', value: totalDebt.toLocaleString() + ' đ', icon: CircleDollarSign, color: 'text-red-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm">
            <div className="flex justify-between items-start">
              <div><p className="text-slate-400 text-sm font-medium">{stat.label}</p><h3 className="text-2xl font-bold mt-1 text-white">{stat.value}</h3></div>
              <div className={`p-2 rounded-lg bg-slate-900 ${stat.color}`}><stat.icon size={24} /></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminInventory: React.FC<{ 
  batteries: Battery[],
  onAdd: () => void,
  onEdit: (battery: Battery) => void
}> = ({ batteries, onAdd, onEdit }) => {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-700 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Quản lý Kho hàng</h3>
        <button onClick={onAdd} className="bg-green-600 text-black px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2">
          <Plus size={16} /> Thêm sản phẩm
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-900 text-slate-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Sản phẩm</th>
              <th className="px-6 py-4">Hãng</th>
              <th className="px-6 py-4">Tồn kho</th>
              <th className="px-6 py-4">Giá bán</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700 text-slate-300">
            {batteries.map((b) => (
              <tr key={b.id} className="hover:bg-slate-750 transition-colors">
                <td className="px-6 py-4 font-medium text-white">{b.name}</td>
                <td className="px-6 py-4">{b.brand}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${b.stock < 10 ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>{b.stock}</span>
                </td>
                <td className="px-6 py-4 font-mono">{b.price.toLocaleString()} đ</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => onEdit(b)} className="p-2 text-slate-400 hover:text-white"><Edit size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminOrders: React.FC<{ 
  orders: Order[], 
  ktvs: KTV[], 
  customers: Customer[],
  onAssign: (orderId: string, ktvId: string) => void 
}> = ({ orders, ktvs, customers, onAssign }) => {
  const pendingOrders = orders.filter(o => {
    const customer = customers.find(c => c.name === o.customerName);
    return customer?.type === 'retail' && o.status !== OrderStatus.PAID;
  });

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-700"><h3 className="text-lg font-semibold text-white">Lịch trình đang xử lý</h3></div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-900 text-slate-400 text-xs uppercase tracking-wider">
            <tr><th className="px-6 py-4">Mã đơn</th><th className="px-6 py-4">Khách hàng</th><th className="px-6 py-4">Trạng thái</th><th className="px-6 py-4">KTV</th><th className="px-6 py-4 text-right">Giá trị</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-700 text-slate-300">
            {pendingOrders.map((o) => (
              <tr key={o.id} className="hover:bg-slate-750 transition-colors text-sm">
                <td className="px-6 py-4 font-mono text-green-500 uppercase">{o.id}</td>
                <td className="px-6 py-4 font-bold text-white">{o.customerName}</td>
                <td className="px-6 py-4"><span className="px-2 py-1 rounded-full text-[10px] bg-slate-700 font-bold uppercase">{o.status}</span></td>
                <td className="px-6 py-4">
                  {o.ktvId ? ktvs.find(k => k.id === o.ktvId)?.name : (
                    <select onChange={(e) => onAssign(o.id, e.target.value)} className="bg-slate-900 border border-slate-700 rounded p-1 text-xs outline-none focus:border-green-500">
                      <option value="">-- Phân công --</option>
                      {ktvs.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
                    </select>
                  )}
                </td>
                <td className="px-6 py-4 text-right font-bold text-white">{o.totalAmount.toLocaleString()} đ</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


// --- KTV APP COMPONENT ---

const KTVApp: React.FC<{ 
  orders: Order[], 
  currentKtvId: string, 
  batteries: Battery[],
  onUpdateStatus: (orderId: string, nextStatus: OrderStatus) => void,
  onConfirmPayment: (orderId: string) => void
}> = ({ orders, currentKtvId, batteries, onUpdateStatus, onConfirmPayment }) => {
  const [activeKtvTab, setActiveKtvTab] = useState<'tasks' | 'history'>('tasks');
  const myPending = orders.filter(o => o.ktvId === currentKtvId && o.status !== OrderStatus.PAID);
  const myHistory = orders.filter(o => o.ktvId === currentKtvId && o.status === OrderStatus.PAID);
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showQR, setShowQR] = useState(false);

  const getStatusAction = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.ASSIGNED: return { label: 'Bắt đầu đi', next: OrderStatus.EN_ROUTE, icon: Navigation };
      case OrderStatus.EN_ROUTE: return { label: 'Đã đến nơi', next: OrderStatus.INSTALLING, icon: Truck };
      case OrderStatus.INSTALLING: return { label: 'Lắp đặt xong', next: OrderStatus.COMPLETED, icon: Wrench };
      case OrderStatus.COMPLETED: return { label: 'Thanh toán', next: null, icon: QrCode };
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-black text-white">
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md p-4 border-b border-green-500/30 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center font-bold text-black uppercase">KTV</div>
          <div><h2 className="text-sm font-bold">Battery Pro Mobile</h2><p className="text-[10px] text-green-500 uppercase font-semibold">Technician</p></div>
        </div>
        <button className="p-2 text-slate-400"><Bell size={20} /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeKtvTab === 'tasks' ? (
          <>
            <h3 className="text-lg font-bold">Nhiệm vụ mới ({myPending.length})</h3>
            {myPending.length === 0 ? <div className="text-center py-20 text-slate-600 font-bold">Chưa có đơn hàng nào...</div> : (
              myPending.map(order => {
                const action = getStatusAction(order.status);
                const battery = batteries.find(b => b.id === order.batteryId);
                return (
                  <div key={order.id} className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1"><p className="text-[10px] text-slate-500 font-bold uppercase">Khách hàng</p><h4 className="font-bold text-lg">{order.customerName}</h4></div>
                      <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-green-600 text-black uppercase">{order.status}</span>
                    </div>
                    <div className="space-y-3 py-2 border-y border-slate-800">
                      <div className="flex items-start gap-3"><Navigation size={16} className="text-green-500 mt-1 shrink-0" /><p className="text-xs text-slate-400">{order.address}</p></div>
                      <div className="flex items-start gap-3"><Package size={16} className="text-green-500 mt-1 shrink-0" /><p className="text-xs text-white font-medium">{order.quantity}x {battery?.name}</p></div>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <div className="text-xs"><p className="text-slate-500">Thực thu</p><p className="font-bold text-green-400 text-lg">{order.totalAmount.toLocaleString()} đ</p></div>
                      {action && (
                        <button onClick={() => action.next ? onUpdateStatus(order.id, action.next) : (setSelectedOrder(order), setShowQR(true))} className="bg-green-600 hover:bg-green-500 text-black font-bold px-5 py-3 rounded-xl flex items-center gap-2">
                          <action.icon size={18} /> <span className="text-sm">{action.label}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </>
        ) : (
          <>
            <h3 className="text-lg font-bold">Lịch sử hoàn thành</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800"><p className="text-[10px] text-slate-500 uppercase font-bold">Số lượng</p><h4 className="text-xl font-black">{myHistory.length}</h4></div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800"><p className="text-[10px] text-slate-500 uppercase font-bold">Tổng thu</p><h4 className="text-xl font-black text-green-500">{myHistory.reduce((s,o)=>s+o.paidAmount,0).toLocaleString()}</h4></div>
            </div>
            {myHistory.map(o => (
              <div key={o.id} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                <div><h5 className="text-sm font-bold text-white">{o.customerName}</h5><p className="text-[10px] text-slate-500 uppercase">{new Date(o.createdAt).toLocaleDateString('vi-VN')}</p></div>
                <div className="text-right"><p className="text-sm font-black text-green-500">{o.paidAmount.toLocaleString()} đ</p><p className="text-[10px] text-slate-400 uppercase">Hoàn thành</p></div>
              </div>
            ))}
          </>
        )}
      </div>

      {showQR && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 w-full max-w-[480px] rounded-3xl p-6 space-y-6">
            <div className="flex justify-between items-center"><h4 className="text-xl font-bold">Thanh toán VietQR</h4><button onClick={() => setShowQR(false)}><X size={24} /></button></div>
            <div className="bg-white p-4 rounded-2xl mx-auto w-56 h-56 flex flex-col items-center justify-center">
              {/* FIX: Removed incorrect function call on 'totalAmount', which is a number. */}
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=VIETQR-AMT-${selectedOrder.totalAmount}`} alt="QR" className="w-40 h-40" />
            </div>
            <div className="text-center"><p className="text-slate-400 text-sm">Cần thu của khách</p><h3 className="text-3xl font-black text-green-500">{selectedOrder.totalAmount.toLocaleString()} đ</h3></div>
            <button onClick={() => { onConfirmPayment(selectedOrder.id); setShowQR(false); }} className="w-full bg-green-600 text-black font-bold py-4 rounded-2xl">Xác nhận đã thu tiền</button>
          </div>
        </div>
      )}

      <div className="bg-slate-900/90 backdrop-blur-md border-t border-slate-800 p-2 flex justify-around">
        <button onClick={() => setActiveKtvTab('tasks')} className={`flex flex-col items-center gap-1 px-4 py-1 ${activeKtvTab === 'tasks' ? 'text-green-500' : 'text-slate-500'}`}>
          <LayoutDashboard size={20} /><span className="text-[10px] font-bold">Nhiệm vụ</span>
        </button>
        <button onClick={() => setActiveKtvTab('history')} className={`flex flex-col items-center gap-1 px-4 py-1 ${activeKtvTab === 'history' ? 'text-green-500' : 'text-slate-500'}`}>
          <HistoryIcon size={20} /><span className="text-[10px] font-bold">Lịch sử</span>
        </button>
      </div>
    </div>
  );
};


// --- MAIN APP ---

const App: React.FC = () => {
  const [view, setView] = useState<'admin' | 'ktv'>('admin');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'orders' | 'crm' | 'history'>('dashboard');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [editingBattery, setEditingBattery] = useState<Battery | null>(null);
  
  const [orders, setOrders] = useState<Order[]>(MOCK_INITIAL_ORDERS);
  const [batteries, setBatteries] = useState<Battery[]>(MOCK_BATTERIES);
  const [ktvs] = useState<KTV[]>(MOCK_KTVS);
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [policies, setPolicies] = useState<DiscountPolicy[]>(INITIAL_POLICIES);

  const handleAssignOrder = (orderId: string, ktvId: string) => setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ktvId, status: OrderStatus.ASSIGNED } : o));
  const handleUpdateOrderStatus = (orderId: string, nextStatus: OrderStatus) => setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));

  const handleConfirmPayment = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: OrderStatus.PAID, paidAmount: o.totalAmount } : o));
    
    setCustomers(prev => prev.map(c => {
      if (c.name === order.customerName) {
        const newTotalDebt = c.totalDebt - order.totalAmount;
        return { ...c, totalDebt: Math.max(0, newTotalDebt), debtSince: newTotalDebt > 0 ? c.debtSince : null };
      }
      return c;
    }));
  };

  const handleSaveOrder = (newOrder: Order, isAgentOrder: boolean) => {
    setOrders([newOrder, ...orders]);
    setActiveTab(isAgentOrder ? 'crm' : 'orders');
    
    // Update stock
    setBatteries(prev => prev.map(b => b.id === newOrder.batteryId ? { ...b, stock: b.stock - newOrder.quantity } : b));

    // Update customer
    setCustomers(prev => {
      const exists = prev.find(c => c.name === newOrder.customerName);
      if (exists) {
        return prev.map(c => c.id === exists.id ? { 
          ...c, 
          totalDebt: c.totalDebt + newOrder.totalAmount, 
          monthlyQuantity: c.monthlyQuantity + newOrder.quantity,
          debtSince: c.totalDebt === 0 ? new Date() : c.debtSince
        } : c);
      }
      return [...prev, { 
        id: `c-${Math.random()}`, name: newOrder.customerName, type: 'retail', tier: 'Bronze', 
        totalDebt: newOrder.totalAmount, creditLimit: 0, lastOrderDate: new Date(), phone: 'N/A',
        monthlyQuantity: newOrder.quantity, debtSince: new Date()
      }];
    });
  };

  const handleSaveBattery = (battery: Battery) => {
    setBatteries(prev => {
      const exists = prev.some(b => b.id === battery.id);
      if (exists) {
        return prev.map(b => b.id === battery.id ? battery : b);
      }
      return [...prev, battery];
    });
    setIsInventoryModalOpen(false);
    setEditingBattery(null);
  };

  const openAddInventoryModal = () => {
    setEditingBattery(null);
    setIsInventoryModalOpen(true);
  };

  const openEditInventoryModal = (battery: Battery) => {
    setEditingBattery(battery);
    setIsInventoryModalOpen(true);
  };


  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 overflow-hidden">
      <button 
        onClick={() => setView(view === 'admin' ? 'ktv' : 'admin')}
        className="fixed bottom-6 right-6 z-[60] bg-green-600 hover:bg-green-500 text-black font-bold px-4 py-3 rounded-full shadow-xl flex items-center gap-2 transition-transform active:scale-90"
      >
        <ArrowLeftRight size={20} />
        <span className="hidden sm:inline">Demo: {view === 'admin' ? 'KTV App' : 'Admin'}</span>
      </button>

      {view === 'admin' ? (
        <div className="flex h-screen overflow-hidden">
          <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col hidden lg:flex">
            <div className="p-6"><h1 className="text-xl font-bold flex items-center gap-2"><span className="text-green-500 italic">BP</span> Manager</h1></div>
            <nav className="flex-1 px-4 space-y-2 mt-4">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { id: 'inventory', label: 'Kho hàng', icon: Package },
                { id: 'orders', label: 'Lịch trình', icon: Truck },
                { id: 'crm', label: 'Đại lý & Công nợ', icon: Users },
                { id: 'history', label: 'Lịch sử GD', icon: HistoryIcon },
              ].map(item => (
                <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-green-600/10 text-green-500 font-semibold' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'}`}>
                  <item.icon size={20} /> {item.label}
                </button>
              ))}
            </nav>
          </aside>
          <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-900">
            <header className="h-16 border-b border-slate-800 bg-slate-900/50 px-6 flex items-center justify-between">
              <h2 className="text-lg font-bold capitalize">{activeTab}</h2>
              <div className="flex items-center gap-4">
                <button onClick={() => setIsOrderModalOpen(true)} className="bg-green-600 text-black px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2">+ Tạo đơn</button>
              </div>
            </header>
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'dashboard' && <AdminDashboard orders={orders} batteries={batteries} customers={customers} />}
              {activeTab === 'inventory' && <AdminInventory batteries={batteries} onAdd={openAddInventoryModal} onEdit={openEditInventoryModal} />}
              {activeTab === 'orders' && <AdminOrders orders={orders} ktvs={ktvs} customers={customers} onAssign={handleAssignOrder} />}
              {activeTab === 'crm' && <AdminCRM customers={customers} onConfig={() => setIsPolicyModalOpen(true)} policies={policies} />}
              {activeTab === 'history' && <AdminHistory orders={orders} />}
            </div>
          </main>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-0 sm:p-10 bg-slate-950">
          <div className="w-full max-w-[480px] h-[800px] bg-black sm:rounded-[3rem] shadow-2xl overflow-hidden border-8 border-slate-800 relative">
            <KTVApp 
              orders={orders} 
              currentKtvId="k1" 
              batteries={batteries} 
              onUpdateStatus={handleUpdateOrderStatus} 
              onConfirmPayment={handleConfirmPayment} 
            />
          </div>
        </div>
      )}

      <OrderModal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} onSave={handleSaveOrder} batteries={batteries} customers={customers} ktvs={ktvs} policies={policies} />
      <PolicyModal isOpen={isPolicyModalOpen} onClose={() => setIsPolicyModalOpen(false)} policies={policies} onUpdate={setPolicies} />
      <InventoryModal isOpen={isInventoryModalOpen} onClose={() => setIsInventoryModalOpen(false)} onSave={handleSaveBattery} batteryToEdit={editingBattery} />
    </div>
  );
};

export default App;
