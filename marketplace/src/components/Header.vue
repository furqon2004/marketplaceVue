<template>
  <header class="z-50 w-full shadow bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-between px-6 py-3 transition fixed top-0 left-0 right-0">
    <div class="font-bold text-2xl text-teal-600 dark:text-teal-400 flex items-center">
      <img :src="logoMarketplace" class="w-10 h-10 mr-2" alt="Logo Marketplace" />
      <a href="/">MarketPlace</a>
    </div>

    <div class="flex-1 px-10">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="getPlaceholder()"
        class="w-full border rounded-xl px-4 py-2 shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring focus:ring-teal-300 transition"
        @keyup.enter="handleSearch"
      />
    </div>

    <div class="flex items-center gap-5 mr-6">
      <div class="relative z-50">
        <button @click="toggleLangMenu" class="flex items-center gap-1 hover:text-teal-500 transition">
          <GlobeAltIcon class="h-6 w-6" />
          <span class="uppercase">{{ currentLanguage }}</span>
        </button>

        <div v-if="langMenuOpen" class="absolute right-0 mt-2 w-28 bg-white dark:bg-gray-800 border dark:border-gray-700 shadow rounded-lg py-2 z-50">
          <button class="w-full text-left px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700" @click="setLanguage('id')">Indonesia</button>
          <button class="w-full text-left px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700" @click="setLanguage('en')">English</button>
          <button class="w-full text-left px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700" @click="setLanguage('jp')">日本語</button>
        </div>
      </div>

      <button @click="toggleDark" class="hover:text-yellow-400 transition">
        <SunIcon v-if="!isDark" class="h-7 w-7" />
        <MoonIcon v-else class="h-7 w-7" />
      </button>
    </div>

    <div v-if="!user" class="flex gap-4">
      <RouterLink to="/login" class="text-teal-600 hover:underline">
        {{ currentLanguage === "id" ? "Masuk" : currentLanguage === "jp" ? "ログイン" : "Login" }}
      </RouterLink>

      <RouterLink to="/register" class="bg-teal-600 text-white px-4 py-1 rounded-xl hover:bg-teal-700">
        {{ currentLanguage === "id" ? "Daftar" : currentLanguage === "jp" ? "登録" : "Register" }}
      </RouterLink>
    </div>

    <div v-else class="flex items-center gap-6">
      <RouterLink to="/cart" class="relative transition hover:scale-110 hover:text-teal-600 cursor-pointer">
        <ShoppingCartIcon class="h-7 w-7" />
        <span v-if="store.cart && store.cart.length > 0" class="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm">
          {{ store.cart.length }}
        </span>
      </RouterLink>

      <RouterLink to="/wishlist" class="relative transition hover:scale-110 hover:text-red-600 cursor-pointer">
        <HeartIcon class="h-7 w-7" />
        <span v-if="store.wishlist && store.wishlist.length > 0" class="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm">
          {{ store.wishlist.length }}
        </span>
      </RouterLink>

      <div class="relative z-50">
        <img :src="currentPhoto" class="w-10 h-10 rounded-full cursor-pointer border transition hover:scale-105 object-cover" @click="toggleProfileMenu" />

        <div v-if="profileMenuOpen" class="absolute right-0 mt-2 bg-white dark:bg-gray-800 shadow border dark:border-gray-700 rounded-lg w-48 py-2 z-50">
          <RouterLink to="/profile" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">
            {{ currentLanguage === "id" ? "Profil Saya" : currentLanguage === "jp" ? "プロフィール" : "My Profile" }}
          </RouterLink>

          <RouterLink to="/my-products" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">
            {{ currentLanguage === "id" ? "Toko Saya" : currentLanguage === "jp" ? "出品リスト" : "My Shop" }}
          </RouterLink>

          <RouterLink to="/history" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">
            {{ currentLanguage === "id" ? "Riwayat Belanja" : currentLanguage === "jp" ? "購入履歴" : "Order History" }}
          </RouterLink>

          <div class="border-t border-gray-100 dark:border-gray-700 my-1"></div>

          <button @click="initiateLogout" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
            {{ currentLanguage === "id" ? "Keluar" : currentLanguage === "jp" ? "ログアウト" : "Logout" }}
          </button>
        </div>
      </div>
    </div>
  </header>

  <div v-if="showLogoutModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 border dark:border-gray-700 transform transition-all scale-100">
      <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
        {{ currentLanguage === "id" ? "Konfirmasi Keluar" : currentLanguage === "jp" ? "ログアウト確認" : "Confirm Logout" }}
      </h3>
      <p class="text-gray-500 dark:text-gray-400 mb-6">
        {{ currentLanguage === "id" ? "Apakah Anda yakin ingin keluar dari akun ini?" : currentLanguage === "jp" ? "本当にログアウトしますか？" : "Are you sure you want to log out from this account?" }}
      </p>
      <div class="flex justify-end gap-3">
        <button @click="showLogoutModal = false" class="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium">
          {{ currentLanguage === "id" ? "Batal" : currentLanguage === "jp" ? "キャンセル" : "Cancel" }}
        </button>
        <button @click="confirmLogout" class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition font-medium shadow-lg shadow-red-500/30">
          {{ currentLanguage === "id" ? "Ya, Keluar" : currentLanguage === "jp" ? "はい" : "Yes, Logout" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref as dbRef, onValue } from "firebase/database";
import { store } from "../store";
import logoImg from "@/assets/images/logo.png";

import { GlobeAltIcon, SunIcon, MoonIcon, ShoppingCartIcon, HeartIcon } from "@heroicons/vue/24/outline";

const logoMarketplace = logoImg;
const router = useRouter();

const user = ref(null);
const defaultAvatar = "https://i.pravatar.cc/100";
const currentPhoto = ref(defaultAvatar);
const currentLanguage = ref(localStorage.getItem("lang") || "id");
const langMenuOpen = ref(false);
const isDark = ref(false);
const searchQuery = ref("");
const profileMenuOpen = ref(false);
const showLogoutModal = ref(false);

onMounted(() => {
  const savedDarkMode = localStorage.getItem("darkMode") === "true";
  isDark.value = savedDarkMode;
  document.documentElement.classList.toggle("dark", savedDarkMode);

  onAuthStateChanged(auth, (u) => {
    user.value = u;

    if (u) {
      const userRef = dbRef(db, "users/" + u.uid);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data && data.photoURL) {
          currentPhoto.value = data.photoURL;
        } else {
          currentPhoto.value = defaultAvatar;
        }
      });
    } else {
      currentPhoto.value = defaultAvatar;
    }
  });

  window.addEventListener("click", closeMenus);
});

