<template>
  <div class="w-screen min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition pt-20">
    <div class="p-6 w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-xl">
      
      <h1 class="text-2xl font-bold mb-1 text-center text-gray-900 dark:text-white">
        {{ isVerifying ? (lang === 'id' ? 'Verifikasi Email' : lang === 'jp' ? 'メール確認' : 'Verify Email') 
           : (lang === 'id' ? 'Daftar' : lang === 'jp' ? '登録' : 'Register') }}
      </h1>
      <p class="text-center text-gray-600 dark:text-gray-400 text-sm mb-6">
        {{ isVerifying 
            ? (lang === 'id' ? `Kode OTP telah dikirim ke ${email}` : lang === 'jp' ? `${email} にコードを送信しました` : `OTP Code sent to ${email}`)
            : (lang === 'id' ? 'Masukkan detail Anda di bawah' : lang === 'jp' ? '以下に詳細を入力してください' : 'Enter your details below') 
        }}
      </p>

      <div
        v-if="error"
        class="mb-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 py-3 px-4 rounded-lg text-sm border border-red-300 dark:border-red-700"
      >
        {{ error }}
      </div>

      <div v-if="!isVerifying">
        <div class="mb-3">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ lang === 'id' ? 'Nama Lengkap' : lang === 'jp' ? 'フルネーム' : 'Full Name' }} *
          </label>
          <input 
            v-model="fullname" 
            :placeholder="lang === 'id' ? 'Masukkan nama lengkap' : 'Enter your fullname'" 
            class="border dark:border-gray-600 p-2 w-full mb-2 rounded bg-white dark:bg-gray-700 dark:text-white focus:ring focus:ring-blue-300 transition" 
          />
        </div>

        <div class="mb-3">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ lang === 'id' ? 'Username' : lang === 'jp' ? 'ユーザー名' : 'Username' }} *
          </label>
          <input 
            v-model="username" 
            :placeholder="lang === 'id' ? 'Masukkan username' : 'Enter username'" 
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
            :placeholder="lang === 'id' ? 'Masukkan email' : 'Enter your email'" 
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
              :placeholder="lang === 'id' ? 'Masukkan kata sandi' : 'Enter your password'" 
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
              :placeholder="lang === 'id' ? 'Konfirmasi kata sandi' : 'Confirm your password'" 
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
          @click="initiateRegister"
          :disabled="loading || !agreePolicy"
          class="bg-teal-500 hover:bg-teal-600 disabled:bg-gray-400 text-white px-4 py-2 rounded w-full font-medium transition flex justify-center items-center gap-2"
        >
          <span v-if="loading" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
          {{ loading ? (lang === 'id' ? 'Mengirim Kode...' : 'Sending OTP...') : (lang === 'id' ? 'Lanjut' : lang === 'jp' ? '次へ' : 'Next') }}
        </button>

        <p class="text-center text-gray-600 dark:text-gray-400 text-sm mt-4">
          {{ lang === 'id' ? 'Sudah punya akun?' : lang === 'jp' ? 'アカウントをお持ちですか？' : 'Already have an account?' }}
          <RouterLink to="/login" class="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            {{ lang === 'id' ? 'Masuk' : lang === 'jp' ? 'ログイン' : 'Login' }}
          </RouterLink>
        </p>
      </div>

      <div v-else class="animate-fade-in">
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-center">
            {{ lang === 'id' ? 'Masukkan Kode OTP' : lang === 'jp' ? 'OTPコードを入力' : 'Enter OTP Code' }}
          </label>
          <input 
            v-model="inputOtp" 
            type="text" 
            maxlength="6"
            placeholder="XXXXXX" 
            class="text-center text-2xl tracking-widest border dark:border-gray-600 p-3 w-full mb-2 rounded bg-white dark:bg-gray-700 dark:text-white focus:ring focus:ring-blue-300 transition" 
          />
          <p class="text-xs text-center text-gray-500 mt-2">
            {{ lang === 'id' ? 'Kode telah dikirim via Email.' : 'Code sent via Email.' }}
            <br>
            <span class="text-red-500 font-medium text-[10px]">*Cek folder SPAM jika tidak ada di Inbox.</span>
          </p>
        </div>

        <div class="flex gap-3">
          <button
            @click="isVerifying = false"
            class="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            {{ lang === 'id' ? 'Kembali' : lang === 'jp' ? '戻る' : 'Back' }}
          </button>
          <button
            @click="finalizeRegister"
            :disabled="loading || inputOtp.length < 6"
            class="flex-1 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white px-4 py-2 rounded font-medium transition flex justify-center items-center gap-2"
          >
            <span v-if="loading" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            {{ loading ? (lang === 'id' ? 'Memproses...' : 'Processing...') : (lang === 'id' ? 'Verifikasi' : 'Verify') }}
          </button>
        </div>
      </div>

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
           {{ lang === 'id' ? 'Akun Anda telah terverifikasi dan siap digunakan.' : 'Your account has been verified and is ready to use.' }}
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
// PENTING: Install dulu library ini: npm install @emailjs/browser
import emailjs from '@emailjs/browser';

