<template>
  <div
    ref="modalElement"
    class="modal fade"
    id="exampleModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Авторы</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Закрыть"
          ></button>
        </div>
        <div class="modal-body">
          <input
            type="text"
            class="form-control"
            placeholder="поиск"
            v-model="searchString"
          />
          <hr />
          <div class="list-group">
            <a href="#"
              class="list-group-item"
              v-for="(item, index) in viewItems"
              :key="index"
              @click="onSelectItem(item.id)"
            >
              {{ item.title }}
            </a>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Закрыть
          </button>
          <button type="button" class="btn btn-primary">
            Сохранить изменения
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Modal } from "bootstrap";
import { computed, onMounted, ref, watch } from "vue";

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  show: { type: Boolean, default: false },
});
const emit = defineEmits(["select-item"]);
const modalElement = ref(null);
let modal = null;

onMounted(() => {
  modal = new Modal(modalElement.value, { backdrop: true });
});

const searchString = ref("");

const viewItems = computed(() =>
  props.items.filter((item) => item.title.includes(searchString.value))
);

function onSelectItem(id) {
  modal.hide();
  emit("select-item", id);
}

watch(
  () => props.show,
  (val) => {
    if (val) {
      modal.show();
    }
  }
);
</script>

<style scoped></style>