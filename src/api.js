import { Author, Book } from "@/models";
import { getById } from "@/helper";

let books = [];
let isLoadedBooks = false;
let authors = [];
let isLoadedAuthors = false;

export const loadBooks = async () => {
  const data = await fetch(
    "https://www.googleapis.com/books/v1/volumes?q=programming&filter=paid-ebooks&printType=books"
  );
  const { items } = await data.json();
  books = items.map((item, idx) => {
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
      publishedDate: item.volumeInfo.publishedDate,
      price: {
        amount: item.saleInfo.retailPrice.amount,
        currencyCode: item.saleInfo.retailPrice.currencyCode,
      },
    };
    return new Book(opts);
  });
  isLoadedBooks = true;
  return books;
};

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
      books: booksIdx.map((idx) => ({
        id: books[idx].id,
        title: books[idx].title,
      })),
    };
    const author = new Author(opts);
    for (let i in booksIdx) {
      const idx = booksIdx[i];
      books[idx].authors.push({ id: index + 1, fio });
    }
    return author;
  });
};

let _books = (function () {
  return new Promise((resolve) => {
    loadBooks().then((data) => {
      resolve(data);
    });
  });
})();
let _authors = new Promise((resolve) => {
  _books.then(() => {
    authors = loadAuthors();
    isLoadedAuthors = true;
    resolve(authors);
  });
});

export const getBooks = async () => {
  return isLoadedBooks
    ? new Promise((resolve) => {
        setTimeout(() => resolve(books), 100);
      })
    : _books;
};
export const getBook = (id) =>
  new Promise((resolve) => {
    if (isLoadedBooks) {
      setTimeout(() => {
        resolve(getById(books, id));
      }, 100);
      return;
    }
    getBooks().then((books) => {
      resolve(getById(books, id));
    });
  });
export const
  addBook = (_book) => {
  const book = new Book(_book);
  book.id = books.length + 1;
  books.push(book);
  books = books.slice();
  return new Promise((resolve) => {
    setTimeout(() => resolve(book), 100);
  });
};
export const updateBook = (_book) => {
  const book = getById(books, _book.id);
  Object.assign(book, _book);
  return new Promise((resolve) => {
    setTimeout(() => resolve(book), 100);
  });
};
export const removeBook = (id) => {
  books = books.filter((book) => id !== book.id);
  for (let idx in authors) {
    authors[idx].books = authors[idx].books.filter((a) => a.id !== id);
  }
  authors = authors.slice();
  return new Promise((resolve) => {
    setTimeout(() => resolve({ books, authors }), 100);
  });
};
export const getAuthors = () => {
  return isLoadedAuthors
    ? new Promise((resolve) => {
        setTimeout(() => resolve(authors), 100);
      })
    : _authors;
};
export const getAuthor = (id) =>
  new Promise((resolve) => {
    if (isLoadedAuthors) {
      setTimeout(() => resolve(getById(authors, id)), 100);
      return;
    }
    getAuthors().then((authors) => {
      resolve(getById(authors, id));
    });
  });
export const addAuthor = (_author) => {
  const author = new Author(_author);
  author.id = authors.length + 1;
  authors.push(author);
  authors = authors.slice();
  return new Promise((resolve) => {
    setTimeout(() => resolve(authors), 100);
  });
};
export const updateAuthor = (_author) => {
  const author = getById(authors, _author.id);
  Object.assign(author, _author);
  return new Promise((resolve) => {
    setTimeout(() => resolve(authors), 100);
  });
};
export const removeAuthor = (id) => {
  authors = authors.filter((author) => id !== author.id);
  for (let idx in books) {
    books[idx].authors = books[idx].authors.filter((a) => a.id !== id);
  }
  books = books.slice();
  return new Promise((resolve) => {
    setTimeout(() => resolve({ books, authors }), 100);
  });
};
