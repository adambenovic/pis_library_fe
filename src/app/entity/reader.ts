import { Account } from './account';
import { MemberCard } from './memberCard';
import { Address } from './Address';

export class Reader {
  id: number;
  name: string;
  surname: string;
  date_of_birth: Date;
  personal_identification_number: string;
  type: string;
  isic_number: string;
  email: string;
  phone: string;
  photo_path: string;
  account: Account;
  verified: boolean;
  consent: boolean;
  member_card: MemberCard;
  address: Address;
  _links: {
    self: {
      href: string
    },
    readers: {
      href: string
    },
  };

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
