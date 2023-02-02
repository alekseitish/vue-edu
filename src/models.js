export class Book {
  constructor(opts) {
    this.id = opts.id || "";
    this.title = opts.title || "";
    this.subtitle = opts.subtitle || "";
    this.authors = opts.authors ? [...opts.authors] : [];
    this.description = opts.description || "";
    this.ISBN = opts.ISBN || "";
    this.thumbnail = opts.thumbnail || "";
    this.categories = opts.categories ? [...opts.categories] : [];
    this.tags = opts.tags ? [...opts.tags] : [];
    this.price = {};
    this.price.amount = opts.price ? opts.price.amount : undefined;
    this.price.currencyCode = opts.price ? opts.price.currencyCode : undefined;
  }
}

export class Author {
  constructor(opts) {
    this.id = opts.id || "";
    this.fio = opts.fio || "";
    this.birthday = opts.birthday || "";
    this.sex = opts.sex || "";
    this.residence = opts.residence || "";
    this.books = opts.books || [];
  }
}