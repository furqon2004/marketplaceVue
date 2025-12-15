<template>
  <div class="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8 transition">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">
        {{ lang === 'id' ? 'Pengaturan' : lang === 'jp' ? '設定' : 'Settings' }}
      </h1>

      <div class="flex flex-col md:flex-row gap-8">
        
        <aside class="w-full md:w-64 flex-shrink-0">
          <nav class="space-y-1">
            <a href="/profile" class="block px-3 py-2 text-sm font-bold text-gray-900 bg-transparent rounded-md hover:bg-gray-100">
              {{ lang === 'id' ? 'Detail Profil' : lang === 'jp' ? 'プロフィール詳細' : 'Profile details' }}
            </a>
            <a href="/change-password" class="block px-3 py-2 text-sm font-medium text-gray-500 rounded-md hover:text-gray-900 hover:bg-gray-100">
              {{ lang === 'id' ? 'Ganti Kata Sandi' : lang === 'jp' ? 'パスワード変更' : 'Change Password' }}
            </a>
            <a href="/history" class="block px-3 py-2 text-sm font-medium text-gray-500 rounded-md hover:text-gray-900 hover:bg-gray-100">
              {{ lang === 'id' ? 'Riwayat Transaksi' : lang === 'jp' ? '取引履歴' : 'Transaction History' }}
            </a>
            <a href="/my-products" class="block px-3 py-2 text-sm font-medium text-gray-500 rounded-md hover:text-gray-900 hover:bg-gray-100">
              {{ lang === 'id' ? 'Produk Saya' : lang === 'jp' ? '出品商品' : 'My Products' }}
            </a>
          </nav>
        </aside>

        <main class="flex-1 bg-white shadow rounded-lg p-6 md:p-8">
          <h2 class="text-lg font-medium text-gray-900 mb-6">
            {{ lang === 'id' ? 'Edit Profil' : lang === 'jp' ? 'プロフィール編集' : 'Edit Profile' }}
          </h2>

          <div class="space-y-6">
            <div class="flex items-center gap-x-8">
              <div class="flex-shrink-0">
                <div class="relative w-20 h-20 rounded-full overflow-hidden bg-cyan-50 flex items-center justify-center border border-gray-200">
                  <img 
                    v-if="photoPreview || form.photoURL" 
                    :src="photoPreview || form.photoURL" 
                    alt="Profile" 
                    class="w-full h-full object-cover"
                  >
                  <svg v-else class="h-10 w-10 text-cyan-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>

              <div class="flex items-center gap-4">
                <button 
                  type="button" 
                  @click="$refs.fileInput.click()"
                  class="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition"
                >
                  {{ lang === 'id' ? 'Pilih' : lang === 'jp' ? '選択' : 'Choose' }}
                </button>
                <input 
                  type="file" 
                  ref="fileInput" 
                  class="hidden" 
                  accept="image/png, image/jpeg, image/jpg"
                  @change="handleFileChange"
                >
                <span class="text-sm text-gray-500">JPG, JPEG or PNG, 2 MB max.</span>
              </div>

              <button @click="removePhoto" class="ml-auto text-gray-400 hover:text-red-500" :title="lang === 'id' ? 'Hapus foto' : 'Remove photo'">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>

            <div class="border-t border-gray-100 my-6"></div>

            <div class="grid grid-cols-1 gap-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ lang === 'id' ? 'Nama Lengkap' : lang === 'jp' ? '氏名' : 'Full name' }}
                </label>
                <input v-model="form.displayName" type="text" class="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ lang === 'id' ? 'Username' : lang === 'jp' ? 'ユーザー名' : 'Username' }}
                </label>
                <input v-model="form.username" type="text" class="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ lang === 'id' ? 'Email' : lang === 'jp' ? 'メールアドレス' : 'Email' }}
                </label>
                <input v-model="form.email" type="email" disabled class="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-gray-500 shadow-sm cursor-not-allowed sm:text-sm">
              </div>
            </div>

            <div class="flex justify-end pt-4">
              <button 
                @click="updateProfileHandler"
                :disabled="isLoading"
                class="px-6 py-2 bg-teal-600 text-white font-medium rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 transition flex items-center gap-2"
              >
                <span v-if="isLoading" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                {{ isLoading 
                    ? (lang === 'id' ? 'Menyimpan...' : lang === 'jp' ? '保存中...' : 'Saving...') 
                    : (lang === 'id' ? 'Simpan Profil' : lang === 'jp' ? 'プロフィールを更新' : 'Update Profile') 
                }}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { auth, db } from '../firebase'; 
import { ref as dbRef, update, get } from 'firebase/database';
import { updateProfile } from 'firebase/auth';

const isLoading = ref(false);
const fileInput = ref(null);
const photoPreview = ref(null);
const photoBase64 = ref(null);
const lang = ref(localStorage.getItem("lang") || "id");

const form = reactive({
  displayName: '',
  username: '',
  email: '',
  photoURL: ''
});

// Update Bahasa
const updateLanguage = () => {
  lang.value = localStorage.getItem("lang") || "id";
};

onMounted(async () => {
  window.addEventListener("storage", updateLanguage);

  const user = auth.currentUser;
  if (user) {
    form.email = user.email || '';
    form.displayName = user.displayName || '';
    
    try {
      const snapshot = await get(dbRef(db, 'users/' + user.uid));
      if (snapshot.exists()) {
        const data = snapshot.val();
        form.username = data.username || '';
        form.displayName = data.fullname || user.displayName || '';
        form.photoURL = data.photoURL || ''; 
      }
    } catch (error) {
      console.error("Gagal ambil data user:", error);
    }
  }
});

onUnmounted(() => {
  window.removeEventListener("storage", updateLanguage);
});

const processImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
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
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      alert(lang.value === 'id' ? 'File terlalu besar' : 'File too large');
      return;
    }
    
    try {
      const base64String = await processImage(file);
      photoBase64.value = base64String;
      photoPreview.value = base64String;
    } catch (e) {
      alert("Gagal memproses gambar");
    }
  }
};

const removePhoto = () => {
  photoPreview.value = null;
  photoBase64.value = ''; 
  form.photoURL = ''; 
};

const updateProfileHandler = async () => {
  isLoading.value = true;
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User belum login");

    await updateProfile(user, {
      displayName: form.displayName
    });

    const updates = {
      fullname: form.displayName,
      username: form.username,
    };

    if (photoBase64.value !== null) {
      updates.photoURL = photoBase64.value;
    } else if (form.photoURL === '') {
      updates.photoURL = '';
    }

    await update(dbRef(db, 'users/' + user.uid), updates);

    alert(lang.value === 'id' ? 'Profil berhasil disimpan!' : 'Profile saved successfully!');
    window.location.reload();
    
  } catch (error) {
    console.error("Error:", error);
    alert("Gagal: " + error.message);
  } finally {
    isLoading.value = false;
  }
};
</script>