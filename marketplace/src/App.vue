<template>
  <Header></Header>
  <router-view />
  <Footer></Footer>
</template>

<script setup>
import { onMounted } from "vue";
import { auth } from "./firebase"; // Pastikan path firebase benar
import { onAuthStateChanged } from "firebase/auth";
import { store } from "./store";   // Pastikan path store benar
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";

onMounted(() => {
  // Fungsi ini akan berjalan otomatis setiap kali ada yang Login atau Logout
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Jika Login: Set user di store -> Store akan otomatis load wishlist milik user tersebut
      store.setUser(user);
    } else {
      // Jika Logout: Set user null -> Store akan load wishlist milik guest/kosong
      store.setUser(null);
    }
  });
});
</script>