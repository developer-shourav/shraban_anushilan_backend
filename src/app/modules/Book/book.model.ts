import { Schema, model } from 'mongoose';
import { BookModel, TBook } from './book.interface';

const bookSchema = new Schema<TBook, BookModel>(
  {
    bookName: {
      type: String,
      required: [true, 'Book name is required'],
      trim: true,
    },
    bookCover: {
      type: String,
      default: '',
    },
    bookSlug: {
      type: String,
      required: [true, 'Book slug is required'],
      unique: true,
      trim: true,
    },
    isOurBook: {
      type: Boolean,
      default: false,
    },
    bookFile: {
      type: String,
    },
    bookLink: {
      type: String,
    },
    writer: {
      type: String,
      trim: true,
    },
    extraInfo: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    bookLanguage: {
      type: String,
      trim: true,
    },
    firstPublishedAt: {
      type: String,
      trim: true,
    },
    lastPublishedAt: {
      type: String,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Pre-save middleware to handle isOurBook logic
bookSchema.pre('save', function (next) {
  if (this.bookFile) {
    this.isOurBook = true;
  }
  next();
});

// filter out deleted documents
bookSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

bookSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

bookSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const Book = model<TBook, BookModel>('Book', bookSchema);
