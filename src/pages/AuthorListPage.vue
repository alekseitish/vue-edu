<template>
    <div class="row justify-content-start">
      <author-card
        v-for="(author, index) in authors"
        :author="author"
        :key="index"
        @to-edit="toEdit"
        @remove-card="onRemove"
      />
    </div>
</template>

<script setup>
import AuthorCard from "@/components/AuthorCard.vue";
import { onBeforeMount, ref } from "vue";
import { getAuthors, removeAuthor } from "@/api";
import { useRouter } from "vue-router";

onBeforeMount(async () => {
  authors.value = await getAuthors();
})
const router = useRouter();

const authors = ref([]);

function toEdit(id) {
  router.push({name:"authorEdit", params:{id}})
}
async function onRemove(id) {
  const {authors: authorList} = await removeAuthor(id);
  authors.value = authorList;
}
</script>

<style scoped></style>