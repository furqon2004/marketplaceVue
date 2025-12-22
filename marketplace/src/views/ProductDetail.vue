<template>
  <div class="pt-24 pb-10 px-6 max-w-7xl mx-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition min-h-screen relative">
    
    <div v-if="loading" class="text-center py-40 flex flex-col items-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mb-4"></div>
      <p class="text-gray-500">
        {{ lang === 'id' ? 'Memuat...' : lang === 'jp' ? '読み込み中...' : 'Loading...' }}
      </p>
    </div>

    <div v-else-if="!product" class="text-center py-20">
      <h2 class="text-2xl font-bold mb-2">404</h2>
      <p>{{ lang === 'id' ? 'Produk tidak ditemukan' : lang === 'jp' ? '商品が見つかりません' : 'Product not found' }}</p>
      <button @click="router.push('/')" class="mt-4 text-teal-600 hover:underline">
        {{ lang === 'id' ? 'Kembali' : lang === 'jp' ? '戻る' : 'Back' }}
      </button>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        <div class="w-full">
          <img 
            :src="product.image || 'https://via.placeholder.com/500?text=No+Image'" 
            alt="Product Image" 
            loading="lazy"
            class="w-full h-[400px] md:h-[500px] object-cover rounded-lg shadow-md bg-gray-100 border dark:border-gray-700"
          />
        </div>

        <div class="flex flex-col">
          <h1 class="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-1">
            {{ formatPrice(product.price) }}
          </h1>

          <div class="flex items-center gap-3 mb-4 text-sm">
             <div class="flex items-center bg-yellow-100 px-2 py-1 rounded text-yellow-700 font-bold gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                <span>{{ displayAverage }}</span>
             </div>
             <span class="text-gray-500">
                ({{ reviews.length }} {{ lang === 'id' ? 'Ulasan' : lang === 'jp' ? 'レビュー' : 'Reviews' }})
             </span>
             <span class="text-gray-300">|</span>
             <p class="font-medium" :class="getStock(product.stock) === 0 ? 'text-red-600' : 'text-gray-500'">
                <span v-if="getStock(product.stock) > 0">
                  {{ lang === 'id' ? 'Stok' : lang === 'jp' ? '在庫' : 'Stock' }}: {{ getStock(product.stock) }}
                </span>
                <span v-else>
                  {{ lang === 'id' ? 'Habis' : lang === 'jp' ? '売り切れ' : 'Out of Stock' }}
                </span>
             </p>
          </div>
          
          <div class="flex items-start justify-between gap-4 mb-2">
            <h2 class="text-xl font-medium text-gray-800 dark:text-gray-200 leading-snug">
              {{ translate(product.name) }}
            </h2>
            <button 
              @click="toggleWishlist"
              class="p-2 rounded-full transition duration-300 shadow-sm border flex-shrink-0"
              :class="isInWishlist ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white dark:bg-gray-800 border-gray-200 text-gray-400 hover:text-red-400'"
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
            <span class="flex items-center gap-1">Indonesia</span>
          </div>

          <div class="mb-6">
            <h3 class="font-semibold mb-2">{{ lang === 'id' ? 'Deskripsi' : lang === 'jp' ? '説明' : 'Description' }}</h3>
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
              <span class="text-gray-500">{{ getLabel('shipping') }}</span> 
              <span class="font-medium text-right">{{ formatPrice(product.shipping) }}</span>
            </div>
          </div>

          <div class="flex flex-col gap-3 mb-6">
            <button 
              @click="buyNow"
              :disabled="getStock(product.stock) <= 0"
              class="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded shadow transition disabled:opacity-50"
            >
               {{ lang === 'id' ? 'Beli Sekarang' : lang === 'jp' ? '今すぐ購入' : 'Buy Now' }}
            </button>
            
            <button 
              @click="handleAddToCart(false)"
              :disabled="getStock(product.stock) <= 0"
              class="w-full bg-white dark:bg-gray-800 border border-teal-600 text-teal-600 dark:text-teal-400 font-bold py-3 rounded hover:bg-teal-50 dark:hover:bg-gray-700 transition disabled:opacity-50"
            >
               {{ lang === 'id' ? 'Tambah ke Keranjang' : lang === 'jp' ? 'カートに追加' : 'Add to Cart' }}
            </button>
          </div>

          <div class="border rounded-lg p-4 flex items-center gap-4 shadow-sm dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <img src="https://ui-avatars.com/api/?name=Seller&background=random" class="w-12 h-12 rounded-full" alt="Seller">
            <div>
              <p class="font-bold text-sm">Official Seller</p>
              <div class="flex text-yellow-400 text-xs">★★★★★</div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-16 pt-8 border-t dark:border-gray-700" id="reviews">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold">
            {{ lang === 'id' ? 'Ulasan Pembeli' : lang === 'jp' ? '購入者のレビュー' : 'Customer Reviews' }}
          </h3>
          
          <button 
            v-if="canReview" 
            @click="isReviewModalOpen = true"
            class="px-5 py-2 bg-teal-600 text-white text-sm font-medium rounded hover:bg-teal-700 transition shadow"
          >
            {{ lang === 'id' ? 'Tulis Ulasan' : lang === 'jp' ? 'レビューを書く' : 'Write Review' }}
          </button>
        </div>

        <div v-if="reviews.length > 0">
          <div class="space-y-6">
            <div v-for="rev in displayedReviews" :key="rev.id" class="border-b pb-6 dark:border-gray-700 last:border-0">
              <div class="flex items-start gap-4">
                <img :src="rev.userPhoto || 'https://via.placeholder.com/40'" class="w-10 h-10 rounded-full border object-cover" loading="lazy">
                <div class="flex-1">
                  <div class="flex justify-between items-start">
                      <div>
                        <p class="font-bold text-sm">{{ rev.userName }}</p>
                        <div class="flex text-yellow-400 text-xs mt-1">
                           <span v-for="n in 5" :key="n">
                             <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" :fill="n <= rev.rating ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                           </span>
                        </div>
                      </div>
                      <span class="text-xs text-gray-400">{{ formatDate(rev.createdAt) }}</span>
                  </div>
                  <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">{{ rev.comment }}</p>
                  <div v-if="rev.image" class="mt-3">
                    <img :src="rev.image" class="w-20 h-20 object-cover rounded border cursor-pointer hover:opacity-80 transition" @click="viewImage(rev.image)" loading="lazy">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="reviews.length > 3" class="mt-6 text-center">
            <button @click="showAllReviews = !showAllReviews" class="text-teal-600 font-medium hover:underline text-sm">
              {{ showAllReviews ? (lang === 'id' ? 'Tampilkan Lebih Sedikit' : lang === 'jp' ? '表示を減らす' : 'Show Less') : (lang === 'id' ? `Lihat Semua (${reviews.length})` : lang === 'jp' ? `すべて見る (${reviews.length})` : `Show All (${reviews.length})`) }}
            </button>
          </div>
        </div>
        
        <div v-else class="text-center py-12 text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed dark:border-gray-700">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
           {{ lang === 'id' ? 'Belum ada ulasan.' : lang === 'jp' ? 'まだレビューはありません。' : 'No reviews yet.' }}
        </div>
      </div>

      <div class="mt-16">
        <h3 class="text-xl font-bold mb-6">
           {{ lang === 'id' ? 'Produk Lainnya' : lang === 'jp' ? 'おすすめ商品' : 'Other Products' }}
        </h3>
        <div v-if="relatedProducts.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <ProductCard v-for="p in relatedProducts" :key="p.id" :product="p" />
        </div>
        <div v-else class="text-gray-500 italic">
           {{ lang === 'id' ? 'Tidak ada produk lain.' : lang === 'jp' ? '他に商品はありません。' : 'No other products.' }}
        </div>
      </div>
    </div>

    <div v-if="showCartModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 max-w-sm w-full text-center">
        <div class="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h3 class="text-lg font-bold mb-2">
          {{ lang === 'id' ? 'Berhasil Masuk Keranjang!' : lang === 'jp' ? 'カートに追加されました！' : 'Added to Cart!' }}
        </h3>
        <div class="flex gap-2 mt-4">
          <button @click="showCartModal = false" class="flex-1 border border-teal-600 text-teal-600 py-2 rounded">
             {{ lang === 'id' ? 'Lanjut' : lang === 'jp' ? '続ける' : 'Continue' }}
          </button>
          <button @click="router.push('/cart')" class="flex-1 bg-teal-600 text-white py-2 rounded">
             {{ lang === 'id' ? 'Cek Keranjang' : lang === 'jp' ? 'カートを確認' : 'Check Cart' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="isReviewModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md p-6">
        <h3 class="text-lg font-bold mb-4 text-center">
          {{ lang === 'id' ? 'Beri Ulasan Produk' : lang === 'jp' ? '商品レビューを書く' : 'Write Product Review' }}
        </h3>
        
        <div class="flex justify-center mb-4 space-x-2">
          <button v-for="star in 5" :key="star" @click="reviewForm.rating = star" class="focus:outline-none transition transform hover:scale-110">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" :class="star <= reviewForm.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
             </svg>
          </button>
        </div>
        <p class="text-center text-sm text-gray-500 mb-6 font-medium">{{ reviewForm.rating }} / 5</p>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">{{ lang === 'id' ? 'Komentar' : lang === 'jp' ? 'コメント' : 'Comment' }}</label>
          <textarea v-model="reviewForm.comment" rows="3" class="w-full border rounded p-2 text-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-teal-500 focus:border-teal-500" :placeholder="lang === 'id' ? 'Bagaimana kualitas produk ini?' : lang === 'jp' ? '商品の品質はどうでしたか？' : 'How is the product quality?'"></textarea>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium mb-1">{{ lang === 'id' ? 'Foto (Opsional)' : lang === 'jp' ? '写真（任意）' : 'Photo (Optional)' }}</label>
          <div class="flex items-center gap-4">
            <div v-if="reviewForm.image" class="relative w-16 h-16">
               <img :src="reviewForm.image" class="w-full h-full object-cover rounded border">
               <button @click="reviewForm.image = ''" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
            </div>
            <button @click="$refs.reviewFileInput.click()" class="px-3 py-2 border rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
               {{ lang === 'id' ? 'Pilih Foto' : lang === 'jp' ? '写真を選択' : 'Upload Photo' }}
            </button>
            <input ref="reviewFileInput" type="file" class="hidden" accept="image/*" @change="handleReviewFile">
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <button @click="isReviewModalOpen = false" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
             {{ lang === 'id' ? 'Batal' : lang === 'jp' ? 'キャンセル' : 'Cancel' }}
          </button>
          <button @click="submitReview" :disabled="reviewForm.rating === 0 || isSubmitting" class="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed">
             {{ isSubmitting ? (lang === 'id' ? 'Mengirim...' : lang === 'jp' ? '送信中...' : 'Sending...') : (lang === 'id' ? 'Kirim' : lang === 'jp' ? '送信' : 'Submit') }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { store } from '../store';
import { db, auth } from '../firebase'; 
import { ref as dbRef, get, child, push, query, orderByChild, equalTo, onValue, limitToLast, runTransaction } from 'firebase/database'; 
import ProductCard from '../components/ProductCard.vue';

const route = useRoute();
const router = useRouter();
const product = ref(null);
const allProducts = ref([]);
const loading = ref(true);
const lang = ref(localStorage.getItem("lang") || "id");
const showCartModal = ref(false);

const reviews = ref([]);
const showAllReviews = ref(false);
const canReview = ref(false);
const isReviewModalOpen = ref(false);
const isSubmitting = ref(false);
const reviewForm = reactive({ rating: 0, comment: '', image: '' });
const reviewFileInput = ref(null);

const formatPrice = (value) => {
  if (!value && value !== 0) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
};

const getStock = (stockVal) => parseInt(stockVal || 0);
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
    const snapshot = await get(child(dbRef(db), `products/${productId}`));
    if (snapshot.exists()) {
      product.value = { id: productId, ...snapshot.val() };
      
      const allSnapshot = await get(child(dbRef(db), `products`));
      if (allSnapshot.exists()) {
        const data = allSnapshot.val();
        allProducts.value = Object.keys(data).map(key => ({ id: key, ...data[key] }));
      }
      
      fetchReviews(productId);
      checkEligibility(productId);
    } else {
      product.value = null;
    }
  } catch (error) { console.error(error); } 
  finally { loading.value = false; }
};

const fetchReviews = (productId) => {
  const reviewsRef = query(dbRef(db, `reviews/${productId}`), limitToLast(50));
  onValue(reviewsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      reviews.value = Object.keys(data).map(key => ({ id: key, ...data[key] })).reverse();
    } else {
      reviews.value = [];
    }
  });
};

