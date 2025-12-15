<template>
  <div class="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8 transition">
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
            <a href="/change-password" class="block px-3 py-2 text-sm font-bold text-gray-900 bg-transparent rounded-md hover:bg-gray-100">
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
            {{ lang === 'id' ? 'Ganti Kata Sandi' : lang === 'jp' ? 'パスワード変更' : 'Change Password' }}
          </h2>

          <div v-if="message.text" :class="`p-4 mb-4 rounded-md text-sm ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`">
            {{ message.text }}
          </div>

          <div class="space-y-6">
            <div class="grid grid-cols-1 gap-y-6">
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ lang === 'id' ? 'Kata Sandi Lama' : lang === 'jp' ? '現在のパスワード' : 'Old Password' }}
                </label>
                <input 
                  v-model="form.oldPassword" 
                  type="password" 
                  :placeholder="lang === 'id' ? 'Masukkan kata sandi saat ini' : lang === 'jp' ? '現在のパスワードを入力' : 'Enter current password'"
                  class="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                >
              </div>

              <div class="border-t border-gray-100 my-2"></div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ lang === 'id' ? 'Kata Sandi Baru' : lang === 'jp' ? '新しいパスワード' : 'New Password' }}
                </label>
                <input 
                  v-model="form.newPassword" 
                  type="password" 
                  :placeholder="lang === 'id' ? 'Minimal 6 karakter' : lang === 'jp' ? '6文字以上' : 'Minimum 6 characters'"
                  class="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ lang === 'id' ? 'Konfirmasi Kata Sandi Baru' : lang === 'jp' ? '新しいパスワード（確認）' : 'Confirm New Password' }}
                </label>
                <input 
                  v-model="form.confirmPassword" 
                  type="password" 
                  :placeholder="lang === 'id' ? 'Masukkan ulang kata sandi baru' : lang === 'jp' ? '新しいパスワードを再入力' : 'Re-enter new password'"
                  class="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                >
              </div>

            </div>

            <div class="flex justify-end pt-4">
              <button 
                @click="updatePasswordHandler"
                :disabled="isLoading"
                class="px-6 py-2 bg-teal-600 text-white font-medium rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 transition flex items-center gap-2"
              >
                <span v-if="isLoading" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                {{ isLoading 
                    ? (lang === 'id' ? 'Memperbarui...' : lang === 'jp' ? '更新中...' : 'Updating...') 
                    : (lang === 'id' ? 'Perbarui Kata Sandi' : lang === 'jp' ? 'パスワードを更新' : 'Update Password') 
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
import { auth } from '../firebase'; 
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

const isLoading = ref(false);
const message = reactive({ type: '', text: '' });
const lang = ref(localStorage.getItem("lang") || "id");

const form = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// Update Bahasa
const updateLanguage = () => {
  lang.value = localStorage.getItem("lang") || "id";
};

onMounted(() => {
  window.addEventListener("storage", updateLanguage);
});

onUnmounted(() => {
  window.removeEventListener("storage", updateLanguage);
});

const updatePasswordHandler = async () => {
  message.text = '';
  
  if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
    message.type = 'error';
    message.text = lang.value === 'id' ? 'Mohon isi semua kolom.' : lang.value === 'jp' ? 'すべての項目を入力してください。' : 'Please fill in all fields.';
    return;
  }

  if (form.newPassword.length < 6) {
    message.type = 'error';
    message.text = lang.value === 'id' ? 'Password minimal 6 karakter.' : lang.value === 'jp' ? 'パスワードは6文字以上必要です。' : 'Password must be at least 6 characters.';
    return;
  }

  if (form.newPassword !== form.confirmPassword) {
    message.type = 'error';
    message.text = lang.value === 'id' ? 'Konfirmasi password tidak cocok.' : lang.value === 'jp' ? 'パスワードが一致しません。' : 'Passwords do not match.';
    return;
  }

  isLoading.value = true;

  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not found");

    const credential = EmailAuthProvider.credential(user.email, form.oldPassword);
    
    await reauthenticateWithCredential(user, credential);

    await updatePassword(user, form.newPassword);

    message.type = 'success';
    message.text = lang.value === 'id' ? 'Password berhasil diperbarui!' : lang.value === 'jp' ? 'パスワードが更新されました！' : 'Password updated successfully!';
    
    form.oldPassword = '';
    form.newPassword = '';
    form.confirmPassword = '';

  } catch (error) {
    message.type = 'error';
    
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
      message.text = lang.value === 'id' ? 'Password lama salah.' : lang.value === 'jp' ? '古いパスワードが間違っています。' : 'Incorrect old password.';
    } else if (error.code === 'auth/requires-recent-login') {
      message.text = lang.value === 'id' ? 'Sesi habis, silakan login ulang.' : lang.value === 'jp' ? 'セッション切れです。再ログインしてください。' : 'Session expired, please login again.';
    } else {
      message.text = 'Error: ' + error.message;
    }
  } finally {
    isLoading.value = false;
  }
};
</script>