import {
  ZipWriter,
  BlobWriter,
  ZipWriterAddDataOptions,
  BlobReader,
  ZipWriterConstructorOptions,
} from "@zip.js/zip.js";
import saveAs from "file-saver";

export interface ZipOption {
  zipOptions?: ZipWriterConstructorOptions | undefined;
  mimeString?: string | undefined;
}

export class Zip {
  zipOptions: any = {};
  mimeString: string | undefined = "application/zip";
  zipWritter:any
  constructor(options: ZipOption | undefined = {}) {
    this.zipOptions = options.zipOptions || {};
    this.mimeString = options.mimeString || this.mimeString;
    this.init();
  }

  init() {
    this.zipWritter = new ZipWriter(
      new BlobWriter(this.mimeString),
      this.zipOptions
    );
  }

  addFile(file: File, addOptions: ZipWriterAddDataOptions = {}) {
    this.zipWritter.add(
      file?.name || `default_file_${new Date().getTime()}`,
      new BlobReader(new Blob([file], { type: file?.type || "text/plain" })),
      addOptions
    );
  }

  save(
    saveOptions: {
      fileName?: string | undefined;
    } = {}
  ) {
    this.zipWritter.close().then((data: any) => {
      console.log(data);
      saveAs(data, saveOptions?.fileName || `${new Date().getTime()}.zip`);
      this.init();
    });
  }
}