const displayedReviews = computed(() => {
  if (showAllReviews.value) return reviews.value;
  return reviews.value.slice(0, 3);
});

const displayAverage = computed(() => {
  if(product.value && product.value.ratingStats && product.value.ratingStats.average) {
    return product.value.ratingStats.average;
  }
  if (reviews.value.length === 0) return 0;
  const total = reviews.value.reduce((acc, rev) => acc + rev.rating, 0);
  return (total / reviews.value.length).toFixed(1);
});

const checkEligibility = async (productId) => {
  const user = auth.currentUser;
  if (!user) { canReview.value = false; return; }

  const reviewsRef = dbRef(db, `reviews/${productId}`);
  const reviewSnapshot = await get(reviewsRef);
  if (reviewSnapshot.exists()) {
    const reviewsData = reviewSnapshot.val();
    if (Object.values(reviewsData).some(r => r.userId === user.uid)) {
      canReview.value = false; return;
    }
  }

  const ordersRef = query(dbRef(db, 'orders'), orderByChild('userId'), equalTo(user.uid));
  const ordersSnapshot = await get(ordersRef);
  if (ordersSnapshot.exists()) {
    const orders = Object.values(ordersSnapshot.val());
    const validOrder = orders.find(order => {
       if (!order.items) return false;
       const hasItem = order.items.some(item => String(item.id) === String(productId));
       const status = (order.status || '').toLowerCase();
       return hasItem && ['done', 'paid', 'shipped', 'delivered', 'selesai'].includes(status);
    });
    if (validOrder) canReview.value = true;
  }
};

