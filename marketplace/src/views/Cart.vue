<template>
  <div class="pt-24 pb-10 px-6 max-w-7xl mx-auto min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition">
    
    <h1 class="text-2xl font-bold mb-6">
      {{ lang === 'id' ? 'Keranjang Belanja' : lang === 'jp' ? 'ショッピングカート' : 'Shopping Cart' }}
    </h1>

    <div v-if="store.cart.length === 0" class="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-lg shadow">
      <svg class="w-20 h-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
      </svg>
      <p class="text-lg text-gray-500 mb-4">
        {{ lang === 'id' ? 'Keranjang Anda kosong' : lang === 'jp' ? 'カートは空です' : 'Your cart is empty' }}
      </p>
      <button @click="$router.push('/')" class="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition">
        {{ lang === 'id' ? 'Mulai Belanja' : lang === 'jp' ? '買い物を始める' : 'Start Shopping' }}
      </button>
    </div>

    <div v-else class="flex flex-col lg:flex-row gap-8">
      
      <div class="flex-1 space-y-4">
        <div v-for="item in store.cart" :key="item.id" class="flex gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow items-center">
          <img 
            :src="item.image || 'https://via.placeholder.com/150'" 
            class="w-20 h-20 object-cover rounded bg-gray-100 border dark:border-gray-700" 
          />
          
          <div class="flex-1">
            <h3 class="font-semibold text-lg line-clamp-1 text-gray-800 dark:text-gray-100">
              {{ translate(item.name) }}
            </h3>
            
            <p class="text-teal-600 font-bold">
              {{ formatRupiah(item.price) }}
            </p>
            
            <p v-if="item.size" class="text-xs text-gray-500 mt-1">Size: {{ item.size }}</p>
          </div>

          <div class="flex items-center gap-3">
            <button 
              @click="store.updateQty(item.id, -1)" 
              class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center font-bold transition"
            >
              -
            </button>
            <span class="w-6 text-center font-medium">{{ item.qty }}</span>
            <button 
              @click="store.updateQty(item.id, 1)" 
              class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center font-bold transition"
            >
              +
            </button>
          </div>

          <button @click="store.removeFromCart(item.id)" class="text-red-500 hover:text-red-700 p-2 transition">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      </div>

      <div class="w-full lg:w-80 h-fit bg-white dark:bg-gray-800 p-6 rounded-lg shadow sticky top-24">
        <h3 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          {{ lang === 'id' ? 'Ringkasan' : lang === 'jp' ? '概要' : 'Summary' }}
        </h3>
        
        <div class="flex justify-between mb-2 text-gray-600 dark:text-gray-400">
          <span>Subtotal</span>
          <span>{{ formatRupiah(totalPrice) }}</span>
        </div>
        
        <div class="flex justify-between mb-2 text-gray-600 dark:text-gray-400">
           <span>{{ lang === 'id' ? 'Ongkir' : 'Shipping' }}</span>
           <span>{{ formatRupiah(totalShipping) }}</span>
        </div>

        <div class="border-t border-gray-200 dark:border-gray-700 my-4"></div>
        
        <div class="flex justify-between text-lg font-bold mb-6 text-gray-900 dark:text-white">
          <span>Total</span>
          <span class="text-teal-600">{{ formatRupiah(totalPrice + totalShipping) }}</span>
        </div>

        <button @click="$router.push('/checkout')" class="w-full bg-teal-600 text-white font-bold py-3 rounded-lg hover:bg-teal-700 transition shadow-lg active:scale-95 transform">
          {{ lang === 'id' ? 'Checkout' : lang === 'jp' ? 'チェックアウト' : 'Checkout' }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { store } from '../store';

const lang = ref(localStorage.getItem("lang") || "id");

// Helper Translate
const translate = (data) => {
  if (!data) return "";
  if (typeof data === 'object') return data[lang.value] || data['en'];
  return data;
};

const getPriceNumber = (price) => {
  if (typeof price === 'number') return price;
  if (typeof price === 'string') return parseInt(price.replace(/[^0-9]/g, '')) || 0;
  return 0;
};

// Hitung Subtotal
const totalPrice = computed(() => {
  return store.cart.reduce((acc, item) => {
    return acc + (getPriceNumber(item.price) * item.qty);
  }, 0);
});

// Hitung Ongkir
const totalShipping = computed(() => {
   return store.cart.reduce((acc, item) => {
      const shippingCost = getPriceNumber(item.shipping || 0);
      return acc + (shippingCost * item.qty);
   }, 0);
});

const formatRupiah = (num) => {
  // Cek dulu, kalau inputnya string, ubah ke angka dulu
  const n = getPriceNumber(num);
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(n);
};

const updateLanguage = () => { lang.value = localStorage.getItem("lang") || "id"; };

onMounted(() => { window.addEventListener("storage", updateLanguage); });
onUnmounted(() => { window.removeEventListener("storage", updateLanguage); });
</script>