const router = useRouter();

// State
const lang = ref(localStorage.getItem("lang") || "id");
const isDark = ref(localStorage.getItem("darkMode") === "true");
const loading = ref(false);
const error = ref("");
const showSuccessModal = ref(false);

// Form Fields
const fullname = ref("");
const username = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const agreePolicy = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// Verification States
const isVerifying = ref(false);
const inputOtp = ref("");
const generatedOtp = ref("");

// --- STEP 1: VALIDASI & KIRIM EMAIL ---
async function initiateRegister() {
  error.value = "";

  if (!fullname.value || !username.value || !email.value || !password.value) {
    error.value = lang.value === 'id' ? "Semua field harus diisi." : "All fields are required.";
    return;
  }
  if (password.value !== confirmPassword.value) {
    error.value = lang.value === 'id' ? "Password tidak cocok." : "Passwords do not match.";
    return;
  }
  if (!agreePolicy.value) return;

  loading.value = true;

  // 1. Generate OTP (6 Digit Angka)
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  generatedOtp.value = code;

  // === SETTING EMAILJS (SESUAI PERMINTAAN) ===
  const SERVICE_ID = 'service_g72lg9o';  // Service ID Anda
  const PUBLIC_KEY = '7b4PqssHvaTcpxSnS'; // Public Key Anda
  const TEMPLATE_ID = 'template_570vyi7';

  // Parameter yang dikirim ke Template Email
  const templateParams = {
    to_name: fullname.value,
    otp: code,              
    to_email: email.value   
  };

  try {
    // Kirim Email
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
    
    // Pindah ke tampilan input OTP
    isVerifying.value = true;

  } catch (err) {
    console.error('EmailJS Error:', err);
    error.value = lang.value === 'id' 
      ? 'Gagal mengirim email. Periksa Template ID atau koneksi.' 
      : 'Failed to send email. Check Template ID or connection.';
  } finally {
    loading.value = false;
  }
}

// --- STEP 2: CEK OTP & BUAT USER FIREBASE ---
async function finalizeRegister() {
  error.value = "";
  
  if (inputOtp.value !== generatedOtp.value) {
    error.value = lang.value === 'id' ? "Kode OTP salah!" : "Invalid OTP Code!";
    return;
  }

  loading.value = true;

  try {
    // 1. Buat User di Firebase Auth
    const userCred = await createUserWithEmailAndPassword(auth, email.value, password.value);

    // 2. Update Nama
    await updateProfile(userCred.user, { displayName: fullname.value });

    // 3. Simpan data ke Database
    await set(dbRef(db, `users/${userCred.user.uid}`), {
      fullname: fullname.value,
      username: username.value,
      email: email.value,
      photoURL: "",
      agreePolicy: true,
      isVerified: true, // User sudah terverifikasi emailnya
      createdAt: new Date().toISOString(),
    });

    await auth.currentUser.reload();
    
    loading.value = false;
    showSuccessModal.value = true;

  } catch (e) {
    error.value = e.message;
    loading.value = false;
    // Jika email sudah ada, kembalikan ke awal
    if(e.code === 'auth/email-already-in-use') {
       isVerifying.value = false; 
    }
  }
}

function goToHome() {
  router.push("/");
}

onMounted(() => {
  window.addEventListener("storage", () => {
    lang.value = localStorage.getItem("lang") || "id";
  });
  window.addEventListener("darkModeToggle", (e) => {
    isDark.value = e.detail;
  });
  document.documentElement.classList.toggle("dark", isDark.value);
});
</script>