import { Model } from 'mongoose';

export interface TBook {
  bookName: string;
  bookCover?: string;
  bookSlug: string;
  isOurBook: boolean;
  bookFile?: string;
  bookLink?: string;
  writer?: string;
  extraInfo?: string;
  isActive: boolean;
  bookLanguage?: string;
  firstPublishedAt?: string;
  lastPublishedAt?: string;
  isDeleted: boolean;
}

export type BookModel = Model<TBook>;
