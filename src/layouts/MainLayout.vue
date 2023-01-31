<template>
  <div>
    <toolbar :title="leftMenuItems[currentItemMenu].title" @menu-toggle="showMenu = !showMenu" />
    <div class="container-fluid">
      <div class="row flex-nowrap">
        <left-sidebar :items="leftMenuItems" :show="showMenu" @select-item="onSelectItemMenu" />
        <book-list-page class="col"  v-if="currentPage === 'book-list'" :books="props.books" @select-book="onSelectBook" />
        <book-edit-page class="col" v-if="currentPage === 'book-edit'" :book="currentBook" :view="modeEditor==='view'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import Toolbar from "@/components/Toolbar.vue";
import LeftSidebar from "@/components/LeftSidebar.vue";
import { leftMenuItems } from "@/leftmenuitems";
import { ref } from "vue";
import BookListPage from "@/pages/BookListPage.vue";
import BookEditPage from "@/pages/BookEditPage.vue";
import { getById } from "@/helper";
import { Author, Book } from "@/models";

const props = defineProps({
  books: { type: Array, default: [] },
  authors: { type: Array, default: [] }
});

const currentItemMenu = ref(0);
const showMenu = ref(true);
const currentBook = ref({});
const currentAuthor = ref({});
const currentPage = ref("book-list");
const modeEditor = ref("edit");

function onSelectItemMenu(idx) {
  currentItemMenu.value = idx;
  if (leftMenuItems[idx].val === "book-edit") {
    currentBook.value = new Book({});
  }
  if (leftMenuItems[idx].val === "author-edit") {
    currentAuthor.value = new Author({});
  }
  currentPage.value = leftMenuItems[idx].val;
}

function onSelectBook(id) {
  currentBook.value = getById(props.books, id) || new Book({});
  currentPage.value = "book-edit";
  modeEditor.value = "view";
}

</script>

<style scoped>

</style>