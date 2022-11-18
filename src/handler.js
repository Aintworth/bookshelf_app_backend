const { nanoid } = require('nanoid');
const books = require('./books');

const booleanize = (number)=>{
    if(number == 1){
        return true;
    }
    return false;
}

const addBookHandler = (request, h)=>{
    const { name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;
    if(name !== undefined){
        if (pageCount>=readPage){
            const newBook = {
                id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
            }
            books.push(newBook);

            const isSuccess = books.filter((book)=>book.id === id).length > 0;
            if(isSuccess){
                const response = h.response({
                    status: 'success',
                    message: 'Buku berhasil ditambahkan',
                    data: {
                        bookId: id,
                    }
                });
                response.code(201);
                return response;
            }
            const response = h.response({
                status: 'error',
                message: 'Buku gagal ditambahkan',
            });
            response.code(500);
            return response;
        }
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
    
}

const getAllBooksHandler = (request)=>{
    const { reading, finished, name } = request.query;
    if (reading === undefined && finished === undefined && name === undefined){
        const booksToSend = books.map((book)=>{
            return{
                id: book.id,
                name: book.name,
                publisher: book.publisher
            }
        });
        return {
            status: 'success',
            data: {
                books: booksToSend,
            }
        };
    }
    let filteredBooks = books;
    if(reading !== undefined){
        const bReading = booleanize(reading);
        filteredBooks = filteredBooks.filter((book)=>book.reading === bReading);
    }

    if(finished !== undefined){
        const bFinished = booleanize(finished);
        filteredBooks = filteredBooks.filter((book)=>book.finished === bFinished);
    }

    if(name !== undefined){
        filteredBooks = filteredBooks.filter((book)=>book.name.toLowerCase().includes(name.toLowerCase()));
    }

    const booksToSend = filteredBooks.map((book)=>{
        return{
            id: book.id,
            name: book.name,
            publisher: book.publisher
        }
    });
    return{
        status: 'success',
        data: {
            books: booksToSend,
        }
    };
} 

const getBookDetailHandler = (request, h)=>{
    const { bookId } = request.params;
    const filteredBook = books.filter((book)=>book.id === bookId)[0];

    if(filteredBook){
        return{
            status: 'success',
            data: {
                book: filteredBook,
            },
        }
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan'
    });
    response.code(404);
    return response;
}

const editBookHandler = (request, h)=>{
    const { name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
    const { bookId } = request.params;
    const finished = pageCount === readPage;
    const updatedAt = new Date().toISOString();
    const bookIndex = books.findIndex((book)=>book.id===bookId);

    if(bookIndex !== -1){
        if(name !== undefined){
            if(pageCount>=readPage){
                books[bookIndex]={
                    ...books[bookIndex],
                    name,
                    year,
                    author,
                    summary,
                    publisher,
                    pageCount,
                    readPage,
                    reading,
                    finished,
                    updatedAt,
                }
                return{
                    status: 'success',
                    message: 'Buku berhasil diperbarui'
                };
            }
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
            });
            response.code(400)
            return response;
        }
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400)
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404)
    return response;


}

const deleteBookHandler = (request, h)=>{
    const { bookId } = request.params;
    const bookIndex = books.findIndex((book)=>book.id===bookId);

    if(bookIndex !== -1){
        books.splice(bookIndex, 1);
        return {
            status: 'success',
            message: 'Buku berhasil dihapus'
        }
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
    });
    response.code(404);
    return response;
}

module.exports = { addBookHandler, getAllBooksHandler, getBookDetailHandler, editBookHandler, deleteBookHandler };