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
            <a href="/history" class="block px-3 py-2 text-sm font-medium text-gray-500 rounded-md hover:text-gray-900 hover:bg-gray-100">
              {{ lang === 'id' ? 'Riwayat Transaksi' : lang === 'jp' ? '取引履歴' : 'Transaction History' }}
            </a>
            <a href="/my-products" class="block px-3 py-2 text-sm font-bold text-gray-900 bg-transparent rounded-md hover:bg-gray-100">
              {{ lang === 'id' ? 'Produk Saya' : lang === 'jp' ? '出品商品' : 'My Products' }}
            </a>
          </nav>
        </aside>

        <main class="flex-1 bg-white shadow rounded-lg p-6 md:p-8 min-h-[500px]">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-lg font-medium text-gray-900">
              {{ lang === 'id' ? 'Produk Saya' : lang === 'jp' ? '出品商品' : 'My Products' }}
            </h2>
            <button @click="openModal()" class="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-md hover:bg-teal-700 transition flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>
              {{ lang === 'id' ? 'Tambah Produk' : lang === 'jp' ? '商品を追加' : 'Add Product' }}
            </button>
          </div>

          <div class="mb-6 relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" /></svg>
            </div>
            <input 
              v-model="searchQuery" 
              type="text" 
              :placeholder="lang === 'id' ? 'Cari nama produk atau kategori...' : lang === 'jp' ? '商品名またはカテゴリを検索...' : 'Search product name or category...'" 
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition duration-150 ease-in-out"
            >
          </div>

          <div v-if="loading" class="flex justify-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          </div>

          <div v-else-if="products.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
             <div class="bg-gray-100 p-4 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-400"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3.75h3.75M12 7.5h-7.5m0 0l3.75 3.75M3.75 7.5h16.5" /></svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900">
              {{ lang === 'id' ? 'Belum ada produk' : lang === 'jp' ? '商品はまだありません' : 'No products yet' }}
            </h3>
            <p class="mt-1 text-sm text-gray-500">
              {{ lang === 'id' ? 'Mulai jualan dengan menambahkan produk pertamamu.' : lang === 'jp' ? '最初の商品を追加して販売を開始しましょう。' : 'Start selling by adding your first product.' }}
            </p>
          </div>

          <div v-else-if="filteredProducts.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
            <p class="text-gray-500">
              {{ lang === 'id' ? 'Tidak ditemukan produk dengan kata kunci' : lang === 'jp' ? 'キーワードに一致する商品は見つかりませんでした' : 'No products found with keyword' }} 
              "<strong>{{ searchQuery }}</strong>"
            </p>
            <button @click="searchQuery = ''" class="mt-2 text-teal-600 hover:text-teal-700 font-medium text-sm">
              {{ lang === 'id' ? 'Reset Pencarian' : lang === 'jp' ? '検索をリセット' : 'Reset Search' }}
            </button>
          </div>

          <div v-else>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div 
                v-for="product in paginatedProducts" 
                :key="product.id" 
                class="group relative border border-gray-200 rounded-lg p-4 hover:shadow-md transition bg-white"
              >
                <div class="aspect-square w-full overflow-hidden rounded-md bg-gray-100 relative">
                  <img :src="product.image || 'https://via.placeholder.com/300?text=No+Image'" class="h-full w-full object-cover object-center group-hover:opacity-75 transition">
                  
                  <div class="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {{ lang === 'id' ? 'Stok' : lang === 'jp' ? '在庫' : 'Stock' }}: {{ product.stock || 0 }}
                  </div>

                  <div class="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button @click.stop="editProduct(product)" class="p-1.5 bg-white rounded-full shadow hover:text-teal-600">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" /></svg>
                    </button>
                    <button @click.stop="deleteProduct(product.id)" class="p-1.5 bg-white rounded-full shadow hover:text-red-600">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4z" clip-rule="evenodd" /></svg>
                    </button>
                  </div>
                </div>
                <div class="mt-4">
                  <h3 class="text-sm text-gray-700 font-medium line-clamp-1">{{ product.name }}</h3>
                  <div class="mt-2 grid grid-cols-2 gap-y-1 text-xs text-gray-500">
                      <span>{{ lang === 'id' ? 'Kategori' : lang === 'jp' ? 'カテゴリ' : 'Category' }}:</span> 
                      <span class="text-gray-900 font-medium text-right">{{ product.category }}</span>
                      
                      <span>{{ lang === 'id' ? 'Ukuran' : lang === 'jp' ? 'サイズ' : 'Size' }}:</span> 
                      <span class="text-gray-900 font-medium text-right">{{ product.size }}</span>
                  </div>
                  <div class="mt-3 flex justify-between items-center border-t pt-2">
                      <p class="text-sm font-bold text-gray-900">Rp{{ formatPrice(product.price) }}</p>
                      <span class="text-xs text-gray-400">{{ product.uploaded }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="totalPages > 1" class="flex justify-center items-center mt-8 gap-4">
              <button 
                @click="prevPage" 
                :disabled="currentPage === 1" 
                class="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
              >
                {{ lang === 'id' ? 'Sebelumnya' : lang === 'jp' ? '前へ' : 'Previous' }}
              </button>
              
              <span class="text-sm text-gray-600">
                {{ lang === 'id' ? 'Halaman' : lang === 'jp' ? 'ページ' : 'Page' }} {{ currentPage }} / {{ totalPages }}
              </span>
              
              <button 
                @click="nextPage" 
                :disabled="currentPage === totalPages" 
                class="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
              >
                {{ lang === 'id' ? 'Selanjutnya' : lang === 'jp' ? '次へ' : 'Next' }}
              </button>
            </div>
          </div>

        </main>
      </div>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
         <div class="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
          <h3 class="text-lg font-medium text-gray-900">
            {{ isEditing 
                ? (lang === 'id' ? 'Edit Produk' : lang === 'jp' ? '商品編集' : 'Edit Product') 
                : (lang === 'id' ? 'Tambah Produk Baru' : lang === 'jp' ? '新規商品追加' : 'Add New Product') 
            }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>
        
        <div class="p-6 space-y-6">
          <div class="flex justify-center">
             <div class="w-full max-w-xs aspect-video border-2 border-gray-300 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition relative overflow-hidden" @click="$refs.fileInput.click()">
                <div v-if="!form.imagePreview" class="text-center p-4">
                  <svg class="mx-auto h-10 w-10 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
                  <p class="mt-1 text-sm text-gray-500">
                    {{ lang === 'id' ? 'Klik untuk unggah foto' : lang === 'jp' ? 'クリックして写真をアップロード' : 'Click to upload photo' }}
                  </p>
                </div>
                <img v-else :src="form.imagePreview" class="w-full h-full object-contain">
                <input ref="fileInput" type="file" class="hidden" accept="image/*" @change="handleFileChange">
             </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ lang === 'id' ? 'Nama Produk' : lang === 'jp' ? '商品名' : 'Product Name' }}
            </label>
            <input v-model="form.name" type="text" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500">
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ lang === 'id' ? 'Harga (Rp)' : lang === 'jp' ? '価格 (Rp)' : 'Price (Rp)' }}
              </label>
              <input v-model="form.price" type="number" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500">
            </div>
            <div>
               <label class="block text-sm font-medium text-gray-700 mb-1">
                 {{ lang === 'id' ? 'Ongkir (Rp)' : lang === 'jp' ? '送料 (Rp)' : 'Shipping (Rp)' }}
               </label>
               <input v-model="form.shipping" type="number" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500">
            </div>
            <div>
               <label class="block text-sm font-medium text-gray-700 mb-1">
                 {{ lang === 'id' ? 'Stok' : lang === 'jp' ? '在庫' : 'Stock' }}
               </label>
               <input v-model="form.stock" type="number" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500" placeholder="Qty">
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
             <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ lang === 'id' ? 'Kategori' : lang === 'jp' ? 'カテゴリ' : 'Category' }}
              </label>
              <select v-model="form.category" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500">
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ lang === 'id' ? 'Ukuran' : lang === 'jp' ? 'サイズ' : 'Size' }}
                </label>
                <div class="flex flex-wrap gap-3">
                  <button v-for="size in sizes" :key="size" type="button" @click="form.size = size" class="px-4 py-2 text-sm font-medium rounded-md border transition" :class="form.size === size 
                      ? 'bg-teal-600 text-white border-teal-600' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-teal-500 hover:text-teal-600'">{{ size }}</button>
                </div>
                <p v-if="!form.size" class="text-xs text-gray-400 mt-1">
                  {{ lang === 'id' ? 'Pilih salah satu ukuran.' : lang === 'jp' ? 'サイズを選択してください。' : 'Choose a size.' }}
                </p>
              </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
             <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ lang === 'id' ? 'Kondisi' : lang === 'jp' ? '状態' : 'Condition' }}
              </label>
              <select v-model="form.condition" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500">
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Used">Used</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ lang === 'id' ? 'Warna' : lang === 'jp' ? '色' : 'Color' }}
              </label>
              <input v-model="form.color" type="text" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500">
            </div>
          </div>

          <div>
             <label class="block text-sm font-medium text-gray-700 mb-1">
               {{ lang === 'id' ? 'Deskripsi' : lang === 'jp' ? '説明' : 'Description' }}
             </label>
             <textarea v-model="form.description" rows="3" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500"></textarea>
          </div>

        </div>

        <div class="p-4 bg-gray-50 flex justify-end gap-3 border-t">
          <button @click="closeModal" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            {{ lang === 'id' ? 'Batal' : lang === 'jp' ? 'キャンセル' : 'Cancel' }}
          </button>
          <button @click="saveProduct" :disabled="saving" class="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 disabled:opacity-50 flex items-center gap-2">
            <span v-if="saving" class="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></span>
            {{ saving 
                ? (lang === 'id' ? 'Menyimpan...' : lang === 'jp' ? '保存中...' : 'Saving...') 
                : (isEditing 
                    ? (lang === 'id' ? 'Simpan Produk' : lang === 'jp' ? '保存' : 'Save Product') 
                    : (lang === 'id' ? 'Buat Produk' : lang === 'jp' ? '作成' : 'Create Product')) 
            }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed, watch } from 'vue'; 
