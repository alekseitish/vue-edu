<template>
  <div>
    <toolbar :title="title" />
    <div class="container-fluid">
      <div class="row flex-nowrap">
        <left-sidebar
          :items="leftMenuItems"
          @select-item="onSelectItemMenu($event)"
        >
          <template v-slot:after v-if="isViewSearch">
            <h6 class="mt-3 ps-2">Поиск</h6>
            <div class="px-2">
              <input
                type="search"
                class="form-control form-control-sm mb-2"
                placeholder="название"
                :value="searchStrings.title"
                @input="changeSearch($event, 'title')"
              />
              <input
                type="search"
                class="form-control form-control-sm mb-2"
                placeholder="год публикации"
                :value="searchStrings.publishedDate"
                @change="changeSearch($event, 'publishedDate')"
                @input="onInputNumberSearch($event, 'publishedDate')"
              />
              <input
                type="search"
                class="form-control form-control-sm mb-2"
                :placeholder="categoryPlaceholder"
                :value="searchStrings.category"
                @input="changeSearch($event, 'category')"
              />
              <input
                type="search"
                class="form-control form-control-sm mb-2"
                placeholder="цена"
                :value="searchStrings.price"
                @change="changeSearch($event, 'price')"
                @input="onInputNumberSearch($event, 'price')"
              />
            </div>
          </template>
        </left-sidebar>
        <main class="col mt-3 px-4">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import Toolbar from "@/components/Toolbar.vue";
import LeftSidebar from "@/components/LeftSidebar.vue";
import { leftMenuItems } from "@/leftmenuitems";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
import { fillFromQuery } from "@/helper";

onMounted(() => {
  fillFromQuery(route.query, searchStrings);
  const item = leftMenuItems.find((item) => route.path.includes(item.path));
  title.value = item ? item.title : "Начало";
});

const categoryPlaceholder = `категория(и) через ","`;

const title = ref("");

const searchStrings = reactive({
  title: "",
  publishedDate: "",
  category: "",
  price: "",
});

const router = useRouter();
const route = useRoute();

const isViewSearch = computed(() => route.path.includes("book-list"));

//TODO: не срабатывает при первом переходе по каждому маршруту, пока кастыль!!!
async function onSelectItemMenu(item) {
  title.value = item.title;
  try {
    const err = await router.push({ name: item.name });
    if (err) {
      await router.push({ name: item.name });
    }
  } catch (e) {
    console.log("e:", e);
  }
}

function onInputNumberSearch(e, field) {
  if (e.target.value === "") {
    changeSearch(e, field);
  }
}

function changeSearch(e, field) {
  if (
    e.target.value.length > 0 &&
    ((field === "publishedDate" && isNaN(parseInt(e.target.value))) ||
      (field === "price" && isNaN(parseFloat(e.target.value))))
  ) {
    return;
  }
  searchStrings[field] = e.target.value.trim();
  const query = {};
  for (let key in searchStrings) {
    if (searchStrings[key].length > 0) {
      query[key] = searchStrings[key];
    }
  }
  router.replace({ query });
}
</script>

<style scoped></style>
