<template>
  <div class="p-6 pt-24 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition">
    <div class="mb-8 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
      <button 
        @click="updateFilter(null)"
        class="px-5 py-2 mr-3 rounded-full border transition text-sm font-medium"
        :class="!selectedBrand ? 'bg-teal-600 text-white border-teal-600' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-teal-500'"
      >
        {{ lang === 'id' ? 'Semua' : lang === 'jp' ? 'すべて' : 'All' }}
      </button>
      <button 
        v-for="brand in brands" :key="brand"
        @click="updateFilter(brand)"
        class="px-5 py-2 mr-3 rounded-full border transition text-sm font-medium"
        :class="selectedBrand === brand ? 'bg-teal-600 text-white border-teal-600' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-teal-500'"
      >
        {{ brand }}
      </button>
    </div>

    <h1 class="text-2xl font-bold mb-6">{{ searchQuery ? (lang === 'id' ? 'Hasil Pencarian' : 'Search Results') : (selectedBrand || 'Semua Produk') }}</h1>

    <div v-if="isLoading" class="text-center py-20 flex flex-col items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mb-4"></div>
      <p class="text-gray-500">Loading...</p>
    </div>

    <div v-else-if="filteredProducts.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
      <p class="text-gray-500 text-lg">{{ lang === 'id' ? 'Produk tidak ditemukan.' : 'Product not found.' }}</p>
      <div class="flex gap-4 mt-4">
        <button v-if="searchQuery" @click="resetSearch" class="text-teal-600 font-medium hover:underline">Reset Search</button>
        <button @click="resetAll" class="text-gray-500 font-medium hover:underline">See All</button>
      </div>
    </div>

    <div v-else>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        <ProductCard v-for="p in paginatedProducts" :key="p.id" :product="p" />
      </div>

      <div v-if="totalPages > 1" class="flex justify-center items-center mt-12 gap-4">
        <button 
          @click="prevPage" 
          :disabled="currentPage === 1" 
          class="px-4 py-2 bg-white dark:bg-gray-800 border rounded-lg disabled:opacity-50 transition hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Previous
        </button>
        <span class="text-gray-600 dark:text-gray-400 font-medium">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button 
          @click="nextPage" 
          :disabled="currentPage === totalPages" 
          class="px-4 py-2 bg-white dark:bg-gray-800 border rounded-lg disabled:opacity-50 transition hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import { store } from "../store";
import { useRoute, useRouter } from "vue-router";
import ProductCard from "../components/ProductCard.vue";

const route = useRoute();
const router = useRouter();
const lang = ref(localStorage.getItem("lang") || "id");
const isLoading = ref(true);
const selectedBrand = ref(route.query.brand || null);
const searchQuery = ref(route.query.q || "");
const currentPage = ref(1);
const itemsPerPage = 10; // 10 item (2 baris x 5 kolom) agar optimal
const brands = ["Vans", "Bohoo", "Mango", "Reebok", "Converse", "Sandro", "Nike", "Adidas", "Dior", "Puma", "Zara"];

const handleSearchEvent = (e) => {
  searchQuery.value = e.detail || "";
  currentPage.value = 1;
};

const filteredProducts = computed(() => {
  const allProducts = store.products || [];
  const s = searchQuery.value.toLowerCase().trim();
  const b = selectedBrand.value?.toLowerCase();

  return allProducts.filter(p => {
    const name = (p.name || "").toLowerCase();
    const brand = (p.brand || "").toLowerCase();
    const cat = (p.category || "").toLowerCase();
    
    const matchesSearch = !s || name.includes(s) || brand.includes(s) || cat.includes(s);
    const matchesBrand = !b || brand === b || cat === b;
    return matchesSearch && matchesBrand;
  });
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredProducts.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage));

// Logika Navigasi Pagination
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

const updateFilter = (brand) => {
  selectedBrand.value = brand;
  currentPage.value = 1;
  router.replace({ query: { ...route.query, brand: brand || undefined } });
};

const resetSearch = () => {
  searchQuery.value = "";
  currentPage.value = 1;
  router.replace({ query: { ...route.query, q: undefined } });
};

const resetAll = () => {
  selectedBrand.value = null;
  searchQuery.value = "";
  currentPage.value = 1;
  router.replace({ path: '/items', query: {} });
};

onMounted(() => {
  store.loadProducts();
  window.addEventListener("search", handleSearchEvent);
  setTimeout(() => { isLoading.value = false; }, 800);
});

onUnmounted(() => {
  window.removeEventListener("search", handleSearchEvent);
});

watch(() => route.query.brand, (newB) => { 
  selectedBrand.value = newB || null; 
  currentPage.value = 1;
});

watch(() => route.query.q, (newQ) => { 
  searchQuery.value = newQ || ""; 
  currentPage.value = 1;
});
</script>