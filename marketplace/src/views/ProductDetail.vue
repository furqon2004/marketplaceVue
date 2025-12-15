<template>
  <div class="pt-24 pb-10 px-6 max-w-7xl mx-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition min-h-screen relative">
    
    <div v-if="loading" class="text-center py-40 flex flex-col items-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mb-4"></div>
      <p class="text-gray-500">
        {{ lang === 'id' ? 'Memuat detail produk...' : lang === 'jp' ? '商品の詳細を読み込んでいます...' : 'Loading product details...' }}
      </p>
    </div>

    <div v-else-if="!product" class="text-center py-20">
      <h2 class="text-2xl font-bold mb-2">404</h2>
      <p>
        {{ lang === 'id' ? 'Produk tidak ditemukan' : lang === 'jp' ? '商品が見つかりません' : 'Product not found' }}
      </p>
      <button @click="router.push('/')" class="mt-4 text-teal-600 hover:underline">
        {{ lang === 'id' ? 'Kembali ke Beranda' : lang === 'jp' ? 'ホームに戻る' : 'Back to Home' }}
      </button>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        <div class="w-full">
          <img 
            :src="product.image || 'https://via.placeholder.com/500?text=No+Image'" 
            alt="Product Image" 
            class="w-full h-[400px] md:h-[500px] object-cover rounded-lg shadow-md bg-gray-100 border dark:border-gray-700"
          />
        </div>

        <div class="flex flex-col">
          
          <h1 class="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-1">
            {{ formatPrice(product.price) }}
          </h1>

          <p class="text-sm font-medium mb-4" :class="getStock(product.stock) === 0 ? 'text-red-600' : 'text-gray-500'">
             <span v-if="getStock(product.stock) > 0">
               {{ lang === 'id' ? 'Stok Tersedia' : lang === 'jp' ? '在庫あり' : 'In Stock' }}: {{ getStock(product.stock) }}
             </span>
             <span v-else>
               {{ lang === 'id' ? 'Stok Habis' : lang === 'jp' ? '在庫切れ' : 'Out of Stock' }}
             </span>
          </p>
          
          <div class="flex items-start justify-between gap-4 mb-2">
            <h2 class="text-xl font-medium text-gray-800 dark:text-gray-200 leading-snug">
              {{ translate(product.name) }}
            </h2>

            <button 
              @click="toggleWishlist"
              class="p-2 rounded-full transition duration-300 shadow-sm border flex-shrink-0"
              :class="isInWishlist 
                ? 'bg-red-50 border-red-200 text-red-500' 
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 hover:text-red-400'"
              :title="lang === 'id' ? 'Tambah ke Wishlist' : 'Add to Wishlist'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 transition-transform active:scale-90" :fill="isInWishlist ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
          
          <div class="text-sm text-gray-500 dark:text-gray-400 mb-6 flex flex-wrap gap-3 items-center">
            <span class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              {{ lang === 'id' ? 'Ukuran' : lang === 'jp' ? 'サイズ' : 'Size' }}: {{ product.size || '-' }}
            </span> 
            <span class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{{ translate(product.condition) }}</span> 
            <span class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Indonesia
            </span>
          </div>

          <div class="mb-6">
            <h3 class="font-semibold mb-2">
               {{ lang === 'id' ? 'Deskripsi Barang' : lang === 'jp' ? '商品説明' : 'Item Description' }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
              {{ translate(product.description) }}
            </p>
          </div>

          <div class="mb-8 text-sm border-t border-b py-4 dark:border-gray-700">
            <div class="grid grid-cols-2 gap-y-3">
              <span class="text-gray-500">{{ getLabel('category') }}</span> 
              <span class="font-medium text-right">{{ translate(product.category) }}</span>

              <span class="text-gray-500">{{ getLabel('size') }}</span> 
              <span class="font-medium text-right">{{ product.size || '-' }}</span>

              <span class="text-gray-500">{{ getLabel('condition') }}</span> 
              <span class="font-medium text-right">{{ translate(product.condition) }}</span>

              <span class="text-gray-500">{{ getLabel('color') }}</span> 
              <span class="font-medium text-right">{{ translate(product.color) || '-' }}</span>

              <span class="text-gray-500">{{ getLabel('uploaded') }}</span> 
              <span class="font-medium text-right">{{ product.uploaded }}</span>

              <span class="text-gray-500">{{ getLabel('shipping') }}</span> 
              <span class="font-medium text-right">{{ formatPrice(product.shipping) }}</span>
            </div>
          </div>

          <div class="flex flex-col gap-3 mb-6">
            <button 
              @click="buyNow"
              :disabled="getStock(product.stock) <= 0"
              class="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
               {{ lang === 'id' ? 'Beli Sekarang' : lang === 'jp' ? '今すぐ購入' : 'Buy Now' }}
            </button>
            
            <button 
              @click="handleAddToCart(false)"
              :disabled="getStock(product.stock) <= 0"
              class="w-full bg-white dark:bg-gray-800 border border-teal-600 text-teal-600 dark:text-teal-400 font-bold py-3 rounded hover:bg-teal-50 dark:hover:bg-gray-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
               </svg>
               {{ lang === 'id' ? 'Tambah ke Keranjang' : lang === 'jp' ? 'カートに追加' : 'Add to Cart' }}
            </button>
          </div>

          <div class="border rounded-lg p-4 flex items-center gap-4 shadow-sm dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <img src="https://ui-avatars.com/api/?name=Seller&background=random" class="w-12 h-12 rounded-full" alt="Seller">
            <div>
              <p class="font-bold text-sm">Official Seller</p>
              <div class="flex text-yellow-400 text-xs">
                ★★★★★ <span class="text-gray-400 ml-1">(Verified)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-16">
        <h3 class="text-xl font-bold mb-6">
           {{ lang === 'id' ? 'Produk Lainnya' : lang === 'jp' ? '他の商品' : 'Other Product' }}
        </h3>
        <div v-if="relatedProducts.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <ProductCard 
            v-for="p in relatedProducts" 
            :key="p.id" 
            :product="p" 
          />
        </div>
        <div v-else class="text-gray-500 italic">
           {{ lang === 'id' ? 'Tidak ada produk lain.' : lang === 'jp' ? '他の商品はありません。' : 'No other products.' }}
        </div>
      </div>
    </div>

    <div v-if="showCartModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 transition-opacity">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 max-w-sm w-full text-center transform transition-all scale-100">
        
        <div class="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-5 shadow-sm">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
           </svg>
        </div>

        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
          {{ lang === 'id' ? 'Berhasil Masuk Keranjang!' : lang === 'jp' ? 'カートに追加されました！' : 'Added to Cart!' }}
        </h3>

        <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
          "{{ translate(product?.name) }}"
        </p>

        <div class="flex flex-col gap-3">
          <button 
            @click="showCartModal = false"
            class="w-full border border-teal-600 text-teal-600 dark:text-teal-400 font-medium py-2 rounded hover:bg-teal-50 dark:hover:bg-gray-700 transition"
          >
            {{ lang === 'id' ? 'Lanjut Belanja' : lang === 'jp' ? '買い物を続ける' : 'Continue Shopping' }}
          </button>

          <button 
            @click="router.push('/cart')"
            class="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 rounded transition shadow"
          >
            {{ lang === 'id' ? 'Lihat Keranjang' : lang === 'jp' ? 'カートを見る' : 'Go to Cart' }}
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { store } from '../store';
import { db } from '../firebase'; 
import { ref as dbRef, get, child } from 'firebase/database'; 
import ProductCard from '../components/ProductCard.vue';

const route = useRoute();
const router = useRouter();
const product = ref(null);
const allProducts = ref([]);
const loading = ref(true);
const lang = ref(localStorage.getItem("lang") || "id");
const showCartModal = ref(false);

const formatPrice = (value) => {
  if (!value && value !== 0) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
};

const getStock = (stockVal) => {
  return parseInt(stockVal || 0);
};

const updateLanguage = () => { lang.value = localStorage.getItem("lang") || "id"; };

const translate = (data) => {
  if (!data) return "";
  if (typeof data === 'object') return data[lang.value] || data['en'];
  return data;
};

const getLabel = (key) => {
  const labels = {
    category: { id: 'Kategori', en: 'Category', jp: 'カテゴリー' },
    size: { id: 'Ukuran', en: 'Size', jp: 'サイズ' },
    condition: { id: 'Kondisi', en: 'Condition', jp: '状態' },
    color: { id: 'Warna', en: 'Color', jp: '色' },
    uploaded: { id: 'Diunggah', en: 'Uploaded', jp: 'アップロード' },
    shipping: { id: 'Ongkir', en: 'Shipping', jp: '送料' },
  };
  return labels[key] ? labels[key][lang.value] : key;
};

const fetchProduct = async () => {
  loading.value = true;
  const productId = route.params.id; 

  try {
    const dbReference = dbRef(db);
    const snapshot = await get(child(dbReference, `products/${productId}`));

    if (snapshot.exists()) {
      product.value = { id: productId, ...snapshot.val() };
      const allSnapshot = await get(child(dbReference, `products`));
      if (allSnapshot.exists()) {
        const data = allSnapshot.val();
        allProducts.value = Object.keys(data).map(key => ({ id: key, ...data[key] }));
      }
    } else {
      product.value = null;
    }
  } catch (error) {
    console.error("Error fetching product:", error);
  } finally {
    loading.value = false;
  }
};

const relatedProducts = computed(() => {
  if (allProducts.value.length > 0 && product.value) {
    return allProducts.value
      .filter(p => p.id !== product.value.id) 
      .slice(0, 4); 
  }
  return [];
});

const isInWishlist = computed(() => {
  if (!product.value || !store.wishlist) return false;
  return store.wishlist.some(item => item.id === product.value.id);
});

const toggleWishlist = () => {
  if (product.value) {
    store.toggleWishlist(product.value);
  }
};

const buyNow = () => {
  if (product.value) {
    const currentStock = getStock(product.value.stock);
    if (currentStock <= 0) {
        alert(lang.value === 'id' ? 'Maaf, stok habis.' : lang.value === 'jp' ? '申し訳ありませんが、在庫切れです。' : 'Sorry, out of stock.');
        return;
    }
    store.addToCart(product.value);
    router.push('/checkout');
  }
};

const handleAddToCart = (redirect) => {
  if (product.value) {
    const currentStock = getStock(product.value.stock);
    if (currentStock <= 0) {
        alert(lang.value === 'id' ? 'Maaf, stok habis.' : lang.value === 'jp' ? '申し訳ありませんが、在庫切れです。' : 'Sorry, out of stock.');
        return;
    }

    store.addToCart(product.value);
    
    if (redirect) {
      router.push('/cart'); 
    } else {
      showCartModal.value = true;
    }
  }
};

watch(() => route.params.id, (newId) => {
  if(newId) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchProduct();
  }
});

onMounted(() => {
  window.scrollTo(0, 0);
  fetchProduct();
  window.addEventListener("storage", updateLanguage);
});

onUnmounted(() => {
  window.removeEventListener("storage", updateLanguage);
});
</script>