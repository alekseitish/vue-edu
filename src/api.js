import { Author, Book } from "@/models";
import { getById } from "@/helper";

let books = [];
let authors = [];

export const loadBooks = async () => {
  const data = await fetch(
    "https://www.googleapis.com/books/v1/volumes?q=programming&filter=paid-ebooks&printType=books"
  );
  const { items } = await data.json();
  return items.map((item, idx) => {
    const opts = {
      id: idx + 1,
      title: item.volumeInfo.title,
      subtitle: item.volumeInfo.subtitle,
      authors: item.volumeInfo.authors,
      description: item.volumeInfo.description,
      ISBN: item.volumeInfo.industryIdentifiers
        ? item.volumeInfo.industryIdentifiers[0].identifier
        : "",
      thumbnail: item.volumeInfo.imageLinks.thumbnail,
      categories: item.volumeInfo.categories,
      price: {
        amount: item.saleInfo.retailPrice.amount,
        currencyCode: item.saleInfo.retailPrice.currencyCode,
      },
    };
    return new Book(opts);
  });
};

(function () {})();

export const loadAuthors = () => {
  const _authors = books.reduce((acc, item, index, arr) => {
    for (let idx in item.authors) {
      if (acc.has(item.authors[idx])) {
        const _books = new Set(acc.get(item.authors[idx]));
        _books.set(index);
        acc.set(item.authors[idx], Array.from(_books.values()));
      } else {
        acc.set(item.authors[idx], [index]);
      }
    }
    arr[index].authors = [];
    return acc;
  }, new Map());
  return Array.from(_authors.entries()).map(([fio, booksIdx], index) => {
    let opts = {
      id: index + 1,
      fio,
      books: booksIdx.map((idx) => books[idx].id),
    };
    const author = new Author(opts);
    for (let i in booksIdx) {
      const idx = booksIdx[i];
      books[idx].authors.push({ id: index + 1 });
    }
    return author;
  });
};

let _books = (function () {
  const loadedBooks = loadBooks();
  return new Promise((resolve) => {
    loadedBooks.then((data) => {
      books = data;
      resolve(data);
    });
  });
})();
let _authors = new Promise((resolve) => {
  _books.then(() => {
    authors = loadAuthors();
    resolve(authors);
  });
});

export const getBooks = async () => {
  return _books;
};
export const getBook = (id) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(getById(books, id)), 0);
  });
export const addBook = (_book) => {
  const book = new Book(_book);
  book.id = books.length + 1;
  books.push(book);
  return new Promise((resolve) => {
    setTimeout(() => resolve(books), 0);
  });
};
export const updateBook = (_book) => {
  const book = getById(books, _book.id);
  Object.assign(book, _book);
  return new Promise((resolve) => {
    setTimeout(() => resolve(books), 0);
  });
};
export const removeBook = (id) => {
  books = books.filter((book) => id !== book.id);
  return new Promise((resolve) => {
    setTimeout(() => resolve(books), 0);
  });
};
export const getAuthors = () => {
  return _authors;
};
export const getAuthor = (id) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(getById(authors, id)), 0);
  });
export const addAuthor = (_author) => {
  const author = new Author(_author);
  author.id = authors.length + 1;
  authors.push(author);
  return new Promise((resolve) => {
    setTimeout(() => resolve(authors), 0);
  });
};
export const updateAuthor = (_author) => {
  const author = getById(authors, _author.id);
  Object.assign(author, _author);
  return new Promise((resolve) => {
    setTimeout(() => resolve(authors), 0);
  });
};
export const removeAuthor = (id) => {
  authors = authors.filter((author) => id !== author.id);
  return new Promise((resolve) => {
    setTimeout(() => resolve(authors), 0);
  });
};
