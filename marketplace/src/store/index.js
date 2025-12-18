import { reactive } from "vue";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";

export const store = reactive({
  user: null,
  products: [],
  cart: [],
  wishlist: [],

  setUser(u) {
    this.user = u;
    this.cart = [];
    this.wishlist = [];
    this.loadCart();
    this.loadWishlist();
  },

  getStorageKey(prefix) {
    return this.user ? `${prefix}_${this.user.uid}` : `${prefix}_guest`;
  },

  loadProducts() {
    const dbRef = ref(db, "products/");
    onValue(dbRef, (snap) => {
      const val = snap.val();
      if (val) {
        this.products = Object.keys(val).map((key) => ({
          id: key,
          ...val[key],
        }));
      } else {
        this.products = [];
      }
    });
  },

  addToCart(product) {
    if (!this.cart) this.cart = [];
    const existing = this.cart.find((item) => item.id === product.id);
    if (existing) {
      existing.qty++;
    } else {
      this.cart.push({ ...product, qty: 1 });
    }
    this.saveCart();
  },

  removeFromCart(id) {
    if (!this.cart) return;
    this.cart = this.cart.filter((item) => item.id !== id);
    this.saveCart();
  },

  updateQty(id, amount) {
    if (!this.cart) return;
    const item = this.cart.find((item) => item.id === id);
    if (item) {
      item.qty += amount;
      if (item.qty <= 0) this.removeFromCart(id);
    }
    this.saveCart();
  },

  saveCart() {
    const key = this.getStorageKey("cart");
    localStorage.setItem(key, JSON.stringify(this.cart));
  },

  loadCart() {
    const key = this.getStorageKey("cart");
    const saved = localStorage.getItem(key);
    this.cart = saved ? JSON.parse(saved) : [];
  },

  toggleWishlist(product) {
    if (!this.wishlist) this.wishlist = [];
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
    localStorage.setItem(key, JSON.stringify(this.wishlist));
  },

  loadWishlist() {
    const key = this.getStorageKey("wishlist");
    const saved = localStorage.getItem(key);
    this.wishlist = saved ? JSON.parse(saved) : [];
  },
});

store.loadCart();
store.loadWishlist();
