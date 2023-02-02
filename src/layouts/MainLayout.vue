<template>
  <div>
    <toolbar :title="leftMenuItems[currentItemMenu].title" />
    <div class="container-fluid">
      <div class="row flex-nowrap">
        <left-sidebar :items="leftMenuItems" @select-item="onSelectItemMenu" />
        <main class="col mt-3 px-4">
          <book-list-page
            v-if="currentPage === 'book-list'"
            :books="books"
            @select-book="onSelectBook"
            @remove-book="onRemoveBook"
          />
          <book-edit-page
            v-if="currentPage === 'book-edit'"
            :book="currentBook"
            :authors="authors"
            :view="modeEditor === 'view'"
            @to-edit="modeEditor = 'edit'"
            @add-book="onAddBook"
            @update-book="onUpdateBook"
          />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import Toolbar from "@/components/Toolbar.vue";
import LeftSidebar from "@/components/LeftSidebar.vue";
import { leftMenuItems } from "@/leftmenuitems";
import { onBeforeMount, ref } from "vue";
import BookListPage from "@/pages/BookListPage.vue";
import BookEditPage from "@/pages/BookEditPage.vue";
import { Author, Book } from "@/models";
import {
  addBook,
  getAuthors,
  getBook,
  getBooks,
  removeBook,
  updateBook,
} from "@/api";

onBeforeMount(async () => {
  books.value = await getBooks();
  authors.value = await getAuthors();
});

const books = ref([]);
const authors = ref([]);
const currentItemMenu = ref(0);
const showMenu = ref(true);
const currentBook = ref({});
const currentAuthor = ref({});
const currentPage = ref("book-list");
const modeEditor = ref("edit");

function onMenuToggle() {
  showMenu.value = !showMenu.value;
}

function onSelectItemMenu(idx) {
  currentItemMenu.value = idx;
  if (leftMenuItems[idx].val === "book-edit") {
    currentBook.value = new Book({});
    modeEditor.value = "edit";
  }
  if (leftMenuItems[idx].val === "author-edit") {
    currentAuthor.value = new Author({});
    modeEditor.value = "edit";
  }
  currentPage.value = leftMenuItems[idx].val;
}

async function onAddBook(book) {
  books.value = await addBook(book);
  currentPage.value = "book-list";
}

async function onUpdateBook(book) {
  books.value = await updateBook(book);
  currentPage.value = "book-list";
}

async function onRemoveBook(id) {
  console.log("onRemoveBook");
  books.value = await removeBook(id);
}

async function onSelectBook(id) {
  currentBook.value = await getBook(id);
  currentPage.value = "book-edit";
  modeEditor.value = "view";
}
</script>

<style scoped></style>