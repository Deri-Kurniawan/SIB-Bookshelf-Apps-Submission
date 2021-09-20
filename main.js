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

if (localStorage.getItem(BOOK_IS_COMPLETE_KEY) === null) {
    localStorage.setItem(BOOK_IS_COMPLETE_KEY, JSON.stringify([]));
}

if (localStorage.getItem(BOOK_IS_INCOMPLETE_KEY) === null) {
    localStorage.setItem(BOOK_IS_INCOMPLETE_KEY, JSON.stringify([]));
}

function showBookList(bookListData = null, bookListViewElement = null) {
    if (bookListData != null && bookListData != 0) {
        bookListData.forEach(book => {
            bookListViewElement.innerHTML += `
        <article class="book_item">
            <h3>${book.title}</h3>
            <p>Penulis: ${book.author}</p>
            <p>Tahun: ${book.year}</p>

            <div class="action">
                <button class="green">Selesai dibaca</button>
                <button class="red">Hapus buku</button>
            </div>
        </article>
    `;
        });
    } else {
        bookListViewElement.innerHTML = `
        <article class="book_item">
            <p>Tidak ada data!</p>
        </article>
        `;
    }

    console.log(bookListData);
}

inputBookIsComplete.addEventListener('click', () => {
    if (document.querySelector('#inputBookIsComplete:checked') !== null) {
        document.querySelector('#bookSubmit > span').innerText = 'Sudah selesai dibaca';
    } else {
        document.querySelector('#bookSubmit > span').innerText = 'Belum selesai dibaca';
    }
});

showBookList(JSON.parse(localStorage.getItem(BOOK_IS_COMPLETE_KEY)), completeBookshelfList);
showBookList(JSON.parse(localStorage.getItem(BOOK_IS_INCOMPLETE_KEY)), incompleteBookshelfList);

// # Kriteria 1: Mampu Menambahkan Data Buku
inputBook.addEventListener('submit', (e) => {
    let newBook = {
        id: new Date().getTime(),
        title: inputBookTitle.value,
        author: inputBookAuthor.value,
        year: inputBookYear.value,
        isComplete: (document.querySelector('#inputBookIsComplete:checked') !== null) ? true : false,
    }

    if (newBook.isComplete == true) {
        booksComplete.push(newBook);
        localStorage.setItem(BOOK_IS_COMPLETE_KEY, JSON.stringify(booksComplete));
    } else if (newBook.isComplete == false) {
        booksInComplete.push(newBook);
        localStorage.setItem(BOOK_IS_INCOMPLETE_KEY, JSON.stringify(booksInComplete));
    }

    console.log(localStorage.getItem(BOOK_IS_COMPLETE_KEY));
    console.log(localStorage.getItem(BOOK_IS_INCOMPLETE_KEY));
});