import { auth, db } from '../firebase'; 
import { ref as dbRef, push, set, remove, onValue, query, orderByChild, equalTo } from 'firebase/database';

const loading = ref(true);
const saving = ref(false);
const products = ref([]);
const isModalOpen = ref(false);
const isEditing = ref(false);
const fileInput = ref(null);
const currentId = ref(null);
const searchQuery = ref('');
const lang = ref(localStorage.getItem("lang") || "id");

const currentPage = ref(1);
const itemsPerPage = 6; 

const categories = ['Vans', 'Bohoo', 'Mango', 'Reebok', 'Converse', 'Sandro', 'Nike', 'Adidas', 'Dior', 'Puma', 'Zara', 'Other'];
const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

const form = reactive({
  name: '',
  price: '',
  shipping: '',
  stock: '', 
  category: 'Vans',
  size: '',
  condition: 'New',
  color: '',
  description: '',
  imagePreview: '',
  imageBase64: ''
});

// Update Bahasa
const updateLanguage = () => {
  lang.value = localStorage.getItem("lang") || "id";
};

onMounted(() => {
  window.addEventListener("storage", updateLanguage);

  const user = auth.currentUser;
  if (user) {
    const productsRef = query(dbRef(db, 'products'), orderByChild('userId'), equalTo(user.uid));
    onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      products.value = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      loading.value = false;
    });
  } else {
    loading.value = false;
  }
});

