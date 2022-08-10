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
  mimeString: string | undefined = "application/rar";
  blobWritter: any;
  zipWritter: any;
  constructor(options: ZipOption | undefined = {}) {
    // 
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
    if (!this.blobWritter) return new Blob()
    const blob = new Blob(this.blobWritter.arrayBuffers, { type: this.mimeString })
    const myFile = new File([blob], `${new Date().getTime()}`, {
      type: blob.type,
    });
    return blob;
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
