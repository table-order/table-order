import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

type Order = {
  id: string; // 주문 ID (예: UUID 또는 타임스탬프)
  items: CartItem[];
  totalPrice: number;
  orderTime: string;
};

type CartState = {
  cartItems: CartItem[];
  orders: Order[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  completeOrder: () => void; // 주문 완료 함수
  getOrderHistory: () => Order[];
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      orders: [],
      addToCart: (item) =>
        set((state) => {
          const existingItem = state.cartItems.find((i) => i.id === item.id);
          if (existingItem) {
            return {
              cartItems: state.cartItems.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { cartItems: [...state.cartItems, item] };
        }),
      removeFromCart: (id) =>
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        })),
      getTotalItems: () => {
        const { cartItems } = get();
        return cartItems.reduce((total, item) => total + item.quantity, 0);
      },
      getTotalPrice: () => {
        const { cartItems } = get();
        return cartItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
      completeOrder: () => {
        const { cartItems, getTotalPrice } = get();
        const order: Order = {
          id: Date.now().toString(),
          items: [...cartItems],
          totalPrice: getTotalPrice(),
          orderTime: new Date().toLocaleString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
        };
        set((state) => ({
          orders: [order, ...state.orders],
          cartItems: [],
        }));
      },
      getOrderHistory: () => {
        const { orders } = get();
        return orders; // 주문 내역 반환
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
