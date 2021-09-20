// Add Form
let inputBook = document.getElementById('inputBook');
let inputBookTitle = document.getElementById('inputBookTitle');
let inputBookAuthor = document.getElementById('inputBookAuthor');
let inputBookYear = document.getElementById('inputBookYear');
let inputBookIsComplete = document.getElementById('inputBookIsComplete');
let bookSubmit = document.getElementById('bookSubmit');
let searchBook = document.getElementById('searchBook');
let searchBookTitle = document.getElementById('searchBookTitle');
let searchSubmit = document.getElementById('searchSubmit');
let incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
let completeBookshelfList = document.getElementById('completeBookshelfList');

const BOOK_IS_COMPLETE_KEY = 'bookIsComplete';
const BOOK_IS_INCOMPLETE_KEY = 'bookIsIncomplete';

if (typeof (Storage) === "undefined") {
    console.error("Your browser is not supported localStorage");
} else {

    let booksComplete = JSON.parse(localStorage.getItem(BOOK_IS_COMPLETE_KEY));
    let booksIncomplete = JSON.parse(localStorage.getItem(BOOK_IS_INCOMPLETE_KEY));


    if (localStorage.getItem(BOOK_IS_INCOMPLETE_KEY) === null) {
        localStorage.setItem(BOOK_IS_INCOMPLETE_KEY, JSON.stringify([]));
    }

    if (localStorage.getItem(BOOK_IS_COMPLETE_KEY) === null) {
        localStorage.setItem(BOOK_IS_COMPLETE_KEY, JSON.stringify([]));
    }

    function showBookList(bookListData = null, bookListViewElement = null, buttonActionObjectData = {
        readTitle: "",
        moveTo: "",
    }) {
        if (bookListData != null && bookListData != 0) {
            bookListData.forEach(book => {
                bookListViewElement.innerHTML += `
            <article class="book_item">
                <h3>${book.title}</h3>
                <p>Penulis: ${book.author}</p>
                <p>Tahun: ${book.year}</p>

                <div class="action">
                    <button class="action_button green" data-id="${book.id}" data-role="markAs" data-moveTo="${buttonActionObjectData.moveTo}">${buttonActionObjectData.readTitle}</button>
                    <button class="action_button red" data-id="${book.id}" data-role="delete">Hapus buku</button>
                </div>
            </article>
            `;
            });
        } else {
            bookListViewElement.innerHTML = `
        <article class="book_item">
            <p style="color:red">Tidak ada data buku!</p>
        </article>
        `;
        }
    }

    inputBookIsComplete.addEventListener('click', () => {
        if (document.querySelector('#inputBookIsComplete:checked') !== null) {
            document.querySelector('#bookSubmit > span').innerText = 'Sudah selesai dibaca';
        } else {
            document.querySelector('#bookSubmit > span').innerText = 'Belum selesai dibaca';
        }
    });

    showBookList(booksComplete, completeBookshelfList, {
        readTitle: "Tandai Belum dibaca",
        moveTo: "readIncomplete",
    });

    showBookList(booksIncomplete, incompleteBookshelfList, {
        readTitle: "Tandai Sudah dibaca",
        moveTo: "readComplete",
    });

    searchBook.addEventListener('submit', (event) => event.preventDefault());

    searchBookTitle.addEventListener('input', () => {
        let searchValue = searchBookTitle.value.toLowerCase();

        let tempComplete = booksComplete.filter((book) => book.title.toLowerCase().includes(searchValue));
        let tempIncomplete = booksIncomplete.filter((book) => book.title.toLowerCase().includes(searchValue));

        completeBookshelfList.innerHTML = '';
        showBookList(tempComplete, completeBookshelfList, {
            readTitle: "Tandai Belum dibaca",
            moveTo: "readIncomplete",
        });

        incompleteBookshelfList.innerHTML = '';
        showBookList(tempIncomplete, incompleteBookshelfList, {
            readTitle: "Tandai Belum dibaca",
            moveTo: "readIncomplete",
        });
    });

    inputBook.addEventListener('submit', () => {
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
            booksIncomplete.push(newBook);
            localStorage.setItem(BOOK_IS_INCOMPLETE_KEY, JSON.stringify(booksIncomplete));
        }
    });

    let actionsButtons = document.querySelectorAll('.action_button');

    actionsButtons.forEach((actionButton) => {
        actionButton.addEventListener('click', () => {
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

            if (dataRole == 'markAs') {
                let moveTo = actionButton.getAttribute('data-moveTo');
                if (moveTo == 'readComplete') {
                    let temp = [];

                    booksIncomplete.forEach(book => {
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

                    temp.isComplete = true;
                    booksComplete.push(temp);
                    deleteBookData(booksIncomplete, BOOK_IS_INCOMPLETE_KEY);
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

                    temp.isComplete = false;
                    booksIncomplete.push(temp);
                    deleteBookData(booksComplete, BOOK_IS_COMPLETE_KEY);
                    localStorage.setItem(BOOK_IS_INCOMPLETE_KEY, JSON.stringify(booksIncomplete));
                }

            } else if (dataRole == 'delete') {
                alert('Buku Berhasil Dihapus!');
                deleteBookData(booksComplete, BOOK_IS_COMPLETE_KEY);
                deleteBookData(booksIncomplete, BOOK_IS_INCOMPLETE_KEY)
            }

            location.reload();
        });
    });
}