const handleReviewFile = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => { reviewForm.image = e.target.result; };
    reader.readAsDataURL(file);
  }
};

const submitReview = async () => {
  if (reviewForm.rating === 0) return alert("Pilih bintang 1-5");
  isSubmitting.value = true;
  const user = auth.currentUser;
  const productId = route.params.id;

  try {
    const userSnapshot = await get(dbRef(db, `users/${user.uid}`));
    const userData = userSnapshot.val() || {};
    const newReview = {
      userId: user.uid,
      userName: userData.fullname || user.displayName || 'User',
      userPhoto: userData.photoURL || user.photoURL || '',
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      image: reviewForm.image,
      createdAt: Date.now()
    };

    await push(dbRef(db, `reviews/${productId}`), newReview);
    const productRatingRef = dbRef(db, `products/${productId}/ratingStats`);
    await runTransaction(productRatingRef, (currentStats) => {
      if (currentStats === null) {
        return { count: 1, totalStars: reviewForm.rating, average: reviewForm.rating };
      }
      const newCount = (currentStats.count || 0) + 1;
      const newTotal = (currentStats.totalStars || 0) + reviewForm.rating;
      const newAvg = Number((newTotal / newCount).toFixed(1));
      return { count: newCount, totalStars: newTotal, average: newAvg };
    });

    const successMsg = { id: 'Berhasil!', jp: '成功！', en: 'Success!' };
    alert(successMsg[lang.value] || successMsg.en);
    isReviewModalOpen.value = false;
    canReview.value = false;

    if(product.value) {
       if(!product.value.ratingStats) product.value.ratingStats = { count: 0, totalStars: 0, average: 0 };
       product.value.ratingStats.count++;
       product.value.ratingStats.average = ((product.value.ratingStats.totalStars + reviewForm.rating) / product.value.ratingStats.count).toFixed(1);
    }
    reviewForm.rating = 0; reviewForm.comment = ''; reviewForm.image = '';
  } catch (e) {
    alert(e.message);
  } finally {
    isSubmitting.value = false;
  }
};

