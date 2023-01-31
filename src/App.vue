
<template>
  <main-layout :books="books" :authors="authors" />
</template>
<script setup>
import MainLayout from "@/layouts/MainLayout.vue";
import { onBeforeMount, ref } from "vue";
import { loadAuthors, loadBooks } from "@/api";
const books = ref([]);
const authors = ref([]);
onBeforeMount(() => {
  loadBooks().then(data => {
    books.value = data;
    authors.value = loadAuthors();
  });
})
</script>
<style>
body {
  font-size: .9rem !important;
}

</style>