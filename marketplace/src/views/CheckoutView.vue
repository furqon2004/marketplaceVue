<template>
  <div class="pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">
        {{ lang === 'id' ? 'Pembayaran' : lang === 'jp' ? 'チェックアウト' : 'Checkout' }}
      </h1>

      <div v-if="store.cart.length === 0" class="text-center py-20 bg-white rounded-lg shadow">
        <p class="text-gray-500 mb-4">
          {{ lang === 'id' ? 'Keranjang belanja Anda kosong.' : lang === 'jp' ? 'カートは空です。' : 'Your cart is empty.' }}
        </p>
        <button @click="router.push('/')" class="text-teal-600 font-bold hover:underline">
          {{ lang === 'id' ? 'Kembali Belanja' : lang === 'jp' ? '買い物を続ける' : 'Continue Shopping' }}
        </button>
      </div>

      <div v-else class="flex flex-col lg:flex-row gap-8">
        
        <div class="flex-1 space-y-6">
          
          <div class="bg-white p-6 rounded-lg shadow">
            <h2 class="text-lg font-medium text-gray-900 mb-4">
              {{ lang === 'id' ? 'Barang Pesanan' : lang === 'jp' ? '注文商品' : 'Order Items' }}
            </h2>
            <div class="space-y-4">
              <div v-for="item in store.cart" :key="item.id" class="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
                <div class="flex gap-4">
                  <img :src="item.image || 'https://via.placeholder.com/150'" class="w-16 h-16 object-cover rounded bg-gray-100 border">
                  <div>
                    <p class="font-medium text-gray-900">{{ item.name }}</p>
                    <p class="text-sm text-gray-500">
                      {{ item.size || (lang === 'id' ? 'Semua Ukuran' : 'All Size') }}
                    </p>
                    <p class="text-teal-600 font-bold mt-1">{{ formatRupiah(item.price) }}</p>
                  </div>
                </div>
                <div class="font-medium text-gray-500">x{{ item.qty }}</div>
              </div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg shadow">
            <h2 class="text-lg font-medium text-gray-900 mb-4">
              {{ lang === 'id' ? 'Alamat Pengiriman' : lang === 'jp' ? '配送先住所' : 'Shipping Address' }}
            </h2>
            
            <div v-if="address.saved" class="flex items-start gap-4 p-4 border rounded-lg bg-gray-50">
              <div class="bg-teal-100 p-2 rounded-full text-teal-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <div class="flex-1">
                <p class="font-bold text-gray-900">{{ userProfile.fullname || 'User' }}</p>
                <p class="text-gray-600 text-sm mt-1">{{ address.detail }}</p>
                <p class="text-gray-600 text-sm">{{ address.city }}, {{ address.zip }}</p>
              </div>
              <button @click="address.saved = false" class="text-sm text-teal-600 font-medium hover:underline">
                {{ lang === 'id' ? 'Ubah' : lang === 'jp' ? '変更' : 'Change' }}
              </button>
            </div>

            <div v-else class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  {{ lang === 'id' ? 'Alamat Lengkap' : lang === 'jp' ? '住所' : 'Full Address' }}
                </label>
                <textarea v-model="address.detail" rows="2" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm" placeholder="Jl. Raya Sesetan No..."></textarea>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    {{ lang === 'id' ? 'Kota' : lang === 'jp' ? '市町村' : 'City' }}
                  </label>
                  <input v-model="address.city" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm" placeholder="Denpasar">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    {{ lang === 'id' ? 'Kode Pos' : lang === 'jp' ? '郵便番号' : 'Zip Code' }}
                  </label>
                  <input v-model="address.zip" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm" placeholder="80223">
                </div>
              </div>
              <button @click="saveAddress" class="text-sm bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition">
                {{ lang === 'id' ? 'Simpan Alamat' : lang === 'jp' ? '住所を保存' : 'Save Address' }}
              </button>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg shadow">
            <h2 class="text-lg font-medium text-gray-900 mb-4">
              {{ lang === 'id' ? 'Detail Pengiriman' : lang === 'jp' ? '配送詳細' : 'Delivery Details' }}
            </h2>
            
            <label class="flex items-center justify-between p-4 border rounded-lg cursor-pointer transition" :class="!isExpress ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'">
              <div class="flex items-center gap-3">
                <input type="radio" :value="false" v-model="isExpress" class="text-teal-600 focus:ring-teal-500">
                <div>
                  <p class="font-medium text-gray-900">
                    {{ lang === 'id' ? 'Pengiriman Reguler' : lang === 'jp' ? '通常配送' : 'Regular Shipping' }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ lang === 'id' ? '3-5 Hari Kerja' : lang === 'jp' ? '3-5 営業日' : '3-5 Working Days' }}
                  </p>
                </div>
              </div>
              <span class="font-bold text-gray-900">Free</span>
            </label>

            <label class="flex items-center justify-between p-4 border rounded-lg cursor-pointer mt-3 transition" :class="isExpress ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'">
              <div class="flex items-center gap-3">
                <input type="radio" :value="true" v-model="isExpress" class="text-teal-600 focus:ring-teal-500">
                <div>
                  <p class="font-medium text-gray-900">
                    {{ lang === 'id' ? 'Pengiriman Ekspres' : lang === 'jp' ? 'お急ぎ便' : 'Express Delivery' }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ lang === 'id' ? '1 Hari Kerja' : lang === 'jp' ? '1 営業日' : '1 Working Day' }}
                  </p>
                </div>
              </div>
              <span class="font-bold text-teal-600">+ Rp 15.000</span>
            </label>
          </div>

          <div class="bg-white p-6 rounded-lg shadow">
            <h2 class="text-lg font-medium text-gray-900 mb-4">
              {{ lang === 'id' ? 'Metode Pembayaran' : lang === 'jp' ? '支払い方法' : 'Payment Method' }}
            </h2>
            <div class="space-y-4">
              <div class="flex gap-3 mb-2">
                 <div class="border rounded p-2"><img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" class="h-6"></div>
                 <div class="border rounded p-2 bg-gray-50 opacity-50"><img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" class="h-6"></div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  {{ lang === 'id' ? 'Nomor Kartu' : lang === 'jp' ? 'カード番号' : 'Card Number' }}
                </label>
                <input v-model="payment.cardNumber" type="text" maxlength="19" placeholder="0000 0000 0000 0000" class="mt-1 w-full border border-gray-300 rounded-md p-2 text-sm">
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    {{ lang === 'id' ? 'Kadaluarsa' : lang === 'jp' ? '有効期限' : 'Expiry Date' }}
                  </label>
                  <input v-model="payment.expiry" type="text" maxlength="5" placeholder="MM/YY" class="mt-1 w-full border border-gray-300 rounded-md p-2 text-sm">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">CVC/CVV</label>
                  <input v-model="payment.cvv" type="text" maxlength="3" placeholder="123" class="mt-1 w-full border border-gray-300 rounded-md p-2 text-sm">
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  {{ lang === 'id' ? 'Nama Pemilik Kartu' : lang === 'jp' ? 'カード名義人' : 'Card Holder Name' }}
                </label>
                <input v-model="payment.holderName" type="text" placeholder="Nama Pemilik Kartu" class="mt-1 w-full border border-gray-300 rounded-md p-2 text-sm">
              </div>
            </div>
          </div>

        </div>

        <div class="w-full lg:w-96">
          <div class="bg-white p-6 rounded-lg shadow sticky top-24">
            <h2 class="text-lg font-medium text-gray-900 mb-6">
              {{ lang === 'id' ? 'Ringkasan Pesanan' : lang === 'jp' ? '注文概要' : 'Order Summary' }}
            </h2>
            
            <div class="space-y-3 text-sm border-b pb-4 mb-4">
              <div class="flex justify-between text-gray-600">
                <span>{{ lang === 'id' ? 'Total Barang' : lang === 'jp' ? '商品合計' : 'Order Total' }}</span>
                <span>{{ formatRupiah(subTotal) }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>{{ lang === 'id' ? 'Biaya Proteksi' : lang === 'jp' ? '保護料' : 'Protection Fee' }}</span>
                <span>{{ formatRupiah(protectionFee) }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>{{ lang === 'id' ? 'Ongkir' : lang === 'jp' ? '送料' : 'Shipping' }}</span>
                <span>{{ formatRupiah(shippingCost) }}</span>
              </div>
            </div>

            <div class="flex justify-between items-center mb-6">
              <span class="font-bold text-gray-900 text-lg">
                {{ lang === 'id' ? 'Total Bayar' : lang === 'jp' ? '合計金額' : 'Total to pay' }}
              </span>
              <span class="font-bold text-teal-600 text-xl">{{ formatRupiah(grandTotal) }}</span>
            </div>

            <button 
              @click="handleOrder" 
              :disabled="isProcessing"
              class="w-full bg-teal-600 text-white font-bold py-3 rounded-lg hover:bg-teal-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center gap-2 items-center"
            >
              <span v-if="isProcessing" class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
              {{ isProcessing 
                  ? (lang === 'id' ? 'Memproses...' : lang === 'jp' ? '処理中...' : 'Processing...') 
                  : (lang === 'id' ? 'Pesan Sekarang' : lang === 'jp' ? '今すぐ注文' : 'Order Now') 
              }}
            </button>
          </div>
        </div>

      </div>
    </div>

    <div v-if="showSuccessModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity">
      <div class="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center transform transition-all scale-100">
        
        <div class="mx-auto w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-6">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>

        <h2 class="text-xl font-bold text-gray-900 mb-2">Order #{{ orderId }}</h2>
        <h3 class="text-lg font-medium text-teal-600 mb-4">
          {{ lang === 'id' ? 'berhasil dibuat' : lang === 'jp' ? '注文完了' : 'placed successfully' }}
        </h3>
        
        <p class="text-sm text-gray-500 mb-8 leading-relaxed">
          {{ lang === 'id' ? 'Terima kasih telah berbelanja. Pesanan Anda berhasil dibuat dan stok produk telah kami amankan.' : lang === 'jp' ? 'お買い上げありがとうございます。注文が正常に作成され、在庫が確保されました。' : 'Thank you for shopping. Your order has been placed successfully and stock has been secured.' }}
        </p>

        <div class="space-y-3">
          <button @click="finishOrder('/')" class="w-full border border-teal-600 text-teal-600 font-bold py-2 rounded hover:bg-teal-50 transition">
            {{ lang === 'id' ? 'Lanjut Belanja' : lang === 'jp' ? '買い物を続ける' : 'Continue Shopping' }}
          </button>
          <button @click="finishOrder('/history')" class="w-full bg-teal-600 text-white font-bold py-2 rounded hover:bg-teal-700 transition">
            {{ lang === 'id' ? 'Lihat Riwayat' : lang === 'jp' ? '履歴を見る' : 'Go to History' }}
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { store } from '../store';
import { auth, db } from '../firebase';
import { ref as dbRef, get, update, set } from 'firebase/database';

const router = useRouter();
const lang = ref(localStorage.getItem("lang") || "id");

// === STATE ===
const isProcessing = ref(false);
const showSuccessModal = ref(false);
const orderId = ref('');
const isExpress = ref(false); 
const userProfile = ref({});

const address = reactive({
  detail: '',
  city: '',
  zip: '',
  saved: false
});

const payment = reactive({
  cardNumber: '',
  expiry: '',
  cvv: '',
  holderName: ''
});

// Update Bahasa
const updateLanguage = () => {
  lang.value = localStorage.getItem("lang") || "id";
};

// === COMPUTED ===
const subTotal = computed(() => {
  return store.cart.reduce((acc, item) => {
    const price = typeof item.price === 'string' ? parseInt(item.price.replace(/[^0-9]/g, '')) : item.price;
    return acc + (price * item.qty);
  }, 0);
});

const protectionFee = ref(20000);
const shippingCost = computed(() => isExpress.value ? 15000 : 0);
const grandTotal = computed(() => subTotal.value + protectionFee.value + shippingCost.value);

const formatRupiah = (num) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num || 0);
};

