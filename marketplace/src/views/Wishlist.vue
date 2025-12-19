<template>
  <div class="pt-24 pb-10 px-6 max-w-7xl mx-auto min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition">
    
    <h1 class="text-2xl font-bold mb-6">
      {{ lang === 'id' ? 'Wishlist Saya' : lang === 'jp' ? 'ウィッシュリスト' : 'My Wishlist' }}
    </h1>

    <div v-if="store.wishlist.length === 0" class="text-center py-20">
      <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
      </svg>
      <p class="text-gray-500">
        {{ lang === 'id' ? 'Belum ada item favorit' : lang === 'jp' ? 'お気に入りのアイテムはありません' : 'No favorite items yet' }}
      </p>
    </div>

    <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-6">
      <div v-for="item in store.wishlist" :key="item.id" class="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition p-3 relative group">
        
        <button @click="store.toggleWishlist(item)" class="absolute top-2 right-2 bg-white dark:bg-gray-700 p-1.5 rounded-full shadow hover:bg-red-50 text-red-500 z-10">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <div @click="$router.push('/product/'+item.id)" class="cursor-pointer">
          <img :src="item.image" class="w-full h-40 object-cover rounded mb-3" />
          <p class="font-semibold line-clamp-1">{{ translate(item.name) }}</p>
          <p class="text-teal-600 font-bold mb-3">{{ formatPrice(item.price) }}</p>
        </div>

        <button @click="moveToCart(item)" class="w-full bg-teal-600 text-white text-sm py-2 rounded hover:bg-teal-700 transition">
          {{ lang === 'id' ? '+ Keranjang' : lang === 'jp' ? '+ カート' : '+ Cart' }}
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { store } from '../store';
import { useRouter } from 'vue-router';

const lang = ref(localStorage.getItem("lang") || "id");
const router = useRouter();

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

const translate = (data) => {
  if (!data) return "";
  if (typeof data === 'object') return data[lang.value] || data['en'];
  return data;
};

const moveToCart = (item) => {
  store.addToCart(item);
  store.toggleWishlist(item);
};

const updateLanguage = () => { lang.value = localStorage.getItem("lang") || "id"; };
onMounted(() => { window.addEventListener("storage", updateLanguage); });
onUnmounted(() => { window.removeEventListener("storage", updateLanguage); });
</script>