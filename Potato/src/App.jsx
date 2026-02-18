import { useState, useEffect, useCallback } from "react";

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const T = {
  en: {
    appName: "TRUCK BOSS",
    nav: { order: "New Order", menu: "Menu", history: "History", stats: "Statistics", inventory: "Inventory" },
    order: {
      title: "New Order",
      addItems: "Tap items to add to order",
      total: "Total",
      placeOrder: "Place Order",
      clear: "Clear",
      orderPlaced: "Order Placed!",
      customerNote: "Customer note (optional)",
      selectIngredients: "Select ingredients",
      ingredientsFor: "Ingredients for",
      confirm: "Confirm",
      deductAmount: "Deduct per serving",
    },
    menu: {
      title: "Menu Manager",
      addItem: "Add Item",
      name: "Item Name (EN)",
      nameAr: "Item Name (AR)",
      price: "Price (SAR)",
      category: "Category",
      linkedIngredients: "Link Ingredients",
      ingredientSelection: "Allow ingredient selection on order",
      ingredientSelectionHint: "Customer can choose which ingredients they want",
      save: "Save",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
      noItems: "No menu items yet. Add your first item.",
      deductQty: "Deduct qty per order",
      selectFromInventory: "Select from inventory",
      addIngredientLink: "Link ingredient",
    },
    history: {
      title: "Order History",
      order: "Order",
      total: "Total",
      time: "Time",
      noOrders: "No orders yet",
      revenue: "Total Revenue",
      all: "All Time",
      today: "Today",
      week: "This Week",
      ingredients: "Ingredients used",
    },
    stats: {
      title: "Statistics",
      totalOrders: "Total Orders",
      totalRevenue: "Total Revenue",
      avgOrder: "Avg. Order Value",
      topItems: "Top Selling Items",
      salesByHour: "Orders by Hour",
      revenueByDay: "Revenue by Day",
      today: "Today",
      allTime: "All Time",
      week: "This Week",
      itemsSold: "sold",
      topIngredients: "Most Used Ingredients",
      timesUsed: "times",
    },
    inventory: {
      title: "Inventory Tracker",
      ingredient: "Ingredient",
      stock: "Current Stock",
      unit: "Unit",
      minStock: "Min Stock Alert",
      addIngredient: "Add Ingredient",
      save: "Save",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
      lowStock: "Low Stock Alert",
      noIngredients: "No ingredients tracked yet",
      usedIn: "Used in",
      totalUsed: "Total used",
      adjustStock: "Adjust Stock",
      addStock: "Add Stock",
    },
    common: { sar: "SAR", delete: "Delete", edit: "Edit", save: "Save", cancel: "Cancel" },
  },
  ar: {
    appName: "تراك بوس",
    nav: { order: "طلب جديد", menu: "القائمة", history: "السجل", stats: "إحصائيات", inventory: "المخزون" },
    order: {
      title: "طلب جديد",
      addItems: "اضغط على العناصر لإضافتها للطلب",
      total: "المجموع",
      placeOrder: "تأكيد الطلب",
      clear: "مسح",
      orderPlaced: "تم الطلب!",
      customerNote: "ملاحظة للعميل (اختياري)",
      selectIngredients: "اختر المكونات",
      ingredientsFor: "مكونات",
      confirm: "تأكيد",
      deductAmount: "الكمية المخصومة لكل حصة",
    },
    menu: {
      title: "إدارة القائمة",
      addItem: "إضافة عنصر",
      name: "اسم العنصر (EN)",
      nameAr: "اسم العنصر (AR)",
      price: "السعر (ر.س)",
      category: "الفئة",
      linkedIngredients: "ربط المكونات",
      ingredientSelection: "السماح باختيار المكونات عند الطلب",
      ingredientSelectionHint: "يمكن للعميل اختيار المكونات التي يريدها",
      save: "حفظ",
      cancel: "إلغاء",
      edit: "تعديل",
      delete: "حذف",
      noItems: "لا توجد عناصر في القائمة بعد",
      deductQty: "الكمية المخصومة لكل طلب",
      selectFromInventory: "اختر من المخزون",
      addIngredientLink: "ربط مكوّن",
    },
    history: {
      title: "سجل الطلبات",
      order: "طلب",
      total: "المجموع",
      time: "الوقت",
      noOrders: "لا توجد طلبات بعد",
      revenue: "إجمالي الإيرادات",
      all: "كل الوقت",
      today: "اليوم",
      week: "هذا الأسبوع",
      ingredients: "المكونات المستخدمة",
    },
    stats: {
      title: "الإحصائيات",
      totalOrders: "إجمالي الطلبات",
      totalRevenue: "إجمالي الإيرادات",
      avgOrder: "متوسط قيمة الطلب",
      topItems: "الأكثر مبيعاً",
      salesByHour: "الطلبات حسب الساعة",
      revenueByDay: "الإيرادات حسب اليوم",
      today: "اليوم",
      allTime: "كل الوقت",
      week: "هذا الأسبوع",
      itemsSold: "مباع",
      topIngredients: "أكثر المكونات استخداماً",
      timesUsed: "مرة",
    },
    inventory: {
      title: "تتبع المخزون",
      ingredient: "المكوّن",
      stock: "المخزون الحالي",
      unit: "الوحدة",
      minStock: "حد التنبيه",
      addIngredient: "إضافة مكوّن",
      save: "حفظ",
      cancel: "إلغاء",
      edit: "تعديل",
      delete: "حذف",
      lowStock: "تنبيه: مخزون منخفض",
      noIngredients: "لا توجد مكونات بعد",
      usedIn: "يستخدم في",
      totalUsed: "إجمالي المستخدم",
      adjustStock: "تعديل المخزون",
      addStock: "إضافة مخزون",
    },
    common: { sar: "ر.س", delete: "حذف", edit: "تعديل", save: "حفظ", cancel: "إلغاء" },
  },
};

// ─── DEFAULT DATA ─────────────────────────────────────────────────────────────
const DEFAULT_MENU = [
  {
    id: 1, name: "Loaded Mashed Potato", nameAr: "بطاطس مهروسة", price: 35, category: "Main",
    allowIngredientSelection: true,
    linkedIngredients: [
      { inventoryId: 1, name: "Potato", deductQty: 0.3, unit: "kg" },
      { inventoryId: 2, name: "Cheese", deductQty: 0.05, unit: "kg" },
      { inventoryId: 3, name: "Corn", deductQty: 0.05, unit: "kg" },
      { inventoryId: 4, name: "Mushroom", deductQty: 0.04, unit: "kg" },
      { inventoryId: 5, name: "Butter", deductQty: 0.02, unit: "kg" },
      { inventoryId: 6, name: "Sour Cream", deductQty: 0.03, unit: "kg" },
      { inventoryId: 7, name: "Chives", deductQty: 0.01, unit: "kg" },
    ]
  },
  {
    id: 2, name: "Smash Burger", nameAr: "سماش برغر", price: 40, category: "Main",
    allowIngredientSelection: false,
    linkedIngredients: [
      { inventoryId: 8, name: "Beef Patty", deductQty: 1, unit: "pcs" },
      { inventoryId: 9, name: "Buns", deductQty: 1, unit: "pcs" },
    ]
  },
  {
    id: 3, name: "Lemonade", nameAr: "ليمونادة", price: 12, category: "Drinks",
    allowIngredientSelection: false,
    linkedIngredients: []
  },
];

