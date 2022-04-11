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
  blobWritter: any;
  zipWritter: any;
  constructor(options: ZipOption | undefined = {}) {
    // console.log(options);

    this.zipOptions = options.zipOptions || {};
    this.mimeString = options.mimeString || this.mimeString;
    this.blobWritter = new BlobWriter(this.mimeString);
    this.init();
  }

  init() {
    this.blobWritter = new BlobWriter(this.mimeString);
    this.zipWritter = new ZipWriter(this.blobWritter, this.zipOptions);
  }

  getBlobData() {
    if(!this.blobWritter) return null
    return this.blobWritter.getData();
  }

  async addFile(file: File, addOptions: ZipWriterAddDataOptions = {}) {
    await this.zipWritter.add(
      file?.name || `default_file_${new Date().getTime()}`,
      new BlobReader(new Blob([file], { type: file?.type || "text/plain" })),
      addOptions
    );
  }

  async save(
    saveOptions: {
      fileName?: string | undefined;
    } = {}
  ) {
    this.zipWritter.close().then((data: any) => {
      saveAs(data, saveOptions?.fileName || `${new Date().getTime()}.zip`);
      this.init();
    });
  }
}
