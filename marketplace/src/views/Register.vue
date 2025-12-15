<template>
  <div class="w-screen min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition pt-20">
    <div class="p-6 w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-xl">
      
      <h1 class="text-2xl font-bold mb-1 text-center text-gray-900 dark:text-white">
        {{ lang === 'id' ? 'Daftar' : lang === 'jp' ? '登録' : 'Register' }}
      </h1>
      <p class="text-center text-gray-600 dark:text-gray-400 text-sm mb-6">
        {{ lang === 'id' ? 'Masukkan detail Anda di bawah' : lang === 'jp' ? '以下に詳細を入力してください' : 'Enter your details below' }}
      </p>

      <div
        v-if="error"
        class="mb-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 py-3 px-4 rounded-lg text-sm border border-red-300 dark:border-red-700"
      >
        {{ error }}
      </div>

      <div class="mb-3">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ lang === 'id' ? 'Nama Lengkap' : lang === 'jp' ? 'フルネーム' : 'Full Name' }} *
        </label>
        <input 
          v-model="fullname" 
          :placeholder="lang === 'id' ? 'Masukkan nama lengkap' : lang === 'jp' ? 'フルネームを入力' : 'Enter your fullname'" 
          class="border dark:border-gray-600 p-2 w-full mb-2 rounded bg-white dark:bg-gray-700 dark:text-white focus:ring focus:ring-blue-300 transition" 
        />
      </div>

      <div class="mb-3">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ lang === 'id' ? 'Username' : lang === 'jp' ? 'ユーザー名' : 'Username' }} *
        </label>
        <input 
          v-model="username" 
          :placeholder="lang === 'id' ? 'Masukkan username' : lang === 'jp' ? 'ユーザー名を入力' : 'Enter your fullname'" 
          class="border dark:border-gray-600 p-2 w-full mb-2 rounded bg-white dark:bg-gray-700 dark:text-white focus:ring focus:ring-blue-300 transition" 
        />
      </div>

      <div class="mb-3">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ lang === 'id' ? 'Email' : lang === 'jp' ? 'メール' : 'Email' }} *
        </label>
        <input 
          v-model="email" 
          type="email"
          :placeholder="lang === 'id' ? 'Masukkan email' : lang === 'jp' ? 'メールアドレスを入力' : 'Enter your email'" 
          class="border dark:border-gray-600 p-2 w-full mb-2 rounded bg-white dark:bg-gray-700 dark:text-white focus:ring focus:ring-blue-300 transition" 
        />
      </div>

      <div class="mb-3">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ lang === 'id' ? 'Kata Sandi' : lang === 'jp' ? 'パスワード' : 'Password' }} *
        </label>
        <div class="relative">
          <input 
            v-model="password" 
            :type="showPassword ? 'text' : 'password'" 
            :placeholder="lang === 'id' ? 'Masukkan kata sandi' : lang === 'jp' ? 'パスワードを入力' : 'Enter your password'" 
            class="border dark:border-gray-600 p-2 w-full mb-2 rounded bg-white dark:bg-gray-700 dark:text-white focus:ring focus:ring-blue-300 transition" 
          />
          <button @click="showPassword = !showPassword" class="absolute right-3 top-2 text-gray-600 dark:text-gray-400">
            {{ showPassword ? '👁️' : '🔒' }}
          </button>
        </div>
      </div>

      <div class="mb-3">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ lang === 'id' ? 'Konfirmasi Kata Sandi' : lang === 'jp' ? 'パスワード確認' : 'Confirm Password' }} *
        </label>
        <div class="relative">
          <input 
            v-model="confirmPassword" 
            :type="showConfirmPassword ? 'text' : 'password'" 
            :placeholder="lang === 'id' ? 'Konfirmasi kata sandi' : lang === 'jp' ? 'パスワードを確認' : 'Confirm your password'" 
            class="border dark:border-gray-600 p-2 w-full mb-2 rounded bg-white dark:bg-gray-700 dark:text-white focus:ring focus:ring-blue-300 transition" 
          />
          <button @click="showConfirmPassword = !showConfirmPassword" class="absolute right-3 top-2 text-gray-600 dark:text-gray-400">
            {{ showConfirmPassword ? '👁️' : '🔒' }}
          </button>
        </div>
      </div>

      <label class="flex items-center gap-2 mb-4 text-sm cursor-pointer">
        <input type="checkbox" v-model="agreePolicy" class="w-4 h-4 dark:accent-blue-600" />
        <span class="text-gray-700 dark:text-gray-300">
          {{ lang === 'id' ? 'Saya setuju dengan' : lang === 'jp' ? 'に同意します' : 'I agree to the' }}
          <a href="#" class="text-blue-600 dark:text-blue-400 hover:underline">
            {{ lang === 'id' ? 'Syarat & Kebijakan' : lang === 'jp' ? '利用規約とプライバシーポリシー' : 'Terms & Policy' }}
          </a>
        </span>
      </label>

      <button
        @click="register"
        :disabled="loading || !agreePolicy"
        class="bg-teal-500 hover:bg-teal-600 disabled:bg-gray-400 text-white px-4 py-2 rounded w-full font-medium transition"
      >
        {{ loading ? (lang === 'id' ? 'Sedang mendaftar...' : lang === 'jp' ? '登録中...' : 'Registering...') : (lang === 'id' ? 'Daftar' : lang === 'jp' ? '登録' : 'Register') }}
      </button>

      <p class="text-center text-gray-600 dark:text-gray-400 text-sm mt-4">
        {{ lang === 'id' ? 'Sudah punya akun?' : lang === 'jp' ? 'アカウントをお持ちですか？' : 'Already have an account?' }}
        <RouterLink to="/login" class="text-blue-600 dark:text-blue-400 hover:underline font-medium">
          {{ lang === 'id' ? 'Masuk' : lang === 'jp' ? 'ログイン' : 'Login' }}
        </RouterLink>
      </p>
    </div>

    <div v-if="showSuccessModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center transform transition-all scale-100">
        <div class="mx-auto mb-4">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-20 h-20 text-blue-400 mx-auto transform -rotate-12">
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
        </div>

        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {{ lang === 'id' ? 'Berhasil Mendaftar' : lang === 'jp' ? '登録成功' : 'Successfully Register' }}
        </h2>

        <p class="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
           {{ lang === 'id' ? 'Terima kasih telah mendaftar di Marketplace. Mulai temukan produk favorit Anda di sini.' : lang === 'jp' ? 'ご登録ありがとうございます。ここでお気に入りの商品を見つけてください。' : 'Thank you for register at Marketplace. Start find your favorite product here.' }}
        </p>

        <button 
          @click="goToHome" 
          class="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-lg transition duration-200 shadow-md"
        >
          {{ lang === 'id' ? 'Ke Beranda' : lang === 'jp' ? 'ホームページへ' : 'Go to Home Page' }}
        </button>
      </div>
    </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { set, ref as dbRef } from "firebase/database";