const formatDate = (timestamp) => {
  const dateOptions = { day: 'numeric', month: 'short', year: 'numeric' };
  const locales = { id: 'id-ID', jp: 'ja-JP', en: 'en-US' };
  return new Date(timestamp).toLocaleDateString(locales[lang.value] || locales.en, dateOptions);
};

const viewImage = (src) => window.open(src, '_blank');

const relatedProducts = computed(() => {
  if (allProducts.value.length > 0 && product.value) {
    return allProducts.value.filter(p => p.id !== product.value.id).slice(0, 4); 
  }
  return [];
});

const isInWishlist = computed(() => {
  if (!product.value || !store.wishlist) return false;
  return store.wishlist.some(item => item.id === product.value.id);
});

const toggleWishlist = () => { if (product.value) store.toggleWishlist(product.value); };

const buyNow = () => {
  if (product.value) {
    if (!store.user) {
      const loginMsg = { id: 'Silakan login terlebih dahulu untuk membeli.', en: 'Please login first to buy.', jp: '購入するには先にログインしてください。' };
      alert(loginMsg[lang.value] || loginMsg.en);
      return;
    }
    if (getStock(product.value.stock) <= 0) {
      const stockMsg = { id: 'Stok habis.', en: 'Out of stock.', jp: '在庫切れです。' };
      alert(stockMsg[lang.value] || stockMsg.en);
      return;
    }
    router.push({ path: '/checkout', query: { pid: product.value.id, qty: 1, direct: 'true' } });
  }
};

const handleAddToCart = (redirect) => {
  if (product.value) {
    if (!store.user) {
      const loginMsg = { id: 'Silakan login terlebih dahulu untuk menambah ke keranjang.', en: 'Please login first to add to cart.', jp: 'カートに追加するには先にログインしてください。' };
      alert(loginMsg[lang.value] || loginMsg.en);
      return;
    }
    if (getStock(product.value.stock) <= 0) {
      const stockMsg = { id: 'Stok habis.', en: 'Out of stock.', jp: '在庫切れです。' };
      alert(stockMsg[lang.value] || stockMsg.en);
      return;
    }
    store.addToCart(product.value);
    if (redirect) { router.push('/cart'); } else { showCartModal.value = true; }
  }
};

watch(() => route.params.id, (newId) => {
  if(newId) { window.scrollTo({ top: 0, behavior: 'smooth' }); fetchProduct(); }
});

onMounted(() => {
  window.scrollTo(0, 0);
  fetchProduct();
  window.addEventListener("storage", updateLanguage);
});

onUnmounted(() => { window.removeEventListener("storage", updateLanguage); });
</script>