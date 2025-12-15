<template>
  <footer class="bg-teal-900 text-gray-300 px-8 py-12 mt-10">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        
        <div>
          <h3 class="text-white font-bold text-lg mb-4">
            {{ lang === 'id' ? 'Tentang Kami' : lang === 'jp' ? '私たちについて' : 'About Us' }}
          </h3>
          <ul class="space-y-2 text-sm">
            <li>
              <a href="#" class="hover:text-white transition">
                {{ lang === 'id' ? 'Tentang MarketPlace' : lang === 'jp' ? 'MarketPlaceについて' : 'About MarketPlace' }}
              </a>
            </li>
            <li>
              <a href="#" class="hover:text-white transition">
                {{ lang === 'id' ? 'Karir' : lang === 'jp' ? '採用情報' : 'Careers' }}
              </a>
            </li>
            <li>
              <a href="#" class="hover:text-white transition">
                {{ lang === 'id' ? 'Blog' : lang === 'jp' ? 'ブログ' : 'Blog' }}
              </a>
            </li>
            <li>
              <a href="#" class="hover:text-white transition">
                {{ lang === 'id' ? 'Berita' : lang === 'jp' ? 'ニュース' : 'News' }}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-white font-bold text-lg mb-4">
            {{ lang === 'id' ? 'Layanan Pelanggan' : lang === 'jp' ? 'カスタマーサービス' : 'Customer Service' }}
          </h3>
          <ul class="space-y-2 text-sm">
            <li>
              <a href="#" class="hover:text-white transition">
                {{ lang === 'id' ? 'Hubungi Kami' : lang === 'jp' ? 'お問い合わせ' : 'Contact Us' }}
              </a>
            </li>
            <li>
              <a href="#" class="hover:text-white transition">
                {{ lang === 'id' ? 'Panduan Belanja' : lang === 'jp' ? '買い物ガイド' : 'Shopping Guide' }}
              </a>
            </li>
            <li>
              <a href="#" class="hover:text-white transition">
                {{ lang === 'id' ? 'Lacak Pesanan' : lang === 'jp' ? '注文追跡' : 'Track Order' }}
              </a>
            </li>
            <li>
              <a href="#" class="hover:text-white transition">
                {{ lang === 'id' ? 'Kebijakan Pengembalian' : lang === 'jp' ? '返品ポリシー' : 'Return Policy' }}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-white font-bold text-lg mb-4">
            {{ lang === 'id' ? 'Kebijakan' : lang === 'jp' ? 'ポリシー' : 'Policies' }}
          </h3>
          <ul class="space-y-2 text-sm">
            <li>
              <a href="#" class="hover:text-white transition">
                {{ lang === 'id' ? 'Syarat & Ketentuan' : lang === 'jp' ? '利用規約' : 'Terms & Conditions' }}
              </a>
            </li>
            <li>
              <a href="#" class="hover:text-white transition">
                {{ lang === 'id' ? 'Kebijakan Privasi' : lang === 'jp' ? 'プライバシーポリシー' : 'Privacy Policy' }}
              </a>
            </li>
            <li>
              <a href="#" class="hover:text-white transition">
                {{ lang === 'id' ? 'Kebijakan Cookie' : lang === 'jp' ? 'クッキーポリシー' : 'Cookie Policy' }}
              </a>
            </li>
            <li>
              <a href="#" class="hover:text-white transition">
                {{ lang === 'id' ? 'Keamanan' : lang === 'jp' ? 'セキュリティ' : 'Security' }}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-white font-bold text-lg mb-4">
            {{ lang === 'id' ? 'Ikuti Kami' : lang === 'jp' ? 'フォローする' : 'Follow Us' }}
          </h3>
          <div class="flex gap-4">
            <a href="#" class="w-10 h-10 bg-teal-700 rounded-full flex items-center justify-center hover:bg-teal-600 transition">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="#" class="w-10 h-10 bg-teal-700 rounded-full flex items-center justify-center hover:bg-teal-600 transition">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 002.856-3.567a9.96 9.96 0 01-2.825.775a4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827a4.996 4.996 0 01-2.212.085a4.936 4.936 0 004.604 3.417a9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            </a>
            <a href="#" class="w-10 h-10 bg-teal-700 rounded-full flex items-center justify-center hover:bg-teal-600 transition">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M12 7a5 5 0 110 10 5 5 0 010-10z" fill="white"/><circle cx="18.5" cy="5.5" r="1.5" fill="white"/></svg>
            </a>
          </div>
        </div>
      </div>

      <div class="border-t border-teal-800 my-8"></div>

      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-sm opacity-70">
          © 2025 MarketPlace — {{ lang === 'id' ? 'Hak Cipta Dilindungi' : lang === 'jp' ? '全著作権所有' : 'All rights reserved' }}.
        </p>
        <div class="flex gap-6 text-sm">
          <a href="#" class="hover:text-white transition">
            {{ lang === 'id' ? 'Bahasa' : lang === 'jp' ? '言語' : 'Language' }}
          </a>
          <a href="#" class="hover:text-white transition">
            {{ lang === 'id' ? 'Mata Uang' : lang === 'jp' ? '通貨' : 'Currency' }}
          </a>
          <a href="#" class="hover:text-white transition">
            {{ lang === 'id' ? 'Bantuan' : lang === 'jp' ? 'ヘルプ' : 'Help' }}
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted } from "vue";

const lang = ref(localStorage.getItem("lang") || "id");

onMounted(() => {
  window.addEventListener("storage", () => {
    lang.value = localStorage.getItem("lang") || "id";
  });
});
</script>