import { reactive } from "vue";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";

export const store = reactive({
  user: null,
  products: [],
  cart: [],
  wishlist: [],
  showLoginAlert: false,

  setUser(u) {
    this.user = u;
    if (u) {
      this.loadCart();
      this.loadWishlist();
    } else {
      this.cart = [];
      this.wishlist = [];
    }
  },

  getStorageKey(prefix) {
    return this.user ? `${prefix}_${this.user.uid}` : null;
  },

  loadProducts() {
    const dbRef = ref(db, "products/");
    onValue(dbRef, (snap) => {
      const val = snap.val();
      this.products = val ? Object.keys(val).map((key) => ({ id: key, ...val[key] })) : [];
    });
  },

  addToCart(product) {
    if (!this.user) {
      this.showLoginAlert = true;
      return;
    }
    const existing = this.cart.find((item) => item.id === product.id);
    if (existing) {
      existing.qty++;
    } else {
      this.cart.push({ ...product, qty: 1 });
    }
    this.saveCart();
  },

  removeFromCart(id) {
    if (!this.user) return;
    this.cart = this.cart.filter((item) => item.id !== id);
    this.saveCart();
  },

  updateQty(id, amount) {
    if (!this.user) return;
    const item = this.cart.find((item) => item.id === id);
    if (item) {
      item.qty += amount;
      if (item.qty <= 0) this.removeFromCart(id);
      else this.saveCart();
    }
  },

  saveCart() {
    const key = this.getStorageKey("cart");
    if (key) localStorage.setItem(key, JSON.stringify(this.cart));
  },

  loadCart() {
    const key = this.getStorageKey("cart");
    const saved = key ? localStorage.getItem(key) : null;
    this.cart = saved ? JSON.parse(saved) : [];
  },

  toggleWishlist(product) {
    if (!this.user) {
      this.showLoginAlert = true;
      return;
    }
    const index = this.wishlist.findIndex((item) => item.id === product.id);
    if (index === -1) {
      this.wishlist.push(product);
    } else {
      this.wishlist.splice(index, 1);
    }
    this.saveWishlist();
  },

  saveWishlist() {
    const key = this.getStorageKey("wishlist");
    if (key) localStorage.setItem(key, JSON.stringify(this.wishlist));
  },

  loadWishlist() {
    const key = this.getStorageKey("wishlist");
    const saved = key ? localStorage.getItem(key) : null;
    this.wishlist = saved ? JSON.parse(saved) : [];
  },
});

store.loadProducts();
