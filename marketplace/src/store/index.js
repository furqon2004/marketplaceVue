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
  },

  loadProducts() {
    const dbRef = ref(db, "products/");
    onValue(dbRef, (snap) => {
      const val = snap.val();
      if (val) {
        // === PERBAIKAN DI SINI ===
        this.products = Object.keys(val).map((key) => ({
          id: key, // Masukkan Key Firebase sebagai ID
          ...val[key], // Masukkan sisa data produk (nama, harga, dll)
        }));
      } else {
        this.products = [];
      }
    });
  },

  // === LOGIKA CART ===
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
    localStorage.setItem("cart", JSON.stringify(this.cart));
  },

  loadCart() {
    const saved = localStorage.getItem("cart");
    if (saved) this.cart = JSON.parse(saved);
    else this.cart = [];
  },

  // === LOGIKA WISHLIST ===
  toggleWishlist(product) {
    if (!this.wishlist) this.wishlist = [];

    const index = this.wishlist.findIndex((item) => item.id === product.id);
    if (index === -1) {
      this.wishlist.push(product);
    } else {
      this.wishlist.splice(index, 1);
    }
    localStorage.setItem("wishlist", JSON.stringify(this.wishlist));
  },

  loadWishlist() {
    const saved = localStorage.getItem("wishlist");
    if (saved) this.wishlist = JSON.parse(saved);
    else this.wishlist = [];
  },
});

// Load data saat aplikasi mulai
store.loadCart();
store.loadWishlist();