// === LIFECYCLE ===
onMounted(async () => {
  window.addEventListener("storage", updateLanguage);

  const user = auth.currentUser;
  if (!user) {
    router.push('/login');
    return;
  }

  try {
    const snapshot = await get(dbRef(db, `users/${user.uid}`));
    if (snapshot.exists()) {
      const data = snapshot.val();
      userProfile.value = data;
      
      if (data.address) {
        address.detail = data.address.detail || '';
        address.city = data.address.city || '';
        address.zip = data.address.zip || '';
        address.saved = true;
      }
    }
  } catch (error) {
    console.error("Gagal load user:", error);
  }
});

onUnmounted(() => {
  window.removeEventListener("storage", updateLanguage);
});

// === ACTIONS ===
const saveAddress = async () => {
  if(!address.detail || !address.city) {
    alert(lang.value === 'id' ? 'Alamat wajib diisi!' : lang.value === 'jp' ? '住所は必須です！' : 'Address is required!');
    return;
  }
  
  const user = auth.currentUser;
  if(user) {
    try {
      await update(dbRef(db, `users/${user.uid}`), {
        address: { ...address }
      });
      address.saved = true;
    } catch (e) {
      alert("Gagal menyimpan alamat");
    }
  }
};

const handleOrder = async () => {
  if (!address.saved) {
    alert(lang.value === 'id' ? 'Mohon simpan alamat pengiriman.' : 'Please save shipping address.');
    return;
  }
  if (!payment.cardNumber || !payment.cvv) {
    alert(lang.value === 'id' ? 'Mohon lengkapi pembayaran.' : 'Please complete payment.');
    return;
  }
  
  isProcessing.value = true;
  const user = auth.currentUser;

  try {
    // Validasi Stok
    for (const item of store.cart) {
      const snapshot = await get(dbRef(db, `products/${item.id}`));
      if (snapshot.exists()) {
        const currentStock = parseInt(snapshot.val().stock || 0);
        if (currentStock < item.qty) {
          throw new Error(`Stok "${item.name}" habis!`);
        }
      } else {
        throw new Error(`Produk tidak ditemukan.`);
      }
    }

    const uniqueSuffix = Math.floor(Math.random() * 1000) + 1000; 
    const generatedId = `ORD-${Date.now().toString().slice(-6)}-${uniqueSuffix}`;
    orderId.value = generatedId;

    const orderData = {
      orderId: generatedId,
      userId: user.uid,
      items: store.cart,
      shipping: {
        method: isExpress.value ? 'Express' : 'Regular',
        cost: shippingCost.value,
        address: { ...address }
      },
      payment: {
        method: 'Credit Card',
        card: payment.cardNumber.slice(-4)
      },
      total: {
        subTotal: subTotal.value,
        grandTotal: grandTotal.value
      },
      status: 'Paid',
      createdAt: Date.now()
    };

    // Update Stok
    for (const item of store.cart) {
      const productRef = dbRef(db, `products/${item.id}`);
      const snapshot = await get(productRef);
      if (snapshot.exists()) {
        const currentStock = parseInt(snapshot.val().stock || 0);
        await update(productRef, { stock: currentStock - item.qty });
      }
    }

    await set(dbRef(db, `orders/${generatedId}`), orderData);

    store.cart = [];
    store.saveCart();

    showSuccessModal.value = true;

  } catch (error) {
    alert("Error: " + error.message);
  } finally {
    isProcessing.value = false;
  }
};

const finishOrder = (path) => {
  showSuccessModal.value = false;
  router.push(path);
};
</script>