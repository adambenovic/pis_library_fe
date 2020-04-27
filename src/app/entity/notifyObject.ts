export class NotifyObject {
  message: string;
  subject: string;
  contact: string;
  valid: boolean;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