const DEFAULT_INVENTORY = [
  { id: 1, name: "Potato", nameAr: "بطاطس", stock: 5, unit: "kg", minStock: 2, totalUsed: 0 },
  { id: 2, name: "Cheese", nameAr: "جبن", stock: 2, unit: "kg", minStock: 0.5, totalUsed: 0 },
  { id: 3, name: "Corn", nameAr: "ذرة", stock: 1.5, unit: "kg", minStock: 0.3, totalUsed: 0 },
  { id: 4, name: "Mushroom", nameAr: "فطر", stock: 1, unit: "kg", minStock: 0.2, totalUsed: 0 },
  { id: 5, name: "Butter", nameAr: "زبدة", stock: 0.8, unit: "kg", minStock: 0.2, totalUsed: 0 },
  { id: 6, name: "Sour Cream", nameAr: "قشدة حامضة", stock: 1, unit: "kg", minStock: 0.3, totalUsed: 0 },
  { id: 7, name: "Chives", nameAr: "ثوم معمر", stock: 0.3, unit: "kg", minStock: 0.1, totalUsed: 0 },
  { id: 8, name: "Beef Patty", nameAr: "لحم برغر", stock: 40, unit: "pcs", minStock: 10, totalUsed: 0 },
  { id: 9, name: "Buns", nameAr: "خبز برغر", stock: 60, unit: "pcs", minStock: 15, totalUsed: 0 },
];

// ─── LOCALSTORAGE HOOK ────────────────────────────────────────────────────────
const useStorage = (key, def) => {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : def;
    } catch { return def; }
  });

  const set = useCallback((val) => {
    setState(prev => {
      const next = typeof val === "function" ? val(prev) : val;
      try { localStorage.setItem(key, JSON.stringify(next)); } catch (e) { console.warn("Storage error", e); }
      return next;
    });
  }, [key]);

  return [state, set];
};

// ─── ICONS ───────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18 }) => {
  const icons = {
    order:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>,
    menu:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>,
    history:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
    stats:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>,
    inventory: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>,
    plus:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>,
    minus:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/></svg>,
    trash:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
    edit:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    check:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>,
    warn:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01"/></svg>,
    globe:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>,
    link:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
    toggle_on: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="7" width="22" height="10" rx="5"/><circle cx="16" cy="12" r="3" fill="currentColor"/></svg>,
    toggle_off:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="7" width="22" height="10" rx="5"/><circle cx="8" cy="12" r="3" fill="currentColor"/></svg>,
    box:       <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
    x:         <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>,
  };
  return icons[name] || null;
};

// ─── TOAST ────────────────────────────────────────────────────────────────────
const Toast = ({ msg, onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position:"fixed", bottom:32, left:"50%", transform:"translateX(-50%)", background:"#00e5a0", color:"#080810", padding:"14px 28px", borderRadius:14, fontWeight:700, fontSize:15, zIndex:9999, boxShadow:"0 8px 32px rgba(0,229,160,0.35)", animation:"slideUp 0.3s ease", whiteSpace:"nowrap" }}>
      {msg}
    </div>
  );
};

