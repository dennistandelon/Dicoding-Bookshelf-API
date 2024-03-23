const books = require('./book');
const {nanoid} = require('nanoid');

const addBookHandler = (request, h)=>{
  const body = request.payload;

  const newId = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const finished = (body.pageCount !== body.readPage)? false:true;

  if (body.name == null || body.name === '') {
    return h.response({
      'status': 'fail',
      'message': 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
  }

  if (body.readPage > body.pageCount) {
    return h.response({
      'status': 'fail',
      'message': 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  newBook = {
    id: newId,
    name: body.name,
    year: body.year,
    author: body.author,
    summary: body.summary,
    publisher: body.publisher,
    pageCount: body.pageCount,
    readPage: body.readPage,
    finished: finished,
    reading: body.reading,
    insertedAt: insertedAt,
    updatedAt: updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === newId).length > 0;

  if (isSuccess) {
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: newId,
      },
    }).code(201);
  }
};

const getAllBookHandler = (request, h) => {
  const {name, reading, finished} = request.query;

  let bookDatas = books;

  if (name != null) {
    const nameFilter = new RegExp(name, 'i');
    bookDatas = bookDatas.filter((book) => nameFilter.test(book.name) == true);
  }

  if (reading != null) {
    const read = (reading == 0) ? false : true;
    bookDatas = bookDatas.filter((book) => book.reading == read);
  }

  if (finished != null) {
    const finish = (finished == 0) ? false : true;
    bookDatas = bookDatas.filter((book) => book.finished == finish);
  }

  bookDatas = bookDatas.map((book)=>{
    return {
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    };
  });

  return h.response({
    status: 'success',
    data: {
      books: bookDatas,
    },
  }).code(200);
};

const getBookByIdHandler = (request, h) => {
  const {bookId} = request.params;

  const index = books.findIndex((book) => book.id === bookId);
  const isSuccess = index !== -1;

  if (isSuccess) {
    return h.response({
      status: 'success',
      data: {
        book: books[index],
      },
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  }).code(404);
};

const updateBookByIdHandler = (request, h) => {
  const {bookId} = request.params;

  const body = request.payload;
  const updatedAt = new Date().toISOString();

  if (body.name == null || body.name === '') {
    return h.response({
      'status': 'fail',
      'message': 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);
  }

  if (body.readPage > body.pageCount) {
    return h.response({
      'status': 'fail',
      'message': 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const index = books.findIndex((book) => book.id === bookId);
  const isSuccess = index !== -1;

  if (!isSuccess) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    }).code(404);
  }

  const finished = (body.pageCount !== body.readPage)? false:true;

  books[index] = {
    ...books[index],
    ...body,
    finished,
    updatedAt,
  };

  return h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  }).code(200);
};

const deleteBookByIdHandler = (request, h) => {
  const {bookId} = request.params;

  const index = books.findIndex((book) => book.id === bookId);
  const isSuccess = index !== -1;

  if (!isSuccess) {
    return h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    }).code(404);
  }

  books.splice(index, 1);

  return h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  }).code(200);
};

module.exports = {addBookHandler, getAllBookHandler, getBookByIdHandler, updateBookByIdHandler, deleteBookByIdHandler};
