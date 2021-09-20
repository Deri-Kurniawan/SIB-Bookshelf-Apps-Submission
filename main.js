// Add Form
let inputBook = document.getElementById('inputBook');
let inputBookTitle = document.getElementById('inputBookTitle');
let inputBookAuthor = document.getElementById('inputBookAuthor');
let inputBookYear = document.getElementById('inputBookYear');
let inputBookIsComplete = document.getElementById('inputBookIsComplete');
let bookSubmit = document.getElementById('bookSubmit');

// Search Form
let searchBook = document.getElementById('searchBook');
let searchBookTitle = document.getElementById('searchBookTitle');
let searchSubmit = document.getElementById('searchSubmit');

// View Box
let incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
let completeBookshelfList = document.getElementById('completeBookshelfList');

// Constant
const BOOK_IS_COMPLETE_KEY = 'bookIsComplete';
const BOOK_IS_INCOMPLETE_KEY = 'bookIsInComplete';

// Rak Buku Berbentuk JSON
let booksComplete = JSON.parse(localStorage.getItem(BOOK_IS_COMPLETE_KEY));
let booksInComplete = JSON.parse(localStorage.getItem(BOOK_IS_INCOMPLETE_KEY));

// # Kriteria 2: Memiliki Dua Rak Buku
// Cek apakah localstorage sudah di set '[]'
if (localStorage.getItem(BOOK_IS_INCOMPLETE_KEY) === null) {
    localStorage.setItem(BOOK_IS_INCOMPLETE_KEY, JSON.stringify([]));
}

if (localStorage.getItem(BOOK_IS_COMPLETE_KEY) === null) {
    localStorage.setItem(BOOK_IS_COMPLETE_KEY, JSON.stringify([]));
}

/**
 * Menampilkan data object ke dalam document element
 * @param {Object} bookListData data buku
 * @param {Document} bookListViewElement element html
 * @param {Object} buttonActionObjectData object button attr
 */
function showBookList(bookListData = null, bookListViewElement = null, buttonActionObjectData = {
    readTitle: "Judul Button Belum Di Set",
    moveTo: "readComplete",
}) {
    if (bookListData != null && bookListData != 0) {
        bookListData.forEach(book => {
            bookListViewElement.innerHTML += `
            <article class="book_item">
                <h3>${book.title}</h3>
                <p>Penulis: ${book.author}</p>
                <p>Tahun: ${book.year}</p>

                <div class="action">
                    <button class="action_button green" data-id="${book.id}" data-role="readComplete" data-moveTo="${buttonActionObjectData.moveTo}">${buttonActionObjectData.readTitle}</button>
                    <button class="action_button red" data-id="${book.id}" data-role="delete">Hapus buku</button>
                </div>
            </article>
            `;
        });
    } else {
        bookListViewElement.innerHTML = `
        <article class="book_item">
            <p>Tidak ada buku!</p>
        </article>
        `;
    }
}
// Ketika checkbox sudah/belum dibaca di click
inputBookIsComplete.addEventListener('click', () => {
    if (document.querySelector('#inputBookIsComplete:checked') !== null) {
        document.querySelector('#bookSubmit > span').innerText = 'Sudah selesai dibaca';
    } else {
        document.querySelector('#bookSubmit > span').innerText = 'Belum selesai dibaca';
    }
});

// Tampilkan data ke view
showBookList(booksComplete, completeBookshelfList, {
    readTitle: "Tandai Belum dibaca",
    moveTo: "readInComplete",
});
showBookList(booksInComplete, incompleteBookshelfList, {
    readTitle: "Tandai Sudah dibaca",
    moveTo: "readComplete",
});

// # Kriteria 1: Mampu Menambahkan Data Buku
inputBook.addEventListener('submit', (e) => {
    // set buku baru
    let newBook = {
        id: new Date().getTime(),
        title: inputBookTitle.value,
        author: inputBookAuthor.value,
        year: inputBookYear.value,
        isComplete: (document.querySelector('#inputBookIsComplete:checked') !== null) ? true : false,
    }

    // # Kriteria 5: Manfaatkan localStorage dalam Menyimpan Data Buku
    // cek apakah sudah dibaca atau belum
    if (newBook.isComplete == true) {
        //push kedalam buku baru ke books complete
        booksComplete.push(newBook);
        //masukan ke localStorage book is complete
        localStorage.setItem(BOOK_IS_COMPLETE_KEY, JSON.stringify(booksComplete));
    } else if (newBook.isComplete == false) {
        booksInComplete.push(newBook);
        localStorage.setItem(BOOK_IS_INCOMPLETE_KEY, JSON.stringify(booksInComplete));
    }
});

let actionsButtons = document.querySelectorAll('.action_button');

// Keluarkan semua actions butons dan buat event pada setiap element action button
actionsButtons.forEach((actionButton) => {
    actionButton.addEventListener('click', () => {

        // ambil data ID dan Role nya
        let dataBookID = actionButton.getAttribute('data-id');
        let dataRole = actionButton.getAttribute('data-role');

        const deleteBookData = (books, BOOKS_STORAGE_KEY) => {
            let temp = [];
            books.forEach(book => {
                if (book.id != dataBookID) {
                    temp.push(book);
                }
            });
            localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(temp));
        }

        // # Kriteria 3: Dapat Memindahkan Buku antar Rak
        // cek apakah itu tandai sbg di baca atau hapus
        if (dataRole == 'readComplete') {
            let moveTo = actionButton.getAttribute('data-moveTo');
            if (moveTo == 'readComplete') {
                let temp = [];
                booksInComplete.forEach(book => {
                    if (book.id == dataBookID) {
                        return temp = {
                            id: book.id,
                            title: book.title,
                            author: book.author,
                            year: book.year,
                            isComplete: book.isComplete,
                        };
                    }
                });

                booksComplete.push(temp);
                deleteBookData(booksInComplete, BOOK_IS_INCOMPLETE_KEY);
                localStorage.setItem(BOOK_IS_COMPLETE_KEY, JSON.stringify(booksComplete));

            } else {
                let temp = [];
                booksComplete.forEach(book => {
                    if (book.id == dataBookID) {
                        return temp = {
                            id: book.id,
                            title: book.title,
                            author: book.author,
                            year: book.year,
                            isComplete: book.isComplete,
                        };
                    }
                });

                booksInComplete.push(temp);
                deleteBookData(booksComplete, BOOK_IS_COMPLETE_KEY);
                localStorage.setItem(BOOK_IS_INCOMPLETE_KEY, JSON.stringify(booksInComplete));

            }
            location.reload();

        } else if (dataRole == 'delete') {
            // # Kriteria 4: Dapat Menghapus Data Buku
            // Hapus Datanya
            deleteBookData(booksComplete, BOOK_IS_COMPLETE_KEY);
            deleteBookData(booksInComplete, BOOK_IS_INCOMPLETE_KEY)
            location.reload();
        }
    });
});