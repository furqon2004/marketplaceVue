import { createRouter, createWebHistory } from "vue-router";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

// === 1. IMPORT SEMUA VIEW ===
import Home from "../views/home.vue";
import AllItems from "../views/AllItems.vue";
import ProductDetail from "../views/ProductDetail.vue";
import Login from "../views/login.vue";
import Register from "../views/Register.vue";
import Cart from "../views/Cart.vue";
import Wishlist from "../views/Wishlist.vue";
import CheckoutView from "../views/CheckoutView.vue";
import HistoryView from "../views/HistoryView.vue";

// --- TAMBAHKAN INI (Pastikan nama filenya sesuai dengan yang Anda simpan) ---
import ProfileView from "../views/ProfileView.vue";
import MyProduct from "../views/MyProduct.vue";
import ChangePasswordView from "../views/ChangePasswordView.vue";

const routes = [
  // Halaman Utama
  {
    path: "/",
    name: "Home",
    component: Home,
  },

  // Halaman Semua Produk
  {
    path: "/items",
    name: "AllItems",
    component: AllItems,
  },

  // Halaman Detail Produk
  {
    path: "/product/:id",
    name: "ProductDetail",
    component: ProductDetail,
  },

  // Halaman Cart (Butuh Login)
  {
    path: "/cart",
    name: "Cart",
    component: Cart,
    meta: { requiresAuth: true },
  },

  // Halaman Wishlist (Butuh Login)
  {
    path: "/wishlist",
    name: "Wishlist",
    component: Wishlist,
    meta: { requiresAuth: true },
  },

  // Halaman Checkout (Butuh Login)
  {
    path: "/checkout",
    name: "Checkout",
    component: CheckoutView,
    meta: { requiresAuth: true },
  },

  // --- TAMBAHKAN ROUTE PROFILE DISINI ---
  {
    path: "/profile",
    name: "Profile",
    component: ProfileView,
    meta: { requiresAuth: true }, 
  },
  {
    path: "/change-password",
    name: "ChangePassword",
    component: ChangePasswordView,
    meta: { requiresAuth: true },
  },
  {
    path: "/history",
    name: "History",
    component: HistoryView,
    meta: { requiresAuth: true },
  },
  {
    path: "/my-products",
    name: "MyProduct",
    component: MyProduct,
    meta: { requiresAuth: true },
  },

  // Halaman Login & Register (Hanya untuk Guest/Tamu)
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { requiresGuest: true },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { requiresGuest: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Scroll ke paling atas saat pindah halaman
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

// ===============================
// WAIT FOR FIREBASE AUTH READY
// ===============================
let currentUser = null;
let authReady = false;

onAuthStateChanged(auth, (user) => {
  currentUser = user;
  authReady = true;
});

// ===============================
// ROUTER GUARDS
// ===============================
router.beforeEach((to, from, next) => {
  if (!authReady) {
    const unwatch = setInterval(() => {
      if (authReady) {
        clearInterval(unwatch);
        handleAuthCheck(to, next);
      }
    }, 50);
  } else {
    handleAuthCheck(to, next);
  }
});

function handleAuthCheck(to, next) {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresGuest = to.matched.some((record) => record.meta.requiresGuest);

  if (requiresAuth && !currentUser) {
    next("/login");
  } else if (requiresGuest && currentUser) {
    next("/");
  } else {
    next();
  }
}

export default router;
