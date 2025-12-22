<template>
  <div class="w-full bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition">

    <div class="relative w-full h-[300px] md:h-[520px] overflow-hidden pt-16 md:pt-20">
      <transition name="fade" mode="out-in">
        <img 
          :key="currentImageIndex" 
          :src="bannerImages[currentImageIndex]" 
          class="w-full h-full object-cover" 
          alt="Promo"
          fetchpriority="high"
          loading="eager"
          decoding="async"
        />
      </transition>

      <div class="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        <button v-for="(_, index) in bannerImages" :key="index" @click="currentImageIndex = index; resetAutoPlay()" class="w-2 h-2 rounded-full transition-all duration-300" :class="currentImageIndex === index ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'"></button>
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

      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
        <ProductCard v-for="p in popularProducts" :key="p.id" :product="p" />
        <div class="bg-teal-50 border border-teal-200 flex flex-col items-center justify-center rounded-lg cursor-pointer hover:bg-teal-100 transition dark:bg-gray-800 dark:border-teal-600 h-full min-h-[200px]" @click="router.push('/items')">
          <div class="p-3 bg-white dark:bg-gray-700 rounded-full mb-2 shadow-sm">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </div>
          <p class="text-teal-600 dark:text-teal-400 font-semibold">See All</p>
        </div>
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

      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
        <ProductCard v-for="n in newProducts" :key="n.id" :product="n" />
        <div class="bg-teal-50 border border-teal-200 flex flex-col items-center justify-center rounded-lg cursor-pointer hover:bg-teal-100 transition dark:bg-gray-800 dark:border-teal-600 h-full min-h-[200px]" @click="router.push('/items')">
          <div class="p-3 bg-white dark:bg-gray-700 rounded-full mb-2 shadow-sm">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
          </div>
          <p class="text-teal-600 dark:text-teal-400 font-semibold">View More</p>
        </div>
      </div>
    </div>

    <transition name="pop">
      <div v-if="store.showLoginAlert" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-sm w-full p-8 border dark:border-gray-700 text-center">
          <div class="w-20 h-20 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h3 class="text-2xl font-black text-gray-900 dark:text-white mb-3">
            {{ lang === 'id' ? 'Ops! Belum Masuk' : lang === 'jp' ? 'ログインが必要' : 'Oops! Not Logged In' }}
          </h3>
          <p class="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed text-sm">
            {{ lang === 'id' ? 'Silakan login terlebih dahulu untuk menambah produk ke keranjang atau wishlist.' : lang === 'jp' ? 'カートやウィッシュリストに商品を追加するには、ログインしてください。' : 'Please log in first to add products to your cart or wishlist.' }}
          </p>
          <div class="flex flex-col gap-3">
            <button @click="router.push('/login'); store.showLoginAlert = false" class="w-full py-4 rounded-2xl bg-teal-600 text-white hover:bg-teal-700 transition font-bold shadow-lg shadow-teal-500/30 active:scale-95">
              {{ lang === 'id' ? 'Masuk Sekarang' : lang === 'jp' ? 'ログインする' : 'Login Now' }}
            </button>
            <button @click="store.showLoginAlert = false" class="w-full py-4 rounded-2xl text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition font-bold text-sm">
              {{ lang === 'id' ? 'Mungkin Nanti' : lang === 'jp' ? '後で' : 'Maybe Later' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { db } from '../firebase'; 
import { ref as dbRef, onValue, query, limitToLast } from 'firebase/database';
import ProductCard from '../components/ProductCard.vue'; 
import { store } from '../store';

import promo1 from '../assets/images/promo1.png'
import promo2 from '../assets/images/promo2.png'
import promo3 from '../assets/images/promo3.png'

const router = useRouter();
const lang = ref(localStorage.getItem("lang") || "id");
const currentImageIndex = ref(0);
const autoPlayInterval = ref(null);
const bannerImages = [promo1, promo2, promo3];
const loading = ref(true);
const popularProducts = ref([]);
const newProducts = ref([]);

const nextImage = () => { currentImageIndex.value = (currentImageIndex.value + 1) % bannerImages.length; };
const prevImage = () => { currentImageIndex.value = (currentImageIndex.value - 1 + bannerImages.length) % bannerImages.length; };
const startAutoPlay = () => { autoPlayInterval.value = setInterval(nextImage, 5000); };
const resetAutoPlay = () => { clearInterval(autoPlayInterval.value); startAutoPlay(); };
const updateLanguage = () => { lang.value = localStorage.getItem("lang") || "id"; };

onMounted(() => {
  // --- OPTIMASI: Preload Gambar Banner ---
  bannerImages.forEach((image) => {
    const img = new Image();
    img.src = image;
  });

  startAutoPlay();
  window.addEventListener("storage", updateLanguage);
  const productsBaseRef = dbRef(db, 'products');

  onValue(query(productsBaseRef, limitToLast(8)), (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const mapped = Object.keys(data).map(key => ({ id: key, ...data[key] }));
      newProducts.value = [...mapped].reverse().slice(0, 4);
      popularProducts.value = mapped.sort(() => 0.5 - Math.random()).slice(0, 4);
    }
    loading.value = false;
  });
});

onUnmounted(() => {
  clearInterval(autoPlayInterval.value);
  window.removeEventListener("storage", updateLanguage);
});

const selectBrand = (brandName) => { router.push({ path: '/items', query: { brand: brandName } }); };
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.6s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.pop-enter-active { transition: all 0.3s ease-out; }
.pop-leave-active { transition: all 0.2s ease-in; }
.pop-enter-from { opacity: 0; transform: scale(0.9) translateY(20px); }
.pop-leave-to { opacity: 0; transform: scale(0.9); }
</style>