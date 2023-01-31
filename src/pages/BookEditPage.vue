<template>
  <form class="row g-3">
    <div class="mt-3 row">
      <div class="col-auto">
        <img :src="thumbnail" class="rounded" alt="thumbnail">
        <template v-if="!props.view">
          <h6 for="thumbnail" class="form-label mt-2">Адрес картинки</h6>
          <input type="text" class="form-control" id="thumbnail"
                 :value="book.thumbnail"
                 @input="onInput"
          >
        </template>
      </div>
      <div class="col">
        <div :class="classes.row">
          <h6 for="title" class="form-label" :class="classes.h6">Название</h6>
          <div class="col-sm-12">
            <input type="text" :class="classes.input" id="title"
                   :value="book.title"
                   @input="onInput"
            >
          </div>
        </div>
        <div :class="classes.row">
          <h6 for="authors" class="col-auto col-form-label">Автор(ы)</h6>
          <div id="authors" class="form-control-plaintext col">
            <span v-for="(author, index) in book.authors" :key="index">
              <span>{{ author.fio }}</span>
              <span v-if="index+1 < book.authors.length">, </span>
            </span>
          </div>
        </div>
        <div :class="classes.row">
          <h6 for="ISBN" class="col-auto col-form-label">ISBN</h6>
          <div class="col-auto">
            <input id="ISBN" type="text" :class="classes.input"
                   :value="book.ISBN"
                   @input="onInput"
            >
          </div>
        </div>
        <div :class="classes.row">
          <h6 for="categories" class="col-auto col-form-label">Категории</h6>
          <div class="col-auto">
            <input id="categories" type="text" :class="classes.input"
                   :value="categories" @input="onInputRange"
            >
          </div>
        </div>
        <div :class="classes.row">
          <h6 for="tags" class="col-auto col-form-label">Ключевые слова</h6>
          <div class="col-auto">
            <input id="tags" type="text" :class="classes.input"
                   :value="tags" @input="onInputRange">
          </div>
        </div>
      </div>
    </div>
    <div class="mt-3">
      <h6 for="description" class="form-label">Описание</h6>
      <p v-if="props.view" id="title" class="form-label">
        <em>{{ desc }}
          <span
            class="short-desc primary"
            v-if="book.description.length > 300"
            @click="isShortDesc=!isShortDesc"
          > &lt;&lt;{{ collapseText }}&gt;&gt;</span>
        </em>
      </p>
      <textarea
        id="description"
        class="form-control"
        v-else
        :value="book.description"
        @input="onInput"
        type="text" rows="8"></textarea>
    </div>
    <div class="col-12" v-if="!props.view">
      <button class="btn btn-primary" type="submit">Сохранить</button>
    </div>
  </form>

</template>

<script setup>

import { computed, onMounted, reactive, ref, watch } from "vue";
import { Book } from "@/models";
import { strToArr } from "@/helper";

const defaultLink = "/default-img.png";

const props = defineProps({
  book: { type: Object, default: {} },
  view: { type: Boolean, default: false }
});

const book = ref(new Book(props.book));
const isShortDesc = ref(false);

const desc = computed(() => {
  return !isShortDesc.value && book.description.length > 300
    ? book.description.slice(0, 300)
    : book.description;
});
const collapseText = computed(() => !isShortDesc.value ? "развернуть" : "свернуть");
const thumbnail = computed(() => book.thumbnail ? book.thumbnail : defaultLink);
const classes = computed(() => ({
  input: props.view ? "form-control-plaintext" : "form-control",
  row: `row ${props.view ? "" : "mb-3"}`,
  h6: props.view ? "mb-0" : ""
}));
const tags = computed(() => book.tags.join(", "));
const categories = computed(() => book.categories.join(", "));

function updateBook(name, value) {
  const val = {};
  val[name] = value;
  book.value = Object.assign({}, book, val);
}
function onInput(e) {
  updateBook(e.target.id, e.target.value);
}
function onInputRange(e) {
  updateBook(e.target.id, strToArr(e.target.value));
}

watch(() => props.book, (val) => {
  book.value = new Book(val);
})

</script>

<style lang="scss" scoped>
.short-desc {
  cursor: pointer;
  color: #15c;
  font-weight: 500;
}

</style>