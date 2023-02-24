<template>
  <book-card
    v-for="(book, index) in booksFiltered"
    :book="book"
    :key="index"
    @select-card="onSelectBook"
    @remove-card="$emit('remove-book', $event)"
  />
</template>

<script setup>
import BookCard from "@/components/BookCard.vue";
import { computed, onBeforeMount, onMounted, reactive, ref } from "vue";
import { getBooks } from "@/api";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
import { fillFromQuery, strToArr } from "@/helper";

const emit = defineEmits(["select-book", "remove-book"]);

onBeforeMount(async () => {
  books.value = await getBooks();
});
onMounted(() => {
  fillFromQuery(route.query, searchStrings);
});
onBeforeRouteUpdate((to, _) => {
  fillFromQuery(to.query, searchStrings);
});

const books = ref([]);
const route = useRoute();
const router = useRouter();

const searchStrings = reactive({
  title: "",
  publishedDate: "",
  category: "",
  price: "",
});

const booksFiltered = computed(() => {
  return books.value.filter(
    (book) =>
      titleFilter(book) &&
      publishedDateFilter(book) &&
      categoryFilter(book) &&
      priceFilter(book)
  );
});

const titleFilter = (book) =>
  book.title.toUpperCase().includes(searchStrings.title.toUpperCase());
const publishedDateFilter = (book) =>
  searchStrings.publishedDate.length === 0 ||
  new Date(book.publishedDate).getFullYear() == searchStrings.publishedDate;
const categoryFilter = (book) => {
  if (searchStrings.category.length === 0) return true;
  const searchCategories = strToArr(searchStrings.category);
  return searchCategories.every((searchCtg) =>
    book.categories.some((ctg) => ctg.toUpperCase().includes(searchCtg.toUpperCase()))
  );
};
const priceFilter = (book) =>
  searchStrings.price.length === 0 || book.price.amount == searchStrings.price;

function onSelectBook(id) {
  router.push({
    name: "bookEdit",
    params: { id },
    query: { view: null },
  });
}
</script>

<style scoped></style>