onUnmounted(() => {
  window.removeEventListener("storage", updateLanguage);
});

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value;
  const lowerSearch = searchQuery.value.toLowerCase();
  return products.value.filter(p => 
    (p.name && p.name.toLowerCase().includes(lowerSearch)) || 
    (p.category && p.category.toLowerCase().includes(lowerSearch))
  );
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredProducts.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

watch(searchQuery, () => {
  currentPage.value = 1;
});

const formatPrice = (value) => {
  return new Intl.NumberFormat('id-ID').format(value);
};

const openModal = () => {
  resetForm();
  isEditing.value = false;
  isModalOpen.value = true;
};

const editProduct = (product) => {
  isEditing.value = true;
  currentId.value = product.id;
  form.name = product.name;
  form.price = product.price;
  form.shipping = product.shipping || 0;
  form.stock = product.stock || 0; 
  form.category = product.category;
  form.size = product.size || '';
  form.condition = product.condition || 'New';
  form.color = product.color || '';
  form.description = product.description || '';
  form.imagePreview = product.image;
  form.imageBase64 = product.image; 
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  resetForm();
};

const resetForm = () => {
  Object.keys(form).forEach(key => form[key] = '');
  form.category = 'Vans';
  form.condition = 'New';
  currentId.value = null;
  if (fileInput.value) fileInput.value.value = '';
};

const processImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 500;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    };
  });
};

const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      alert(lang.value === 'id' ? 'File terlalu besar' : lang.value === 'jp' ? 'ファイルサイズが大きすぎます' : 'File too large');
      return;
    }
    const base64 = await processImage(file);
    form.imagePreview = base64;
    form.imageBase64 = base64;
  }
};

const saveProduct = async () => {
  if (!form.name || !form.price) {
    alert(lang.value === 'id' ? 'Nama dan Harga wajib diisi' : lang.value === 'jp' ? '名前と価格は必須です' : 'Name and Price are required');
    return;
  }
  saving.value = true;
  
  try {
    const user = auth.currentUser;
    const now = new Date();
    const dateString = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

    const productData = {
      name: form.name,
      price: parseInt(form.price),
      shipping: parseInt(form.shipping) || 0,
      stock: parseInt(form.stock) || 0, 
      category: form.category,
      size: form.size,
      condition: form.condition,
      color: form.color,
      description: form.description,
      image: form.imageBase64,
      userId: user.uid,
      uploaded: isEditing.value ? products.value.find(p => p.id === currentId.value).uploaded : dateString,
      updatedAt: Date.now()
    };

    if (isEditing.value && currentId.value) {
      await set(dbRef(db, `products/${currentId.value}`), productData);
    } else {
      await push(dbRef(db, 'products'), productData);
    }
    closeModal();
  } catch (e) {
    alert((lang.value === 'id' ? 'Gagal menyimpan: ' : lang.value === 'jp' ? '保存に失敗しました: ' : 'Failed to save: ') + e.message);
  } finally {
    saving.value = false;
  }
};

const deleteProduct = async (id) => {
  if (confirm(lang.value === 'id' ? 'Hapus produk ini?' : lang.value === 'jp' ? 'この商品を削除しますか？' : 'Delete this product?')) {
    try {
      await remove(dbRef(db, `products/${id}`));
    } catch (e) {
      alert(lang.value === 'id' ? 'Gagal menghapus' : lang.value === 'jp' ? '削除に失敗しました' : 'Failed to delete');
    }
  }
};
</script>