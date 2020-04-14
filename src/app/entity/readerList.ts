import { Reader } from './reader';

export interface ReaderList {
  _embedded: {
    readerList: Reader[];
    _links: {
      self: {
        href: string
      },
      readers: {
        href: string
      },
    }
  };
}
