<template>
  <div
    ref="modalElement"
    class="modal fade"
    data-bs-backdrop="static"
    tabindex="-1"
    aria-labelledby="modalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header align-items-center">
          <h1 class="modal-title fs-5 col-auto" id="modalLabel">Добавить автора</h1>
            <input
              type="search"
              class="form-control form-control-sm border-primary mx-4"
              placeholder="поиск"
              v-model="searchString"
            />
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Закрыть"
          ></button>
        </div>
        <div class="modal-body">
          <div class="list-group">
            <a
              href="#"
              class="list-group-item border-0"
              v-for="(item, index) in viewItems"
              :key="index"
              @click="onSelectItem(item)"
            >
              {{ item.title }}
            </a>
          </div>
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
const emit = defineEmits(["select-item", "hide"]);
const modalElement = ref(null);
let modal = null;

onMounted(() => {
  modal = new Modal(modalElement.value, { backdrop: true });
  modalElement.value.addEventListener("hide.bs.modal", onHideModal)
});

const searchString = ref("");

const viewItems = computed(() =>
  props.items.filter((item) => item.title.toUpperCase().includes(searchString.value.toUpperCase()))
);

function onSelectItem(id) {
  modal.hide();
  emit("select-item", id);
}

function onHideModal() {
  searchString.value = "";
  emit("hide");
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