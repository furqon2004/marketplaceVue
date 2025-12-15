<template>
  <div class="w-screen min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition pt-20">
    <div class="p-6 w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-xl">

      <h1 class="text-2xl font-bold mb-1 text-center text-gray-900 dark:text-white">
        {{ lang === 'id' ? 'Masuk' : lang === 'jp' ? 'ログイン' : 'Login' }}
      </h1>
      <p class="text-center text-gray-600 dark:text-gray-400 text-sm mb-6">
        {{ lang === 'id' ? 'Selamat datang kembali!' : lang === 'jp' ? 'おかえりなさい！' : 'Welcome back!' }}
      </p>

      <!-- ALERT ERROR -->
      <div
        v-if="error"
        class="mb-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 py-3 px-4 rounded-lg text-sm border border-red-300 dark:border-red-700 animate-fade"
      >
        {{ error }}
      </div>

      <!-- Email -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ lang === 'id' ? 'Email' : lang === 'jp' ? 'メール' : 'Email' }} *
        </label>
        <input
          v-model="email"
          type="email"
          :placeholder="lang === 'id' ? 'Masukkan email Anda' : lang === 'jp' ? 'メールアドレスを入力' : 'Enter your email'"
          class="border dark:border-gray-600 p-2 w-full rounded bg-white dark:bg-gray-700 dark:text-white focus:ring focus:ring-blue-300 transition"
        />
      </div>

      <!-- Password -->
      <div class="mb-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ lang === 'id' ? 'Kata Sandi' : lang === 'jp' ? 'パスワード' : 'Password' }} *
        </label>
        <div class="relative">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            :placeholder="lang === 'id' ? 'Masukkan kata sandi' : lang === 'jp' ? 'パスワードを入力' : 'Enter your password'"
            class="border dark:border-gray-600 p-2 w-full rounded bg-white dark:bg-gray-700 dark:text-white focus:ring focus:ring-blue-300 transition"
          />
          <button @click="showPassword = !showPassword" class="absolute right-3 top-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
            {{ showPassword ? '👁️' : '🔒' }}
          </button>
        </div>
      </div>

      <!-- Forgot Password Link -->
      <div class="text-right mb-4">
        <a href="#" class="text-xs text-blue-600 dark:text-blue-400 hover:underline">
          {{ lang === 'id' ? 'Lupa kata sandi?' : lang === 'jp' ? 'パスワードをお忘れですか？' : 'Forgot password?' }}
        </a>
      </div>

      <!-- Login Button -->
      <button
        @click="login"
        :disabled="loading"
        class="bg-teal-500 hover:bg-teal-600 disabled:bg-gray-400 text-white px-4 py-2 rounded w-full font-medium transition mb-4"
      >
        {{ loading ? (lang === 'id' ? 'Sedang masuk...' : lang === 'jp' ? 'ログイン中...' : 'Logging in...') : (lang === 'id' ? 'Masuk' : lang === 'jp' ? 'ログイン' : 'Login') }}
      </button>

      <!-- Divider -->
      <div class="flex items-center gap-3 my-4">
        <div class="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
        <span class="text-gray-500 dark:text-gray-400 text-xs">
          {{ lang === 'id' ? 'atau' : lang === 'jp' ? 'または' : 'or' }}
        </span>
        <div class="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
      </div>

      <!-- Register Link -->
      <p class="text-center text-gray-600 dark:text-gray-400 text-sm">
        {{ lang === 'id' ? 'Belum punya akun?' : lang === 'jp' ? 'アカウントがありませんか？' : 'Don\'t have an account?' }}
        <RouterLink to="/register" class="text-blue-600 dark:text-blue-400 hover:underline font-medium">
          {{ lang === 'id' ? 'Daftar sekarang' : lang === 'jp' ? '今すぐ登録' : 'Register now' }}
        </RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter, RouterLink } from "vue-router";

const router = useRouter();

// Language & Theme
const lang = ref(localStorage.getItem("lang") || "id");
const isDark = ref(localStorage.getItem("darkMode") === "true");

// Form Data
const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);
const showPassword = ref(false);

async function login() {
  error.value = "";

  if (!email.value || !password.value) {
    error.value = lang.value === 'id' 
      ? "Email dan password harus diisi." 
      : lang.value === 'jp'
        ? "メールアドレスとパスワードを入力してください。"
        : "Email and password are required.";
    return;
  }

  loading.value = true;

  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push("/");
  } catch (e) {
    error.value = lang.value === 'id' 
      ? "Email atau password salah!" 
      : lang.value === 'jp'
        ? "メールアドレスまたはパスワードが間違っています！"
        : "Email or password is incorrect!";
  } finally {
    loading.value = false;
  }
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

<style scoped>
@keyframes fade {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade {
  animation: fade 0.2s ease-out;
}
</style>