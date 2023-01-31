<template>
  <div class="col-auto px-0">
    <div id="sidebar" class="collapse collapse-horizontal" :class="show">
      <div id="sidebar-nav" class="list-group border-0 rounded-0 text-sm-start">
        <a
          v-for="(item, index) in props.items" :key="item.val"
          @click="$emit('select-item', index)"
          class="list-group-item border-end-0 border-top-0 d-inline-block text-truncate"
          data-bs-parent="#sidebar"
          href="#"
        >
          <span>{{ item.title }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  items: {type: Array, required: true},
  show: {type: Boolean, default: true}
})

const show = computed(() => props.show ? "show" : "")


</script>

<style lang="scss" scoped>
@import "@/assets/variables.scss";
  #sidebar-nav {
    width: $left-menu-width;
    min-height: calc(100% - $toolbar-height) !important;
  }

</style>