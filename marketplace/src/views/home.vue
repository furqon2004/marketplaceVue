<template>
  <div class="w-full bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition">

    <div class="relative w-full h-[300px] md:h-[520px] overflow-hidden pt-16 md:pt-20">
      <transition name="fade" mode="out-in">
        <img
          :key="currentImageIndex"
          :src="bannerImages[currentImageIndex]"
          class="w-full h-full object-cover"
          alt="Promo"
        />
      </transition>

      <div class="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        <button
          v-for="(_, index) in bannerImages"
          :key="index"
          @click="currentImageIndex = index; resetAutoPlay()"
          class="w-2 h-2 rounded-full transition-all duration-300"
          :class="currentImageIndex === index ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'"
        ></button>
      </div>

      <button @click="prevImage" class="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/30 hover:bg-white/60 text-white p-2 md:p-3 rounded-full transition">❮</button>
      <button @click="nextImage" class="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/30 hover:bg-white/60 text-white p-2 md:p-3 rounded-full transition">❯</button>
    </div>

    <div class="w-full px-4 md:px-10 mt-10">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl md:text-2xl font-semibold">
          {{ lang === 'id' ? 'Produk Populer' : lang === 'jp' ? '人気商品' : 'Popular items' }}
        </h2>
        <button @click="router.push('/items')" class="text-teal-500 hover:text-teal-600 font-medium text-sm">
          {{ lang === 'id' ? 'Lihat semua' : lang === 'jp' ? 'すべて見る' : 'See all' }}
        </button>
      </div>

      <div v-if="loading" class="flex justify-center py-20">
         <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
      </div>

      <div v-else-if="popularProducts.length === 0" class="flex flex-col items-center py-20 text-gray-500">
        <p>No products found.</p>
      </div>

      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
        <ProductCard 
          v-for="p in popularProducts"
          :key="p.id"
          :product="p"
        />
        
        <div
          class="bg-teal-50 border border-teal-200 flex flex-col items-center justify-center rounded-lg cursor-pointer hover:bg-teal-100 transition dark:bg-gray-800 dark:border-teal-600 h-full min-h-[200px]"
          @click="router.push('/items')"
        >
          <div class="p-3 bg-white dark:bg-gray-700 rounded-full mb-2 shadow-sm">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </div>
          <p class="text-teal-600 dark:text-teal-400 font-semibold">See All</p>
        </div>
      </div>
    </div>

    <div class="w-full px-4 md:px-10 mt-12">
      <h2 class="text-xl md:text-2xl font-semibold mb-4">
        {{ lang === 'id' ? 'Belanja berdasarkan Merek' : lang === 'jp' ? 'ブランドで探す' : 'Shop by brand' }}
      </h2>
      <div class="flex flex-wrap gap-3">
        <button
          v-for="b in brands"
          :key="b"
          @click="selectBrand(b)" 
          class="px-4 py-2 border rounded-full text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition active:scale-95"
        >
          {{ b }}
        </button>
      </div>
    </div>

    <div class="w-full px-4 md:px-10 mt-12 mb-20">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl md:text-2xl font-semibold">
          {{ lang === 'id' ? 'Produk Baru' : lang === 'jp' ? '新商品' : 'New Arrivals' }}
        </h2>
        <button class="text-teal-500 hover:text-teal-600 font-medium text-sm" @click="router.push('/items')">See all</button>
      </div>

      <div v-if="loading" class="flex justify-center py-20">
         <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
      </div>

      <div v-else-if="newProducts.length === 0" class="flex flex-col items-center py-20 text-gray-500">
        <p>No new products.</p>
      </div>

      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
        <ProductCard 
          v-for="n in newProducts"
          :key="n.id"
          :product="n"
        />

        <div
          class="bg-teal-50 border border-teal-200 flex flex-col items-center justify-center rounded-lg cursor-pointer hover:bg-teal-100 transition dark:bg-gray-800 dark:border-teal-600 h-full min-h-[200px]"
          @click="router.push('/items')"
        >
          <div class="p-3 bg-white dark:bg-gray-700 rounded-full mb-2 shadow-sm">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
          </div>
          <p class="text-teal-600 dark:text-teal-400 font-semibold">View More</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { db } from '../firebase'; 
import { ref as dbRef, onValue } from 'firebase/database';
import ProductCard from '../components/ProductCard.vue'; 

import promo1 from '../assets/images/promo1.png'
import promo2 from '../assets/images/promo2.png'
import promo3 from '../assets/images/promo3.png'

const router = useRouter();
const lang = ref(localStorage.getItem("lang") || "id");
const currentImageIndex = ref(0);
const autoPlayInterval = ref(null);
const bannerImages = [promo1, promo2, promo3];
const allProducts = ref([]);
const loading = ref(true);

const translate = (data) => {
  if (!data) return "";
  if (typeof data === 'object') return data[lang.value] || data['en'];
  return data;
};

const brands = [ "Vans", "Bohoo", "Mango", "Reebok", "Converse", "Sandro", "Nike", "Adidas", "Dior", "Puma", "Zara" ];

// Banner Logic
const nextImage = () => { currentImageIndex.value = (currentImageIndex.value + 1) % bannerImages.length; };
const prevImage = () => { currentImageIndex.value = (currentImageIndex.value - 1 + bannerImages.length) % bannerImages.length; };
const startAutoPlay = () => { autoPlayInterval.value = setInterval(nextImage, 5000); };
const resetAutoPlay = () => { clearInterval(autoPlayInterval.value); startAutoPlay(); };

// === LOGIC UTAMA: POPULAR & NEW PRODUCTS ===

// 1. Popular Products (RANDOM 4 ITEM)
// Kita acak array allProducts, lalu ambil 4 item pertama
const popularProducts = computed(() => {
  // Copy array biar aslinya gak keacak
  const shuffled = [...allProducts.value].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 4);
});

// 2. New Products (TERBARU 4 ITEM)
// Kita sort berdasarkan updatedAt (atau createdAt/uploaded) DESCENDING
const newProducts = computed(() => {
  return [...allProducts.value]
    .sort((a, b) => (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0))
    .slice(0, 4);
});

// ============================================

const updateLanguage = () => { lang.value = localStorage.getItem("lang") || "id"; };

onMounted(() => {
  startAutoPlay();
  window.addEventListener("storage", updateLanguage);

  const productsRef = dbRef(db, 'products');
  onValue(productsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      allProducts.value = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));
    } else {
      allProducts.value = [];
    }
    loading.value = false;
  });
});

onUnmounted(() => {
  clearInterval(autoPlayInterval.value);
  window.removeEventListener("storage", updateLanguage);
});

const selectBrand = (brandName) => {
  router.push({ path: '/items', query: { brand: brandName } });
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.6s ease-in-out; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.fade-enter-to, .fade-leave-from { opacity: 1; }
</style>