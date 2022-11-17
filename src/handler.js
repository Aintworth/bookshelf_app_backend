const { nanoid } = require('nanoid');
const books = require('./books');

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
            response.status(500);
            return response;
        }
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.status(400);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.status(500);
    return response;
    
}

module.exports = { addBookHandler };