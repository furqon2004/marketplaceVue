<template>
  <div class="p-6 pt-24 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition">
    
    <div class="mb-8 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
      <button 
        @click="updateFilter(null)"
        class="px-5 py-2 mr-3 rounded-full border transition text-sm font-medium"
        :class="!selectedBrand 
          ? 'bg-teal-600 text-white border-teal-600' 
          : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-teal-500'"
      >
        {{ lang === 'id' ? 'Semua' : 'All' }}
      </button>

      <button 
        v-for="brand in brands" 
        :key="brand"
        @click="updateFilter(brand)"
        class="px-5 py-2 mr-3 rounded-full border transition text-sm font-medium"
        :class="selectedBrand === brand 
          ? 'bg-teal-600 text-white border-teal-600' 
          : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-teal-500'"
      >
        {{ brand }}
      </button>
    </div>

    <h1 class="text-2xl font-bold mb-6">
      {{ getTitle }}
    </h1>

    <div v-if="isLoading" class="text-center py-20 flex flex-col items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mb-4"></div>
      <p class="text-gray-500">Loading...</p>
    </div>

    <div v-else-if="filteredProducts.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
      <p class="text-gray-500 text-lg">Product not found.</p>
      <button @click="updateFilter(null)" class="mt-4 text-teal-600 font-medium hover:underline">See All Products</button>
    </div>

    <div v-else>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <ProductCard 
          v-for="p in paginatedProducts" 
          :key="p.id" 
          :product="p" 
        />
      </div>

      <div v-if="totalPages > 1" class="flex justify-center items-center mt-12 gap-4">
        <button 
          @click="prevPage" 
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Previous
        </button>
        
        <span class="text-gray-600 dark:text-gray-400 font-medium">
          Page {{ currentPage }} of {{ totalPages }}
        </span>

        <button 
          @click="nextPage" 
          :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Next
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { store } from "../store";
import { useRoute, useRouter } from "vue-router";
import ProductCard from "../components/ProductCard.vue";

const route = useRoute();
const router = useRouter();
const lang = ref(localStorage.getItem("lang") || "id");
const isLoading = ref(true);
const selectedBrand = ref(null);

// === KONFIGURASI PAGINATION ===
const currentPage = ref(1);
const itemsPerPage = 8;
const brands = [ "Vans", "Bohoo", "Mango", "Reebok", "Converse", "Sandro", "Nike", "Adidas", "Dior", "Puma", "Zara" ];

const updateLanguage = () => { lang.value = localStorage.getItem("lang") || "id"; };

const updateFilter = (brand) => {
  selectedBrand.value = brand;
  currentPage.value = 1; 
  
  if (brand) {
    router.replace({ query: { ...route.query, brand: brand } });
  } else {
    router.replace({ query: { ...route.query, brand: undefined } });
  }
};

const getTitle = computed(() => {
  if (selectedBrand.value) return `${selectedBrand.value}`;
  return lang.value === 'id' ? 'Semua Produk' : 'All Products';
});

// 1. Filter Produk dulu berdasarkan Brand/Kategori
const filteredProducts = computed(() => {
  if (!store.products || store.products.length === 0) return [];
  if (!selectedBrand.value) return store.products;
  
  return store.products.filter(p => 
    p.category && p.category.toLowerCase() === selectedBrand.value.toLowerCase()
  );
});

// 2. Potong hasil filter untuk Pagination
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredProducts.value.slice(start, end);
});

// 3. Hitung total halaman
const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage);
});

// Fungsi Navigasi
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

onMounted(() => {
  store.loadProducts();
  if (route.query.brand) selectedBrand.value = route.query.brand;
  
  const interval = setInterval(() => {
    if (store.products.length > 0) {
      isLoading.value = false;
      clearInterval(interval);
    }
  }, 300);

  setTimeout(() => { isLoading.value = false; clearInterval(interval); }, 2000);

  window.addEventListener("storage", updateLanguage);
});

onUnmounted(() => {
  window.removeEventListener("storage", updateLanguage);
});
</script>