import { useRouter, RouterLink } from "vue-router";

const router = useRouter();

// Language & Theme
const lang = ref(localStorage.getItem("lang") || "id");
const isDark = ref(localStorage.getItem("darkMode") === "true");

// Form Data
const fullname = ref("");
const username = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const agreePolicy = ref(false);
const error = ref("");
const loading = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// Modal State
const showSuccessModal = ref(false);

async function register() {
  error.value = "";

  if (!fullname.value || !username.value || !email.value || !password.value) {
    error.value = lang.value === 'id' 
      ? "Semua field harus diisi." 
      : lang.value === 'jp'
        ? "すべてのフィールドを入力してください。"
        : "All fields are required.";
    return;
  }

  if (password.value !== confirmPassword.value) {
    error.value = lang.value === 'id' 
      ? "Password tidak cocok." 
      : lang.value === 'jp'
        ? "パスワードが一致しません。"
        : "Passwords do not match.";
    return;
  }

  if (!agreePolicy.value) {
    error.value = lang.value === 'id' 
      ? "Anda harus menyetujui Terms & Policy." 
      : lang.value === 'jp'
        ? "利用規約とプライバシーポリシーに同意する必要があります。"
        : "You must agree to Terms & Policy.";
    return;
  }

  loading.value = true;

  try {
    const userCred = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    await updateProfile(userCred.user, {
      displayName: fullname.value,
    });

    await set(dbRef(db, `users/${userCred.user.uid}`), {
      fullname: fullname.value,
      username: username.value,
      email: email.value,
      photoURL: "",
      agreePolicy: true,
      createdAt: new Date().toISOString(),
    });

    await auth.currentUser.reload();
    
    // Tampilkan Modal sukses, jangan langsung redirect
    loading.value = false;
    showSuccessModal.value = true;

  } catch (e) {
    error.value = e.message;
    loading.value = false;
  }
}

// Navigasi ke Home saat tombol modal diklik
function goToHome() {
  router.push("/");
}

onMounted(() => {
  // Sync language
  window.addEventListener("storage", () => {
    lang.value = localStorage.getItem("lang") || "id";
  });

  // Sync dark mode
  window.addEventListener("darkModeToggle", (e) => {
    isDark.value = e.detail;
  });

  // Set initial dark mode
  document.documentElement.classList.toggle("dark", isDark.value);
});
</script>