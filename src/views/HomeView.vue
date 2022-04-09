<template>
  <div class="home">
    <file-selector />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import {
} from "@zip.js/zip.js";
import FileSelector from '../components/FileSelector.vue'

export default defineComponent({
  name: "HomeView",
  components:{
    FileSelector
  }
});
</script>