export class FileUpload {
  fileDownloadUri: string;
  fileName: string;
  fileType: string;
  size: number;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