onUnmounted(() => {
  window.removeEventListener("click", closeMenus);
});

function closeMenus(e) {
  if (!e.target.closest(".relative")) {
    profileMenuOpen.value = false;
    langMenuOpen.value = false;
  }
}

function toggleProfileMenu() {
  profileMenuOpen.value = !profileMenuOpen.value;
  langMenuOpen.value = false;
}

function toggleLangMenu() {
  langMenuOpen.value = !langMenuOpen.value;
  profileMenuOpen.value = false;
}

function initiateLogout() {
  profileMenuOpen.value = false;
  showLogoutModal.value = true;
}

async function confirmLogout() {
  showLogoutModal.value = false;
  await signOut(auth);
  router.push("/login");
}

function setLanguage(lang) {
  currentLanguage.value = lang;
  localStorage.setItem("lang", lang);
  langMenuOpen.value = false;
  window.dispatchEvent(new Event("storage"));
}

function getPlaceholder() {
  if (currentLanguage.value === "id") return "Cari produk...";
  if (currentLanguage.value === "jp") return "商品を検索...";
  return "Search products...";
}

function handleSearch() {
  window.dispatchEvent(new CustomEvent("search", { detail: searchQuery.value }));
  router.push("/items");
}

function toggleDark() {
  isDark.value = !isDark.value;
}

watch(isDark, (value) => {
  document.documentElement.classList.toggle("dark", value);
  localStorage.setItem("darkMode", value);
  window.dispatchEvent(new CustomEvent("darkModeToggle", { detail: value }));
});
</script>
