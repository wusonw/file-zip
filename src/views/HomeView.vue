<template>
  <div class="home"></div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import {
  BlobReader,
  BlobWriter,
  TextReader,
  TextWriter,
  ZipReader,
  ZipWriter,
} from "@zip.js/zip.js";
import { saveAs } from "file-saver";
const _data = `>
  <div class="home"></div>
</>

<script lang="ts">
import { defineComponent, ref } from "vue";
import JsZip from "jszip";
import { saveAs } from "file-saver";

export default defineComponent({
  name: "HomeView",
  setup() {
    const flag = ref(false);
    if (!flag.value) {
      const zip = new JsZip();

      zip.file("Hello.txt",new Blob([]),{binary:true});

      zip.generateAsync({ type: "blob" }).then(function (content) {
        saveAs(content, );
      flag.value = true;
    }
    return { flag };
  },
});
`.repeat(10000);

export default defineComponent({
  name: "HomeView",
  setup() {
    const flag = ref(false);
    if (!flag.value) {
      const reader = new BlobReader(new Blob([_data], { type: "text/plain" }));
      const zipWritter = new ZipWriter(new BlobWriter("application/zip"), {
        password: "123",
      });
      zipWritter.add("test.txt", reader).then(() => {
        zipWritter.close().then((data) => {
          console.log(data);
          saveAs(data, `${new Date().getTime()}.zip`);
        });
      });

      flag.value = true;
    }
    return { flag };
  },
});
</script>