// ─── INGREDIENT PICKER MODAL ──────────────────────────────────────────────────
const IngredientPickerModal = ({ item, lang, t, onConfirm, onCancel }) => {
  const [selected, setSelected] = useState(
    item.linkedIngredients.map(li => li.inventoryId)
  );

  const toggle = (id) => setSelected(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  );

  const itemName = lang === "ar" ? (item.nameAr || item.name) : item.name;

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:"#0d0d1a", border:"1px solid #2a2a40", borderRadius:20, padding:28, width:"100%", maxWidth:420 }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:18, marginBottom:6 }}>
          {t.order.ingredientsFor}: {itemName}
        </div>
        <div style={{ color:"#666", fontSize:13, marginBottom:20 }}>{t.order.selectIngredients}</div>
        <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
          {item.linkedIngredients.map(li => {
            const on = selected.includes(li.inventoryId);
            return (
              <button key={li.inventoryId} onClick={() => toggle(li.inventoryId)} style={{
                display:"flex", alignItems:"center", justifyContent:"space-between",
                background: on ? "rgba(0,229,160,0.1)" : "#12121e",
                border: "1px solid " + (on ? "#00e5a0" : "#1e1e30"),
                borderRadius:12, padding:"14px 16px", cursor:"pointer", transition:"all 0.15s"
              }}>
                <span style={{ color:"#e8e8f0", fontWeight:600, fontSize:15 }}>{li.name}</span>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ color:"#555", fontSize:12 }}>-{li.deductQty} {li.unit}</span>
                  <div style={{ width:22, height:22, borderRadius:6, border:"2px solid "+(on?"#00e5a0":"#333"), background:on?"#00e5a0":"transparent", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {on && <Icon name="check" size={13} />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onCancel} style={{ flex:1, background:"#12121e", border:"1px solid #2a2a40", borderRadius:12, padding:"14px", color:"#888", fontWeight:700 }}>{t.order.clear}</button>
          <button onClick={() => onConfirm(selected)} style={{ flex:2, background:"linear-gradient(135deg,#00e5a0,#00b8ff)", border:"none", borderRadius:12, padding:"14px", color:"#080810", fontWeight:800, fontSize:15 }}>
            {t.order.confirm} ({selected.length})
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem("ft_lang") || "en");
  const [tab, setTab] = useState("order");
  const [toast, setToast] = useState(null);

  const [menuItems, setMenuItems] = useStorage("ft_menu_v2", DEFAULT_MENU);
  const [orders, setOrders] = useStorage("ft_orders_v2", []);
  const [inventory, setInventory] = useStorage("ft_inventory_v2", DEFAULT_INVENTORY);
  const [orderCount, setOrderCount] = useStorage("ft_orderCount_v2", 1);

  const t = T[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  const switchLang = (l) => { setLang(l); localStorage.setItem("ft_lang", l); };
  const showToast = (msg) => setToast(msg);

  const placeOrder = (order) => {
    const newOrder = { ...order, id: orderCount, timestamp: Date.now() };
    setOrders(prev => [newOrder, ...prev]);
    setOrderCount(n => n + 1);

    // Deduct inventory
    const deductions = {};
    newOrder.items.forEach(cartItem => {
      const menuItem = menuItems.find(m => m.id === cartItem.id);
      if (!menuItem) return;
      menuItem.linkedIngredients.forEach(li => {
        if (menuItem.allowIngredientSelection) {
          // Only deduct selected ingredients
          if (cartItem.selectedIngredients && cartItem.selectedIngredients.includes(li.inventoryId)) {
            deductions[li.inventoryId] = (deductions[li.inventoryId] || 0) + (li.deductQty * cartItem.qty);
          }
        } else {
          // Deduct all linked ingredients automatically
          deductions[li.inventoryId] = (deductions[li.inventoryId] || 0) + (li.deductQty * cartItem.qty);
        }
      });
    });

    setInventory(prev => prev.map(inv => {
      const used = deductions[inv.id] || 0;
      if (used === 0) return inv;
      return { ...inv, stock: Math.max(0, parseFloat((inv.stock - used).toFixed(3))), totalUsed: parseFloat(((inv.totalUsed || 0) + used).toFixed(3)) };
    }));

    showToast(t.order.orderPlaced);
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    @keyframes slideUp { from { transform: translateX(-50%) translateY(16px); opacity:0; } to { transform: translateX(-50%) translateY(0); opacity:1; } }
    @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: #0d0d1a; }
    ::-webkit-scrollbar-thumb { background: #2a2a3e; border-radius: 4px; }
    input, select, textarea, button { font-family: 'DM Sans', sans-serif; }
  `;

  const lowStockCount = inventory.filter(i => i.stock <= i.minStock).length;

  const navItems = ["order","menu","history","stats","inventory"];
  const navIcons = { order:"order", menu:"menu", history:"history", stats:"stats", inventory:"inventory" };

  return (
    <>
      <style>{css}</style>
      <div style={{ fontFamily:"'DM Sans',sans-serif", background:"#080810", minHeight:"100vh", color:"#e8e8f0", direction:dir }}>

        {/* ── Header ── */}
        <div style={{ background:"#0a0a16", borderBottom:"1px solid #16162a", padding:"0 20px", display:"flex", alignItems:"center", justifyContent:"space-between", height:62, position:"sticky", top:0, zIndex:200 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20, background:"linear-gradient(135deg,#00e5a0,#00b8ff)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:1 }}>
            {t.appName}
          </div>

          <div style={{ display:"flex", gap:4 }}>
            {navItems.map(key => (
              <button key={key} onClick={() => setTab(key)} style={{
                padding:"8px 14px", borderRadius:10, border:"none", fontSize:13, fontWeight:600, transition:"all 0.2s", cursor:"pointer",
                background: tab===key ? "linear-gradient(135deg,#00e5a0,#00b8ff)" : "transparent",
                color: tab===key ? "#080810" : "#555",
                display:"flex", alignItems:"center", gap:6, position:"relative",
              }}>
                <Icon name={navIcons[key]} size={15} />
                {t.nav[key]}
                {key==="inventory" && lowStockCount > 0 && (
                  <span style={{ background:"#ffb347", color:"#080810", borderRadius:20, fontSize:10, fontWeight:800, padding:"1px 6px", marginLeft:2 }}>{lowStockCount}</span>
                )}
              </button>
            ))}
          </div>

          <button onClick={() => switchLang(lang==="en"?"ar":"en")} style={{ background:"#12121e", border:"1px solid #1e1e30", borderRadius:10, color:"#00e5a0", padding:"8px 14px", fontSize:13, fontWeight:700, display:"flex", alignItems:"center", gap:6, cursor:"pointer" }}>
            <Icon name="globe" size={14} />
            {lang==="en" ? "العربية" : "English"}
          </button>
        </div>

        {/* ── Content ── */}
        <div style={{ padding:"20px 24px", maxWidth:1440, margin:"0 auto" }}>
          {tab==="order"     && <OrderView     t={t} lang={lang} menuItems={menuItems} onPlaceOrder={placeOrder} />}
          {tab==="menu"      && <MenuView      t={t} lang={lang} menuItems={menuItems} setMenuItems={setMenuItems} inventory={inventory} showToast={showToast} />}
          {tab==="history"   && <HistoryView   t={t} lang={lang} orders={orders} setOrders={setOrders} menuItems={menuItems} showToast={showToast} />}
          {tab==="stats"     && <StatsView     t={t} lang={lang} orders={orders} menuItems={menuItems} inventory={inventory} />}
          {tab==="inventory" && <InventoryView t={t} lang={lang} inventory={inventory} setInventory={setInventory} menuItems={menuItems} showToast={showToast} />}
        </div>

        {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
      </div>
    </>
  );
}

// ─── ORDER VIEW ───────────────────────────────────────────────────────────────
function OrderView({ t, lang, menuItems, onPlaceOrder }) {
  const [cart, setCart] = useState([]);
  const [note, setNote] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [placed, setPlaced] = useState(false);
  const [pickerItem, setPickerItem] = useState(null);

  const categories = ["All","Main","Sides","Drinks","Desserts"];
  const catAr      = ["الكل","رئيسي","جانبي","مشروبات","حلويات"];

  const catLabel = (c) => lang==="ar" ? catAr[categories.indexOf(c)] : c;

  const filtered = activeCategory==="All" ? menuItems : menuItems.filter(m => m.category===activeCategory);

  const handleItemTap = (item) => {
    if (item.allowIngredientSelection && item.linkedIngredients.length > 0) {
      setPickerItem(item);
    } else {
      addToCart(item, null);
    }
  };

  const addToCart = (item, selectedIngredients) => {
    setCart(prev => {
      // If ingredient selection is on, always add as separate line (different combos)
      if (item.allowIngredientSelection) {
        return [...prev, { ...item, qty: 1, selectedIngredients: selectedIngredients || [] }];
      }
      const ex = prev.find(c => c.id === item.id);
      if (ex) return prev.map(c => c.id===item.id ? { ...c, qty:c.qty+1 } : c);
      return [...prev, { ...item, qty:1, selectedIngredients:null }];
    });
  };

  const updateQty = (idx, delta) => {
    setCart(prev => {
      const next = prev.map((c,i) => i===idx ? { ...c, qty:c.qty+delta } : c).filter(c=>c.qty>0);
      return next;
    });
  };

  const total = cart.reduce((s,c) => s + c.price * c.qty, 0);

  const place = () => {
    if (!cart.length) return;
    onPlaceOrder({ items:cart, note, total });
    setCart([]); setNote("");
    setPlaced(true);
    setTimeout(() => setPlaced(false), 1800);
  };

  const card = { background:"#0d0d1a", border:"1px solid #1a1a2e", borderRadius:18, padding:18 };
  const inp  = { background:"#12121e", border:"1px solid #1e1e32", borderRadius:10, padding:"11px 14px", color:"#e8e8f0", fontSize:14, outline:"none", width:"100%", fontFamily:"inherit" };

  return (
    <>
      {pickerItem && (
        <IngredientPickerModal
          item={pickerItem} lang={lang} t={t}
          onConfirm={(sel) => { addToCart(pickerItem, sel); setPickerItem(null); }}
          onCancel={() => setPickerItem(null)}
        />
      )}

      <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:20, minHeight:"calc(100vh - 102px)" }}>

        {/* Left: Menu */}
        <div style={{ display:"flex", flexDirection:"column", gap:14, overflow:"hidden" }}>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                padding:"9px 18px", borderRadius:10, border:"1px solid "+(activeCategory===cat?"transparent":"#1a1a2e"),
                background: activeCategory===cat ? "linear-gradient(135deg,#00e5a0,#00b8ff)" : "#0d0d1a",
                color: activeCategory===cat ? "#080810" : "#555", fontWeight:600, fontSize:13, cursor:"pointer",
              }}>{catLabel(cat)}</button>
            ))}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))", gap:12, overflowY:"auto", paddingBottom:8 }}>
            {filtered.map(item => {
              const inCart = cart.filter(c=>c.id===item.id);
              const totalQty = inCart.reduce((s,c)=>s+c.qty,0);
              return (
                <button key={item.id} onClick={() => handleItemTap(item)} style={{
                  background: totalQty > 0 ? "rgba(0,229,160,0.06)" : "#0d0d1a",
                  border: "1px solid "+(totalQty>0?"rgba(0,229,160,0.4)":"#1a1a2e"),
                  borderRadius:16, padding:"18px 16px", cursor:"pointer", textAlign:lang==="ar"?"right":"left",
                  transition:"all 0.15s", color:"#e8e8f0", position:"relative",
                }}>
                  {totalQty > 0 && (
                    <div style={{ position:"absolute", top:10, right:lang==="ar"?"auto":10, left:lang==="ar"?10:"auto", background:"#00e5a0", color:"#080810", borderRadius:20, width:22, height:22, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800 }}>
                      {totalQty}
                    </div>
                  )}
                  {item.allowIngredientSelection && (
                    <div style={{ fontSize:10, color:"#00b8ff", fontWeight:700, marginBottom:6, display:"flex", alignItems:"center", gap:4 }}>
                      <Icon name="link" size={11} /> {lang==="ar"?"اختيار مكونات":"Choose ingredients"}
                    </div>
                  )}
                  <div style={{ fontWeight:700, fontSize:15, fontFamily:"'Syne',sans-serif", marginBottom:6, lineHeight:1.3 }}>
                    {lang==="ar" ? (item.nameAr||item.name) : item.name}
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ color:"#00e5a0", fontWeight:800, fontSize:16 }}>{item.price}</span>
                    <span style={{ color:"#555", fontSize:12 }}>{T.en.common.sar}</span>
                  </div>
                  <div style={{ fontSize:11, color:"#555", marginTop:4 }}>{item.category}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Cart */}
        <div style={{ ...card, display:"flex", flexDirection:"column", gap:14, position:"sticky", top:82, maxHeight:"calc(100vh - 102px)", overflow:"hidden" }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:17 }}>{t.order.title}</div>

          {cart.length===0 ? (
            <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", color:"#333", fontSize:13, textAlign:"center", padding:20 }}>
              {t.order.addItems}
            </div>
          ) : (
            <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:8 }}>
              {cart.map((item, idx) => (
                <div key={idx} style={{ background:"#12121e", borderRadius:12, padding:"12px 14px" }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <div style={{ flex:1, marginRight:8 }}>
                      <div style={{ fontWeight:600, fontSize:14 }}>{lang==="ar"?(item.nameAr||item.name):item.name}</div>
                      <div style={{ color:"#00e5a0", fontSize:13, fontWeight:700 }}>{item.price * item.qty} {t.common.sar}</div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <button onClick={() => updateQty(idx,-1)} style={{ background:"#1e1e30", border:"none", color:"#e8e8f0", borderRadius:8, width:28, height:28, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}><Icon name="minus" size={13}/></button>
                      <span style={{ fontWeight:700, minWidth:18, textAlign:"center", fontSize:14 }}>{item.qty}</span>
                      <button onClick={() => updateQty(idx,+1)} style={{ background:"#1e1e30", border:"none", color:"#e8e8f0", borderRadius:8, width:28, height:28, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}><Icon name="plus" size={13}/></button>
                    </div>
                  </div>
                  {item.selectedIngredients && item.selectedIngredients.length > 0 && (
                    <div style={{ marginTop:8, display:"flex", flexWrap:"wrap", gap:4 }}>
                      {item.linkedIngredients.filter(li=>item.selectedIngredients.includes(li.inventoryId)).map(li => (
                        <span key={li.inventoryId} style={{ background:"rgba(0,229,160,0.1)", border:"1px solid rgba(0,229,160,0.2)", borderRadius:6, padding:"2px 8px", fontSize:11, color:"#00e5a0" }}>{li.name}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder={t.order.customerNote} style={{ ...inp, resize:"none", height:64, fontSize:13 }} />

          <div style={{ borderTop:"1px solid #1a1a2e", paddingTop:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:19, fontWeight:800, fontFamily:"'Syne',sans-serif", marginBottom:14 }}>
              <span>{t.order.total}</span>
              <span style={{ color:"#00e5a0" }}>{total} {t.common.sar}</span>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => setCart([])} style={{ flex:1, background:"#12121e", border:"1px solid #1a1a2e", borderRadius:12, padding:"13px", color:"#666", fontWeight:700, cursor:"pointer" }}>{t.order.clear}</button>
              <button onClick={place} disabled={cart.length===0} style={{
                flex:2, background: placed ? "rgba(0,229,160,0.1)" : cart.length===0 ? "#12121e" : "linear-gradient(135deg,#00e5a0,#00b8ff)",
                border: placed ? "1px solid #00e5a0" : "none",
                borderRadius:12, padding:"13px", color: placed ? "#00e5a0" : cart.length===0 ? "#333" : "#080810",
                fontWeight:800, fontSize:15, display:"flex", alignItems:"center", justifyContent:"center", gap:8, cursor:cart.length===0?"not-allowed":"pointer", transition:"all 0.3s",
              }}>
                {placed ? <><Icon name="check" size={17}/> {t.order.orderPlaced}</> : t.order.placeOrder}
              </button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

// ─── MENU VIEW ────────────────────────────────────────────────────────────────
function MenuView({ t, lang, menuItems, setMenuItems, inventory, showToast }) {
  const [editing, setEditing] = useState(null);
  const blank = { name:"", nameAr:"", price:"", category:"Main", allowIngredientSelection:false, linkedIngredients:[] };
  const [form, setForm] = useState(blank);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All","Main","Sides","Drinks","Desserts"];

  const openNew  = () => { setForm(blank); setEditing("new"); };
  const openEdit = (item) => { setForm({ ...item }); setEditing(item.id); };

  const addLink = () => {
    setForm(f => ({ ...f, linkedIngredients: [...f.linkedIngredients, { inventoryId:"", name:"", deductQty:1, unit:"pcs" }] }));
  };

  const updateLink = (idx, field, val) => {
    setForm(f => {
      const links = f.linkedIngredients.map((l,i) => {
        if (i!==idx) return l;
        if (field==="inventoryId") {
          const inv = inventory.find(v => v.id === parseInt(val));
          return { ...l, inventoryId: parseInt(val)||"", name: inv?inv.name:l.name, unit: inv?inv.unit:l.unit };
        }
        return { ...l, [field]: val };
      });
      return { ...f, linkedIngredients: links };
    });
  };

  const removeLink = (idx) => setForm(f => ({ ...f, linkedIngredients: f.linkedIngredients.filter((_,i)=>i!==idx) }));

  const save = () => {
    if (!form.name) return;
    const item = { ...form, price: parseFloat(form.price)||0 };
    if (editing==="new") {
      setMenuItems(prev => [...prev, { ...item, id: Date.now() }]);
    } else {
      setMenuItems(prev => prev.map(m => m.id===editing ? { ...m, ...item } : m));
    }
    setEditing(null);
    showToast(lang==="ar"?"تم الحفظ!":"Saved!");
  };

  const del = (id) => setMenuItems(prev => prev.filter(m=>m.id!==id));

  const filtered = activeCategory==="All" ? menuItems : menuItems.filter(m=>m.category===activeCategory);
  const inp = { background:"#12121e", border:"1px solid #2a2a40", borderRadius:10, padding:"11px 14px", color:"#e8e8f0", fontSize:14, outline:"none", width:"100%", fontFamily:"inherit" };

  return (
    <div style={{ animation:"fadeIn 0.25s ease" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:24 }}>{t.menu.title}</h2>
        <button onClick={openNew} style={{ background:"linear-gradient(135deg,#00e5a0,#00b8ff)", border:"none", borderRadius:12, padding:"11px 20px", color:"#080810", fontWeight:700, display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
          <Icon name="plus" size={16}/> {t.menu.addItem}
        </button>
      </div>

      <div style={{ display:"flex", gap:8, marginBottom:20 }}>
        {categories.map(c => (
          <button key={c} onClick={() => setActiveCategory(c)} style={{
            padding:"8px 16px", borderRadius:10, border:"1px solid "+(activeCategory===c?"transparent":"#1a1a2e"),
            background: activeCategory===c ? "linear-gradient(135deg,#00e5a0,#00b8ff)" : "#0d0d1a",
            color: activeCategory===c?"#080810":"#555", fontWeight:600, fontSize:13, cursor:"pointer",
          }}>{c}</button>
        ))}
      </div>

      {/* Edit/New form */}
      {editing && (
        <div style={{ background:"#0d0d1a", border:"1px solid #2a2a3e", borderRadius:20, padding:24, marginBottom:22 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:16, marginBottom:18 }}>
            {editing==="new" ? t.menu.addItem : t.menu.edit}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:12, marginBottom:16 }}>
            <div>
              <label style={{ fontSize:12, color:"#555", display:"block", marginBottom:6 }}>{t.menu.name}</label>
              <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} style={inp} />
            </div>
            <div>
              <label style={{ fontSize:12, color:"#555", display:"block", marginBottom:6 }}>{t.menu.nameAr}</label>
              <input value={form.nameAr||""} onChange={e=>setForm(f=>({...f,nameAr:e.target.value}))} style={{...inp,direction:"rtl"}} />
            </div>
            <div>
              <label style={{ fontSize:12, color:"#555", display:"block", marginBottom:6 }}>{t.menu.price}</label>
              <input type="number" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} style={inp} />
            </div>
            <div>
              <label style={{ fontSize:12, color:"#555", display:"block", marginBottom:6 }}>{t.menu.category}</label>
              <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} style={{...inp,appearance:"none"}}>
                {["Main","Sides","Drinks","Desserts"].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Ingredient selection toggle */}
          <div style={{ background:"#12121e", border:"1px solid #1e1e32", borderRadius:14, padding:"16px 18px", marginBottom:16 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <div style={{ fontWeight:700, fontSize:14, marginBottom:4 }}>{t.menu.ingredientSelection}</div>
                <div style={{ fontSize:12, color:"#555" }}>{t.menu.ingredientSelectionHint}</div>
              </div>
              <button onClick={() => setForm(f=>({...f,allowIngredientSelection:!f.allowIngredientSelection}))} style={{
                background:"transparent", border:"none", cursor:"pointer",
                color: form.allowIngredientSelection ? "#00e5a0" : "#444",
              }}>
                <Icon name={form.allowIngredientSelection?"toggle_on":"toggle_off"} size={36}/>
              </button>
            </div>
          </div>

          {/* Linked ingredients */}
          <div style={{ marginBottom:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <div style={{ fontWeight:700, fontSize:14 }}>{t.menu.linkedIngredients}</div>
              <button onClick={addLink} style={{ background:"#12121e", border:"1px solid #2a2a40", borderRadius:9, padding:"7px 14px", color:"#00e5a0", fontWeight:700, fontSize:13, display:"flex", alignItems:"center", gap:6, cursor:"pointer" }}>
                <Icon name="plus" size={13}/> {t.menu.addIngredientLink}
              </button>
            </div>
            {form.linkedIngredients.length===0 && (
              <div style={{ color:"#333", fontSize:13, padding:"12px 0" }}>No ingredients linked yet</div>
            )}
            {form.linkedIngredients.map((li, idx) => (
              <div key={idx} style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr auto", gap:10, marginBottom:8, alignItems:"center" }}>
                <select value={li.inventoryId||""} onChange={e=>updateLink(idx,"inventoryId",e.target.value)} style={{...inp,appearance:"none"}}>
                  <option value="">{t.menu.selectFromInventory}</option>
                  {inventory.map(inv=><option key={inv.id} value={inv.id}>{inv.name} ({inv.unit})</option>)}
                </select>
                <div style={{ position:"relative" }}>
                  <input type="number" step="0.01" value={li.deductQty} onChange={e=>updateLink(idx,"deductQty",parseFloat(e.target.value)||0)} style={inp} placeholder="Qty" />
                </div>
                <div style={{ fontSize:12, color:"#555", padding:"11px 0" }}>{li.unit || "—"}</div>
                <button onClick={()=>removeLink(idx)} style={{ background:"rgba(255,77,109,0.1)", border:"1px solid rgba(255,77,109,0.2)", borderRadius:8, width:34, height:34, display:"flex", alignItems:"center", justifyContent:"center", color:"#ff4d6d", cursor:"pointer" }}>
                  <Icon name="x" size={14}/>
                </button>
              </div>
            ))}
          </div>

          <div style={{ display:"flex", gap:10 }}>
            <button onClick={save} style={{ background:"linear-gradient(135deg,#00e5a0,#00b8ff)", border:"none", borderRadius:11, padding:"12px 28px", color:"#080810", fontWeight:700, cursor:"pointer" }}>{t.menu.save}</button>
            <button onClick={()=>setEditing(null)} style={{ background:"#12121e", border:"1px solid #2a2a40", borderRadius:11, padding:"12px 24px", color:"#666", fontWeight:700, cursor:"pointer" }}>{t.menu.cancel}</button>
          </div>
        </div>
      )}

      {filtered.length===0 && !editing && (
        <div style={{ textAlign:"center", color:"#333", padding:60, fontSize:14 }}>{t.menu.noItems}</div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:12 }}>
        {filtered.map(item => (
          <div key={item.id} style={{ background:"#0d0d1a", border:"1px solid #1a1a2e", borderRadius:16, padding:20, animation:"fadeIn 0.25s ease" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
              <div>
                <div style={{ fontWeight:700, fontSize:16, fontFamily:"'Syne',sans-serif" }}>{item.name}</div>
                {item.nameAr && <div style={{ color:"#555", fontSize:13, direction:"rtl", marginTop:2 }}>{item.nameAr}</div>}
                {item.allowIngredientSelection && (
                  <div style={{ marginTop:6, fontSize:11, color:"#00b8ff", display:"flex", alignItems:"center", gap:4 }}>
                    <Icon name="link" size={11}/> Ingredient selection on
                  </div>
                )}
              </div>
              <div style={{ display:"flex", gap:6 }}>
                <button onClick={()=>openEdit(item)} style={{ background:"#1a1a28", border:"none", borderRadius:8, width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", color:"#00b8ff", cursor:"pointer" }}><Icon name="edit" size={14}/></button>
                <button onClick={()=>del(item.id)} style={{ background:"#1a1a28", border:"none", borderRadius:8, width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", color:"#ff4d6d", cursor:"pointer" }}><Icon name="trash" size={14}/></button>
              </div>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <span style={{ color:"#00e5a0", fontWeight:800, fontSize:19 }}>{item.price} {T.en.common.sar}</span>
              <span style={{ background:"#12121e", borderRadius:7, padding:"3px 10px", fontSize:12, color:"#555" }}>{item.category}</span>
            </div>
            {item.linkedIngredients.length>0 && (
              <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                {item.linkedIngredients.map((li,i) => (
                  <span key={i} style={{ background:"#12121e", border:"1px solid #1e1e30", borderRadius:6, padding:"3px 9px", fontSize:11, color:"#666" }}>
                    {li.name} -{li.deductQty}{li.unit}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── HISTORY VIEW ─────────────────────────────────────────────────────────────
function HistoryView({ t, lang, orders, setOrders, menuItems, showToast }) {
  const [filter, setFilter] = useState("all");
  const now = Date.now();

  const filtered = orders.filter(o => {
    if (filter==="today") return new Date(o.timestamp).toDateString()===new Date().toDateString();
    if (filter==="week")  return now-o.timestamp < 7*86400000;
    return true;
  });

  const revenue = filtered.reduce((s,o)=>s+o.total,0);
  const avg     = filtered.length ? revenue/filtered.length : 0;

  const del = (id) => { setOrders(prev=>prev.filter(o=>o.id!==id)); showToast(lang==="ar"?"تم الحذف":"Deleted"); };

  const fmt = (ts) => {
    const d = new Date(ts);
    return d.toLocaleDateString()+" "+d.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
  };

  const statCard = (label,val,color) => (
    <div style={{ background:"#0d0d1a", border:"1px solid #1a1a2e", borderRadius:14, padding:20 }}>
      <div style={{ color:"#555", fontSize:12, marginBottom:8 }}>{label}</div>
      <div style={{ color, fontSize:22, fontWeight:800, fontFamily:"'Syne',sans-serif" }}>{val}</div>
    </div>
  );

  return (
    <div style={{ animation:"fadeIn 0.25s ease" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:24 }}>{t.history.title}</h2>
        <div style={{ display:"flex", gap:8 }}>
          {["all","today","week"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{
              padding:"8px 16px", borderRadius:10, border:"1px solid "+(filter===f?"transparent":"#1a1a2e"),
              background: filter===f?"linear-gradient(135deg,#00e5a0,#00b8ff)":"#0d0d1a",
              color: filter===f?"#080810":"#555", fontWeight:600, fontSize:13, cursor:"pointer",
            }}>{t.history[f==="all"?"all":f==="today"?"today":"week"]}</button>
          ))}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20 }}>
        {statCard(t.history.revenue, revenue.toFixed(0)+" "+t.common.sar, "#00e5a0")}
        {statCard(t.stats.totalOrders, filtered.length, "#00b8ff")}
        {statCard(t.stats.avgOrder, avg.toFixed(0)+" "+t.common.sar, "#b47dff")}
      </div>

      {filtered.length===0 ? (
        <div style={{ textAlign:"center", color:"#333", padding:60, fontSize:14 }}>{t.history.noOrders}</div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {filtered.map(order => (
            <div key={order.id} style={{ background:"#0d0d1a", border:"1px solid #1a1a2e", borderRadius:16, padding:20 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:16 }}>{t.history.order} #{order.id}</div>
                  <div style={{ color:"#555", fontSize:13, marginTop:3 }}>{fmt(order.timestamp)}</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <span style={{ color:"#00e5a0", fontWeight:800, fontSize:20 }}>{order.total} {t.common.sar}</span>
                  <button onClick={()=>del(order.id)} style={{ background:"rgba(255,77,109,0.08)", border:"1px solid rgba(255,77,109,0.15)", borderRadius:8, width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", color:"#ff4d6d", cursor:"pointer" }}>
                    <Icon name="trash" size={14}/>
                  </button>
                </div>
              </div>

              <div style={{ marginTop:14, display:"flex", flexWrap:"wrap", gap:8 }}>
                {order.items.map((item,i)=>(
                  <div key={i} style={{ background:"#12121e", border:"1px solid #1e1e30", borderRadius:10, padding:"8px 12px" }}>
                    <div style={{ fontSize:13, fontWeight:600, color:"#ccc" }}>
                      {lang==="ar"?(item.nameAr||item.name):item.name} ×{item.qty}
                    </div>
                    {item.selectedIngredients && item.selectedIngredients.length>0 && item.linkedIngredients && (
                      <div style={{ marginTop:4, display:"flex", flexWrap:"wrap", gap:3 }}>
                        {item.linkedIngredients.filter(li=>item.selectedIngredients.includes(li.inventoryId)).map(li=>(
                          <span key={li.inventoryId} style={{ fontSize:10, color:"#00e5a0", background:"rgba(0,229,160,0.08)", padding:"1px 6px", borderRadius:4 }}>{li.name}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {order.note && <div style={{ marginTop:10, fontSize:13, color:"#555", fontStyle:"italic" }}>Note: {order.note}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── STATS VIEW ───────────────────────────────────────────────────────────────
function StatsView({ t, lang, orders, menuItems, inventory }) {
  const [range, setRange] = useState("allTime");
  const now = Date.now();

  const filtered = orders.filter(o => {
    if (range==="today") return new Date(o.timestamp).toDateString()===new Date().toDateString();
    if (range==="week")  return now-o.timestamp < 7*86400000;
    return true;
  });

  const total = filtered.reduce((s,o)=>s+o.total,0);
  const avg   = filtered.length ? total/filtered.length : 0;

  // Top menu items
  const itemCount = {};
  filtered.forEach(o=>o.items.forEach(item=>{
    const n = lang==="ar"?(item.nameAr||item.name):item.name;
    itemCount[n] = (itemCount[n]||0)+item.qty;
  }));
  const topItems = Object.entries(itemCount).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const maxItem  = topItems[0]?.[1]||1;

  // Top ingredients used (from orders)
  const ingUsage = {};
  filtered.forEach(o=>o.items.forEach(item=>{
    const menuItem = menuItems.find(m=>m.id===item.id);
    if (!menuItem) return;
    menuItem.linkedIngredients.forEach(li=>{
      if (menuItem.allowIngredientSelection) {
        if (item.selectedIngredients && item.selectedIngredients.includes(li.inventoryId)) {
          ingUsage[li.name] = (ingUsage[li.name]||0)+1;
        }
      } else {
        ingUsage[li.name] = (ingUsage[li.name]||0)+item.qty;
      }
    });
  }));
  const topIngs = Object.entries(ingUsage).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const maxIng  = topIngs[0]?.[1]||1;

  // Revenue by day
  const dayRev = {};
  for (let i=6;i>=0;i--) {
    const d=new Date(); d.setDate(d.getDate()-i);
    dayRev[d.toLocaleDateString("en",{weekday:"short"})] = 0;
  }
  filtered.forEach(o=>{
    const k=new Date(o.timestamp).toLocaleDateString("en",{weekday:"short"});
    if (k in dayRev) dayRev[k]+=o.total;
  });
  const maxRev = Math.max(...Object.values(dayRev),1);

  // Orders by hour
  const byHour = Array(24).fill(0);
  filtered.forEach(o=>byHour[new Date(o.timestamp).getHours()]++);
  const maxHour = Math.max(...byHour,1);

  const statCard = (label,val,color) => (
    <div style={{ background:"#0d0d1a", border:"1px solid #1a1a2e", borderRadius:16, padding:24 }}>
      <div style={{ color:"#555", fontSize:12, marginBottom:10 }}>{label}</div>
      <div style={{ color, fontSize:28, fontWeight:800, fontFamily:"'Syne',sans-serif" }}>{val}</div>
    </div>
  );

  return (
    <div style={{ animation:"fadeIn 0.25s ease" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:24 }}>{t.stats.title}</h2>
        <div style={{ display:"flex", gap:8 }}>
          {["today","week","allTime"].map(r=>(
            <button key={r} onClick={()=>setRange(r)} style={{
              padding:"8px 16px", borderRadius:10, border:"1px solid "+(range===r?"transparent":"#1a1a2e"),
              background: range===r?"linear-gradient(135deg,#00e5a0,#00b8ff)":"#0d0d1a",
              color: range===r?"#080810":"#555", fontWeight:600, fontSize:13, cursor:"pointer",
            }}>{t.stats[r]}</button>
          ))}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20 }}>
        {statCard(t.stats.totalOrders, filtered.length, "#00b8ff")}
        {statCard(t.stats.totalRevenue, total.toFixed(0)+" "+t.common.sar, "#00e5a0")}
        {statCard(t.stats.avgOrder, avg.toFixed(0)+" "+t.common.sar, "#b47dff")}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        {/* Top Items */}
        <div style={{ background:"#0d0d1a", border:"1px solid #1a1a2e", borderRadius:16, padding:24 }}>
          <div style={{ fontWeight:700, fontSize:15, marginBottom:18, fontFamily:"'Syne',sans-serif" }}>{t.stats.topItems}</div>
          {topItems.length===0 ? <div style={{ color:"#333", fontSize:13 }}>No data yet</div> :
            topItems.map(([name,count])=>(
              <div key={name} style={{ marginBottom:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6, fontSize:14 }}>
                  <span style={{ fontWeight:600 }}>{name}</span>
                  <span style={{ color:"#00e5a0" }}>{count} {t.stats.itemsSold}</span>
                </div>
                <div style={{ background:"#12121e", borderRadius:5, height:7, overflow:"hidden" }}>
                  <div style={{ background:"linear-gradient(90deg,#00e5a0,#00b8ff)", height:"100%", width:(count/maxItem*100)+"%", borderRadius:5, transition:"width 0.5s ease" }}/>
                </div>
              </div>
            ))
          }
        </div>

        {/* Top Ingredients */}
        <div style={{ background:"#0d0d1a", border:"1px solid #1a1a2e", borderRadius:16, padding:24 }}>
          <div style={{ fontWeight:700, fontSize:15, marginBottom:18, fontFamily:"'Syne',sans-serif" }}>{t.stats.topIngredients}</div>
          {topIngs.length===0 ? <div style={{ color:"#333", fontSize:13 }}>No ingredient data yet</div> :
            topIngs.map(([name,count])=>(
              <div key={name} style={{ marginBottom:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6, fontSize:14 }}>
                  <span style={{ fontWeight:600 }}>{name}</span>
                  <span style={{ color:"#b47dff" }}>{count} {t.stats.timesUsed}</span>
                </div>
                <div style={{ background:"#12121e", borderRadius:5, height:7, overflow:"hidden" }}>
                  <div style={{ background:"linear-gradient(90deg,#b47dff,#00b8ff)", height:"100%", width:(count/maxIng*100)+"%", borderRadius:5, transition:"width 0.5s ease" }}/>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:16 }}>
        {/* Revenue by Day */}
        <div style={{ background:"#0d0d1a", border:"1px solid #1a1a2e", borderRadius:16, padding:24 }}>
          <div style={{ fontWeight:700, fontSize:15, marginBottom:18, fontFamily:"'Syne',sans-serif" }}>{t.stats.revenueByDay}</div>
          <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:120 }}>
            {Object.entries(dayRev).map(([day,rev])=>(
              <div key={day} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
                {rev>0 && <div style={{ fontSize:9, color:"#00e5a0", fontWeight:700 }}>{rev.toFixed(0)}</div>}
                <div style={{ width:"100%", background:rev>0?"linear-gradient(180deg,#00e5a0,#00b8ff)":"#12121e", borderRadius:"5px 5px 0 0", height:Math.max(4,rev/maxRev*90)+"px", transition:"height 0.5s ease" }}/>
                <div style={{ fontSize:10, color:"#555" }}>{day}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Orders by Hour */}
        <div style={{ background:"#0d0d1a", border:"1px solid #1a1a2e", borderRadius:16, padding:24 }}>
          <div style={{ fontWeight:700, fontSize:15, marginBottom:18, fontFamily:"'Syne',sans-serif" }}>{t.stats.salesByHour}</div>
          <div style={{ display:"flex", alignItems:"flex-end", gap:2, height:90 }}>
            {byHour.map((cnt,h)=>(
              <div key={h} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                <div style={{ width:"100%", background:cnt>0?"linear-gradient(180deg,#b47dff,#00b8ff)":"#12121e", borderRadius:"3px 3px 0 0", height:Math.max(2,cnt/maxHour*70)+"px", transition:"height 0.5s ease" }}/>
                {h%4===0 && <div style={{ fontSize:9, color:"#444" }}>{h}h</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── INVENTORY VIEW ───────────────────────────────────────────────────────────
function InventoryView({ t, lang, inventory, setInventory, menuItems, showToast }) {
  const [editing, setEditing] = useState(null);
  const [adjusting, setAdjusting] = useState(null);
  const [adjustAmt, setAdjustAmt] = useState("");
  const blank = { name:"", nameAr:"", stock:"", unit:"kg", minStock:"", totalUsed:0 };
  const [form, setForm] = useState(blank);

  const openNew  = () => { setForm(blank); setEditing("new"); };
  const openEdit = (item) => { setForm({...item}); setEditing(item.id); };

  const save = () => {
    if (!form.name) return;
    const item = { ...form, stock:parseFloat(form.stock)||0, minStock:parseFloat(form.minStock)||0, totalUsed:parseFloat(form.totalUsed)||0 };
    if (editing==="new") {
      setInventory(prev=>[...prev,{...item,id:Date.now()}]);
    } else {
      setInventory(prev=>prev.map(i=>i.id===editing?item:i));
    }
    setEditing(null);
    showToast(lang==="ar"?"تم الحفظ!":"Saved!");
  };

  const del = (id) => setInventory(prev=>prev.filter(i=>i.id!==id));

  const doAdjust = (id) => {
    const delta = parseFloat(adjustAmt);
    if (isNaN(delta)) return;
    setInventory(prev=>prev.map(i=>i.id===id ? {...i, stock:Math.max(0,parseFloat((i.stock+delta).toFixed(3)))} : i));
    setAdjusting(null); setAdjustAmt("");
    showToast(lang==="ar"?"تم تعديل المخزون":"Stock updated");
  };

  const usedInItems = (invId) => menuItems.filter(m=>m.linkedIngredients.some(li=>li.inventoryId===invId)).map(m=>lang==="ar"?(m.nameAr||m.name):m.name);

  const lowStock = inventory.filter(i=>i.stock<=i.minStock);
  const inp = { background:"#12121e", border:"1px solid #2a2a40", borderRadius:10, padding:"11px 14px", color:"#e8e8f0", fontSize:14, outline:"none", width:"100%", fontFamily:"inherit" };

  return (
    <div style={{ animation:"fadeIn 0.25s ease" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:24 }}>{t.inventory.title}</h2>
        <button onClick={openNew} style={{ background:"linear-gradient(135deg,#00e5a0,#00b8ff)", border:"none", borderRadius:12, padding:"11px 20px", color:"#080810", fontWeight:700, display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
          <Icon name="plus" size={16}/> {t.inventory.addIngredient}
        </button>
      </div>

      {lowStock.length>0 && (
        <div style={{ background:"rgba(255,179,71,0.07)", border:"1px solid rgba(255,179,71,0.25)", borderRadius:14, padding:"14px 18px", marginBottom:20, display:"flex", alignItems:"center", gap:14 }}>
          <Icon name="warn" size={22}/>
          <div>
            <div style={{ fontWeight:700, color:"#ffb347", marginBottom:4 }}>{t.inventory.lowStock}</div>
            <div style={{ fontSize:13, color:"#999" }}>{lowStock.map(i=>lang==="ar"?(i.nameAr||i.name):i.name).join(", ")}</div>
          </div>
        </div>
      )}

      {editing && (
        <div style={{ background:"#0d0d1a", border:"1px solid #2a2a3e", borderRadius:20, padding:24, marginBottom:22 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:16, marginBottom:18 }}>
            {editing==="new"?t.inventory.addIngredient:t.inventory.edit}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr", gap:12, marginBottom:14 }}>
            <div><label style={{ fontSize:12,color:"#555",display:"block",marginBottom:6 }}>{t.inventory.ingredient} (EN)</label>
              <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} style={inp}/></div>
            <div><label style={{ fontSize:12,color:"#555",display:"block",marginBottom:6 }}>{t.inventory.ingredient} (AR)</label>
              <input value={form.nameAr||""} onChange={e=>setForm(f=>({...f,nameAr:e.target.value}))} style={{...inp,direction:"rtl"}}/></div>
            <div><label style={{ fontSize:12,color:"#555",display:"block",marginBottom:6 }}>{t.inventory.stock}</label>
              <input type="number" step="0.01" value={form.stock} onChange={e=>setForm(f=>({...f,stock:e.target.value}))} style={inp}/></div>
            <div><label style={{ fontSize:12,color:"#555",display:"block",marginBottom:6 }}>{t.inventory.unit}</label>
              <select value={form.unit} onChange={e=>setForm(f=>({...f,unit:e.target.value}))} style={{...inp,appearance:"none"}}>
                {["kg","g","pcs","L","ml","packs","boxes","portions"].map(u=><option key={u}>{u}</option>)}
              </select></div>
            <div><label style={{ fontSize:12,color:"#555",display:"block",marginBottom:6 }}>{t.inventory.minStock}</label>
              <input type="number" step="0.01" value={form.minStock} onChange={e=>setForm(f=>({...f,minStock:e.target.value}))} style={inp}/></div>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={save} style={{ background:"linear-gradient(135deg,#00e5a0,#00b8ff)", border:"none", borderRadius:11, padding:"12px 28px", color:"#080810", fontWeight:700, cursor:"pointer" }}>{t.inventory.save}</button>
            <button onClick={()=>setEditing(null)} style={{ background:"#12121e", border:"1px solid #2a2a40", borderRadius:11, padding:"12px 24px", color:"#666", fontWeight:700, cursor:"pointer" }}>{t.inventory.cancel}</button>
          </div>
        </div>
      )}

      {inventory.length===0 && !editing && (
        <div style={{ textAlign:"center", color:"#333", padding:60, fontSize:14 }}>{t.inventory.noIngredients}</div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))", gap:12 }}>
        {inventory.map(item=>{
          const isLow = item.stock<=item.minStock;
          const pct = item.minStock>0 ? Math.min(100,(item.stock/(item.minStock*3))*100) : Math.min(100,item.stock*10);
          const usedIn = usedInItems(item.id);
          const isAdj = adjusting===item.id;

          return (
            <div key={item.id} style={{ background:"#0d0d1a", border:"1px solid "+(isLow?"rgba(255,179,71,0.35)":"#1a1a2e"), borderRadius:16, padding:20 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:15, fontFamily:"'Syne',sans-serif" }}>{lang==="ar"?(item.nameAr||item.name):item.name}</div>
                  {isLow && <div style={{ color:"#ffb347", fontSize:11, display:"flex", alignItems:"center", gap:3, marginTop:4 }}><Icon name="warn" size={11}/> Low stock</div>}
                </div>
                <div style={{ display:"flex", gap:5 }}>
                  <button onClick={()=>openEdit(item)} style={{ background:"#1a1a28", border:"none", borderRadius:7, width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center", color:"#00b8ff", cursor:"pointer" }}><Icon name="edit" size={13}/></button>
                  <button onClick={()=>del(item.id)} style={{ background:"#1a1a28", border:"none", borderRadius:7, width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center", color:"#ff4d6d", cursor:"pointer" }}><Icon name="trash" size={13}/></button>
                </div>
              </div>

              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:8 }}>
                <span style={{ fontSize:26, fontWeight:800, color:isLow?"#ffb347":"#00e5a0", fontFamily:"'Syne',sans-serif" }}>{item.stock}</span>
                <span style={{ color:"#555", fontSize:13 }}>{item.unit}</span>
              </div>

              <div style={{ background:"#12121e", borderRadius:5, height:6, overflow:"hidden", marginBottom:10 }}>
                <div style={{ background:isLow?"linear-gradient(90deg,#ffb347,#ff6b6b)":"linear-gradient(90deg,#00e5a0,#00b8ff)", height:"100%", width:pct+"%", borderRadius:5, transition:"width 0.5s ease" }}/>
              </div>

              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:usedIn.length>0?10:0 }}>
                <span style={{ fontSize:11, color:"#444" }}>min: {item.minStock} {item.unit}</span>
                {(item.totalUsed||0)>0 && <span style={{ fontSize:11, color:"#555" }}>{t.inventory.totalUsed}: {item.totalUsed} {item.unit}</span>}
              </div>

              {usedIn.length>0 && (
                <div style={{ fontSize:11, color:"#444", marginBottom:10 }}>{t.inventory.usedIn}: {usedIn.join(", ")}</div>
              )}

              {/* Quick stock adjustment */}
              {isAdj ? (
                <div style={{ display:"flex", gap:6, marginTop:8 }}>
                  <input type="number" step="0.1" value={adjustAmt} onChange={e=>setAdjustAmt(e.target.value)} placeholder="+2 or -1" style={{...inp,flex:1,padding:"9px 12px",fontSize:13}}/>
                  <button onClick={()=>doAdjust(item.id)} style={{ background:"linear-gradient(135deg,#00e5a0,#00b8ff)", border:"none", borderRadius:9, padding:"9px 14px", color:"#080810", fontWeight:700, cursor:"pointer" }}><Icon name="check" size={14}/></button>
                  <button onClick={()=>setAdjusting(null)} style={{ background:"#12121e", border:"1px solid #1e1e30", borderRadius:9, padding:"9px 12px", color:"#666", cursor:"pointer" }}><Icon name="x" size={14}/></button>
                </div>
              ) : (
                <button onClick={()=>setAdjusting(item.id)} style={{ width:"100%", marginTop:8, background:"#12121e", border:"1px solid #1e1e30", borderRadius:9, padding:"9px", color:"#666", fontWeight:600, fontSize:12, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                  <Icon name="plus" size={12}/> {t.inventory.adjustStock}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
