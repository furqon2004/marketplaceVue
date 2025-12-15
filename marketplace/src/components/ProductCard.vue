<template>
  <div 
    @click="goToDetail"
    class="group bg-white dark:bg-gray-800 shadow rounded-lg p-3 cursor-pointer hover:shadow-xl transition border border-transparent hover:border-teal-500 relative flex flex-col h-full"
    :class="{'opacity-75 grayscale': isOutOfStock}" 
  >
    <div class="relative w-full h-48 mb-3 overflow-hidden rounded-md">
      <img 
        :src="product.image || 'https://via.placeholder.com/300?text=No+Image'" 
        class="w-full h-full object-cover transition duration-500 group-hover:scale-110" 
        alt="Product Image"
      />

      <button 
        @click.stop="toggleWishlist"
        :disabled="isOutOfStock"
        class="absolute top-2 right-2 p-2 rounded-full shadow-md transition transform hover:scale-110 z-10 disabled:opacity-50 disabled:cursor-not-allowed"
        :class="[
          isOutOfStock ? 'bg-gray-200 text-gray-400' : 
          (isInWishlist ? 'bg-red-50 text-red-500' : 'bg-white/80 text-gray-500 hover:text-red-500')
        ]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :fill="isInWishlist && !isOutOfStock ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      <span v-if="product.category" class="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm">
        {{ product.category }}
      </span>

      <div v-if="isOutOfStock" class="absolute inset-0 bg-black/50 flex items-center justify-center">
        <span class="bg-red-600 text-white px-3 py-1 text-xs font-bold rounded shadow-lg transform -rotate-12">SOLD OUT</span>
      </div>
    </div>

    <div class="flex flex-col flex-grow">
      <p class="font-bold text-teal-600 text-lg mb-1">{{ formatRupiah(product.price) }}</p>
      
      <p class="text-gray-700 dark:text-gray-300 text-sm font-medium line-clamp-2 leading-snug mb-2">
        {{ translate(product.name) }}
      </p>

      <div class="flex items-center justify-between mt-auto mb-2 text-xs">
        <div class="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300 font-medium">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
           </svg>
           {{ product.size || 'All Size' }}
        </div>

        <div class="font-medium" :class="isOutOfStock ? 'text-red-500' : 'text-teal-600'">
           {{ stockLabel }}
        </div>
      </div>

      <div class="flex items-center text-xs text-gray-400 border-t pt-2 dark:border-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {{ product.location || 'Indonesia' }}
      </div>
    </div>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { store } from '../store';

const props = defineProps({
  product: Object
});

const router = useRouter();
const lang = ref(localStorage.getItem("lang") || "id");

// === Helper Stock ===
const isOutOfStock = computed(() => {
  const stock = parseInt(props.product.stock);
  return !isNaN(stock) && stock <= 0;
});

const stockLabel = computed(() => {
  const stock = parseInt(props.product.stock);
  if (isNaN(stock)) return 'Ready Stock'; 
  if (stock <= 0) return 'Stok Habis';
  return `Stok: ${stock}`;
});

const translate = (data) => {
  if (!data) return "";
  if (typeof data === 'object') {
    return data[lang.value] || data['en'];
  }
  return data;
};

const formatRupiah = (price) => {
  const num = typeof price === 'string' ? parseInt(price.replace(/[^0-9]/g, '')) || 0 : price;
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR', 
    minimumFractionDigits: 0 
  }).format(num || 0);
};

const isInWishlist = computed(() => {
  if (!store.wishlist) return false;
  return store.wishlist.some(item => item.id === props.product.id);
});

const goToDetail = () => {
  router.push(`/product/${props.product.id}`);
};

const toggleWishlist = () => {
  // === CEK STOK DI SINI ===
  if (isOutOfStock.value) return; // Jika stok habis, hentikan fungsi (tidak bisa wishlist)

  store.toggleWishlist(props.product);
  if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
};

const updateLanguage = () => {
  lang.value = localStorage.getItem("lang") || "id";
};

onMounted(() => {
  window.addEventListener("storage", updateLanguage);
});

onUnmounted(() => {
  window.removeEventListener("storage", updateLanguage);
});
</script>