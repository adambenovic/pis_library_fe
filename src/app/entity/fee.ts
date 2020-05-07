export class Fee {
    id: number;
    amount: number;
    paid: boolean;
    valid_from: Date;
    valid_to: Date;

    constructor(values: Object = {}) {
      Object.assign(this, values);
    }
  }