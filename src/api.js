import { Author, Book } from "@/models";

let books = [];
export const loadBooks = async () => {
  const data = await fetch("https://www.googleapis.com/books/v1/volumes?q=programming&filter=paid-ebooks&printType=books");
  const { items } = await data.json();
  books = items.map((item, idx) => {
    const opts = {
      id: idx + 1,
      title: item.volumeInfo.title,
      subtitle: item.volumeInfo.subtitle,
      authors: item.volumeInfo.authors,
      description: item.volumeInfo.description,
      ISBN: item.volumeInfo.industryIdentifiers ? item.volumeInfo.industryIdentifiers[0].identifier : "",
      thumbnail: item.volumeInfo.imageLinks.thumbnail,
      categories: item.volumeInfo.categories,
      price: {
        amount: item.saleInfo.retailPrice.amount,
        currencyCode: item.saleInfo.retailPrice.currencyCode
      }
    };
    return new Book(opts);

  });
  return books;
};

export const loadAuthors = () => {
  const authors = books.reduce((acc, item, index, arr) => {
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
  return Array.from(authors.entries()).map(entry => {
    let opts = {
      fio: entry[0],
      books: entry[1].map(idx => books[idx])
    };
    const author = new Author(opts);
    for (let idx in author.books) {
      author.books[idx].authors.push(author);
    }
    return author;
  });
};