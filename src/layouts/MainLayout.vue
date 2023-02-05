<template>
  <div>
    <toolbar :title="leftMenuItems[currentItemMenu].title" />
    <div class="container-fluid">
      <div class="row flex-nowrap">
        <left-sidebar :items="leftMenuItems" @select-item="onSelectItemMenu">
          <template v-slot:after v-if="currentPage === 'book-list'">
            <h6 class="mt-3 ps-2">Поиск</h6>
            <div class="px-2">
              <input
                type="search"
                class="form-control form-control-sm mb-2"
                placeholder="название"
                v-model.trim="searchStringByTitle"
              />
              <input
                type="search"
                class="form-control form-control-sm mb-2"
                placeholder="год публикации"
                v-model.lazy.trim="searchStringByPublishedDate"
              />
              <input
                type="search"
                class="form-control form-control-sm mb-2"
                placeholder="категория"
                v-model.trim="searchStringByCategory"
              />
              <input
                type="search"
                class="form-control form-control-sm mb-2"
                placeholder="цена"
                v-model.lazy.trim="searchStringByPrice"
              />
            </div>
          </template>
        </left-sidebar>
        <main class="col mt-3 px-4">
          <book-list-page
            v-if="currentPage === 'book-list'"
            :books="booksFiltered"
            @select-book="onSelectBook"
            @remove-book="onRemoveBook"
          />
          <book-edit-page
            v-if="currentPage === 'book-edit'"
            :book="currentBook"
            :authors="authors"
            :view="modeEditor === 'view'"
            @to-edit="modeEditor = 'edit'"
            @to-view="modeEditor = 'view'"
            @update-book="onUpdateBook"
            @remove-book="onRemoveBook"
          />
          <author-list-page
            v-if="currentPage === 'author-list'"
            :authors="authors"
            @to-edit="onAuthorEdit"
            @remove-author="onRemoveBook"
          />
          <author-edit-page
            v-if="currentPage === 'author-edit'"
            :author="currentAuthor"
            :books="books"
            @to-list="currentPage = 'author-list'"
            @update-author="onUpdateAuthor"
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
import { computed, nextTick, onBeforeMount, ref } from "vue";
import BookListPage from "@/pages/BookListPage.vue";
import BookEditPage from "@/pages/BookEditPage.vue";
import { Author, Book } from "@/models";
import AuthorListPage from "@/pages/AuthorListPage.vue";
import {
  addAuthor,
  addBook,
  getAuthors,
  getBook,
  getBooks,
  removeBook, updateAuthor,
  updateBook
} from "@/api";
import AuthorEditPage from "@/pages/AuthorEditPage.vue";

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

const searchStringByTitle = ref("");
const searchStringByPublishedDate = ref("");
const searchStringByCategory = ref("");
const searchStringByPrice = ref("");

const booksFiltered = computed(() => {
  return books.value.filter((book) => {
    return (
      book.title
        .toUpperCase()
        .includes(searchStringByTitle.value.toUpperCase()) &&
      (searchStringByPublishedDate.value.length === 0 ||
        new Date(book.publishedDate).getFullYear() ===
          searchStringByPublishedDate.value) &&
      (searchStringByCategory.value.length === 0 ||
        book.categories.some((ctg) =>
          ctg.toUpperCase().includes(searchStringByCategory.value.toUpperCase())
        )) &&
      (searchStringByPrice.value.length === 0 ||
        book.price.amount == searchStringByPrice.value)
    );
  });
});

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
  }
  currentPage.value = leftMenuItems[idx].val;
}

async function onUpdateBook(book) {
  if (book.id) {
    books.value = await updateBook(book);
  } else {
    books.value = await addBook(book);
  }
  currentPage.value = "book-list";
}

async function onRemoveBook(id) {
  const { books: newBook, authors: newAuthors } = await removeBook(id);
  currentBook.value = {};
  books.value = newBook;
  authors.value = newAuthors;
  currentPage.value = "book-list";
}

function onSelectBook(id) {
  currentBook.value = books.value.find((b) => b.id === id);
  currentPage.value = "book-edit";
  modeEditor.value = "view";
}

function onAuthorEdit(id) {
  currentAuthor.value = authors.value.find((a) => a.id === id);
  currentPage.value = "author-edit";
}
async function onUpdateAuthor(author) {
  if (author.id) {
    author.value = await updateAuthor(author);
  } else {
    author.value = await addAuthor(author);
  }

  currentPage.value = "author-list";
}
</script>

<style scoped></style>
