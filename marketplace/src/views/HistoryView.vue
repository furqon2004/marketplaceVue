<template>
  <div class="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">
        {{ lang === 'id' ? 'Pengaturan' : lang === 'jp' ? '設定' : 'Settings' }}
      </h1>

      <div class="flex flex-col md:flex-row gap-8">
        
        <aside class="w-full md:w-64 flex-shrink-0">
          <nav class="space-y-1">
            <a href="/profile" class="block px-3 py-2 text-sm font-medium text-gray-500 rounded-md hover:text-gray-900 hover:bg-gray-100">
              {{ lang === 'id' ? 'Detail Profil' : lang === 'jp' ? 'プロフィール詳細' : 'Profile details' }}
            </a>
            <a href="/change-password" class="block px-3 py-2 text-sm font-medium text-gray-500 rounded-md hover:text-gray-900 hover:bg-gray-100">
              {{ lang === 'id' ? 'Ganti Kata Sandi' : lang === 'jp' ? 'パスワード変更' : 'Change Password' }}
            </a>
            <a href="/history" class="block px-3 py-2 text-sm font-bold text-gray-900 bg-gray-100 rounded-md">
              {{ lang === 'id' ? 'Riwayat Transaksi' : lang === 'jp' ? '取引履歴' : 'Transaction History' }}
            </a>
            <a href="/my-products" class="block px-3 py-2 text-sm font-medium text-gray-500 rounded-md hover:text-gray-900 hover:bg-gray-100">
              {{ lang === 'id' ? 'Produk Saya' : lang === 'jp' ? '出品商品' : 'My Products' }}
            </a>
          </nav>
        </aside>

        <main class="flex-1 min-h-[500px]">
          
          <div v-if="loading" class="flex justify-center py-20">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
          </div>

          <div v-else-if="orders.length === 0" class="bg-white rounded-lg shadow p-10 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
            <div class="mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-teal-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" stroke="currentColor" stroke-width="1.5" fill="none"/>
                <path d="M9 11V7a3 3 0 016 0v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h2 class="text-xl font-bold text-gray-900 mb-2">
              {{ lang === 'id' ? 'Belum ada pesanan' : lang === 'jp' ? '注文はありません' : 'No orders yet' }}
            </h2>
            <p class="text-gray-500 mb-8 max-w-xs">
              {{ lang === 'id' ? 'Saat Anda membeli barang, pesanan Anda akan muncul di sini.' : lang === 'jp' ? '商品を購入すると、ここに注文が表示されます。' : 'When you buy an item, your order about it will appear here.' }}
            </p>
            <button 
              @click="router.push('/')" 
              class="bg-teal-600 text-white px-8 py-2.5 rounded-md font-bold hover:bg-teal-700 transition shadow-lg"
            >
              {{ lang === 'id' ? 'Belanja Sekarang' : lang === 'jp' ? '今すぐ購入' : 'Shop now' }}
            </button>
          </div>

          <div v-else class="space-y-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4 hidden md:block">
              {{ lang === 'id' ? 'Pesanan Saya' : lang === 'jp' ? '注文履歴' : 'My Order' }}
            </h2>
            
            <div 
              v-for="order in orders" 
              :key="order.orderId" 
              class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition"
            >
              <div class="flex flex-wrap items-center gap-3 text-sm mb-4 border-b pb-4">
                <div class="flex items-center gap-2 text-gray-900 font-bold">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-teal-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd" />
                  </svg>
                  {{ lang === 'id' ? 'Belanja' : lang === 'jp' ? 'ショッピング' : 'Shopping' }}
                </div>
                <span class="text-gray-500">{{ formatDate(order.createdAt) }}</span>
                <span class="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold uppercase">{{ order.status || 'Done' }}</span>
                <span class="text-gray-400 text-xs ml-auto">{{ order.orderId }}</span>
              </div>

              <div class="flex gap-4">
                <img 
                  :src="order.items[0].image || 'https://via.placeholder.com/100'" 
                  class="w-20 h-20 object-cover rounded-md border"
                >
                <div class="flex-1">
                  <h3 class="font-bold text-gray-900 line-clamp-1">{{ translate(order.items[0].name) }}</h3>
                  <p class="text-gray-500 text-sm mt-1">
                    {{ order.items[0].qty }} product x {{ formatRupiah(order.items[0].price) }}
                  </p>
                  <p class="text-gray-400 text-xs mt-1">
                    {{ order.items[0].size || 'All Size' }} / {{ translate(order.items[0].color) || '-' }}
                  </p>
                  
                  <p v-if="order.items.length > 1" class="text-xs text-gray-500 mt-2">
                    + {{ order.items.length - 1 }} {{ lang === 'id' ? 'produk lainnya' : lang === 'jp' ? 'その他の商品' : 'more products' }}
                  </p>
                </div>
                
                <div class="hidden md:block text-right">
                  <p class="text-gray-500 text-xs mb-1">
                    {{ lang === 'id' ? 'Total Harga' : lang === 'jp' ? '合計金額' : 'Total price' }}
                  </p>
                  <p class="text-teal-600 font-bold text-lg">{{ formatRupiah(order.total?.grandTotal || 0) }}</p>
                </div>
              </div>

              <div class="flex justify-between items-center mt-6 pt-4 border-t">
                <div class="md:hidden">
                   <p class="text-gray-500 text-xs">
                     {{ lang === 'id' ? 'Total Harga' : lang === 'jp' ? '合計金額' : 'Total price' }}
                   </p>
                   <p class="text-teal-600 font-bold">{{ formatRupiah(order.total?.grandTotal || 0) }}</p>
                </div>
                
                <div class="ml-auto">
                  <button 
                    @click="router.push(`/product/${order.items[0].id}`)" 
                    class="bg-teal-600 text-white text-sm font-bold px-6 py-2 rounded hover:bg-teal-700 transition"
                  >
                    {{ lang === 'id' ? 'Beli Lagi' : lang === 'jp' ? 'もう一度買う' : 'Buy Again' }}
                  </button>
                </div>
              </div>

            </div>
          </div>

        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { auth, db } from '../firebase';
import { ref as dbRef, query, orderByChild, equalTo, onValue } from 'firebase/database';

const router = useRouter();
const loading = ref(true);
const orders = ref([]);
const lang = ref(localStorage.getItem("lang") || "id");

// === HELPER TRANSLATE ===
const translate = (data) => {
  if (!data) return "";
  if (typeof data === 'object') return data[lang.value] || data['en'];
  return data;
};

// === FORMATTER ===
const formatRupiah = (num) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
};

const formatDate = (timestamp) => {
  if (!timestamp) return '-';
  const date = new Date(timestamp);
  // Format tanggal disesuaikan dengan bahasa (id-ID atau en-US)
  const locale = lang.value === 'id' ? 'id-ID' : 'en-US';
  return date.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' });
};

// === UPDATE BAHASA ===
const updateLanguage = () => {
  lang.value = localStorage.getItem("lang") || "id";
};

// === LOAD DATA ===
onMounted(() => {
  window.addEventListener("storage", updateLanguage);

  const user = auth.currentUser;
  if (user) {
    const ordersRef = query(dbRef(db, 'orders'), orderByChild('userId'), equalTo(user.uid));
    
    onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        orders.value = Object.values(data).sort((a, b) => b.createdAt - a.createdAt);
      } else {
        orders.value = [];
      }
      loading.value = false;
    });
  } else {
    loading.value = false;
    router.push('/login');
  }
});

onUnmounted(() => {
  window.removeEventListener("storage", updateLanguage);
});
</script>