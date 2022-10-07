const books = [];
const RENDER_EVENT = 'render-bookkk';
const SAVED_EVENT = 'saved-bookkk';
const STORAGE_KEY = 'Books-Apps'

function isStorageExist(){
    if (typeof(Storage) === undefined) {
        alert('Browser tidak support local storage');
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function(){
    console.log(localStorage.getItem(STORAGE_KEY));
})

document.addEventListener('DOMContentLoaded', function(){
    const submitForm = document.getElementById('form-input');
    submitForm.addEventListener('submit', function(event){
        event.preventDefault();
        if (document.getElementById('title-book').value === '' || document.getElementById('author-book').value === '' || document.getElementById('date-book').value === '') {
            alert('Semua field harus diisi!');
        } else {
            alert('Buku berhasil ditambahkan!');
            addBook();
        }
    })

    const searchBtn = document.getElementById('searchSubmit');
    searchBtn.addEventListener('click', function(event){
        isLoading = false;
        const searchText = document.getElementById('searchBookTitle').value;
        event.preventDefault();
        // const image = document.getElementById('image-load')
       
        this.innerHTML = '<div class="redirect-load"></div>';
        setTimeout(function() { 
            // image.style.display = 'none';
            const btn = document.querySelector('.redirect-load');
            btn.setAttribute('style', 'display: none');
            search(searchText.toLowerCase());
        }, 2000, image())
    })
    
    if (isStorageExist()) {
        loadDataFromStorage();
    }
})

function image(){
    const searchBtn = document.getElementById('searchSubmit');
    const image = document.createElement('img');
    image.setAttribute('src', 'assets/img/submit.png');
    image.setAttribute('style', 'width: 20px');
    searchBtn.append(image);
}


function renderSearchResult(searchResult) {
    const booksContainer = document.getElementById('books-container');
    booksContainer.innerHTML = '';
    for (const book of searchResult) {
        booksContainer.append(makeBook(book));
    }
}

function addBook() {
    const textBook = document.getElementById('title-book').value;
    const author = document.getElementById('author-book').value;
    const year = document.getElementById('date-book').value;
    const check = document.getElementById('check-book').checked;

    const generatedID = generateId();

    const bookObject = generateBookObject(generatedID, textBook, author, year, check);
    books.push(bookObject);


    // alert('Buku berhasil ditambahkan!');
    document.dispatchEvent(new Event(RENDER_EVENT));

    saveBook()
}

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

document.addEventListener(RENDER_EVENT, function(){
    console.log(books);
    const uncompletedBookList = document.getElementById('incompleteBookshelfList')
    uncompletedBookList.innerHTML = ''

    const completedBookList = document.getElementById('completeBookshelfList')
    completedBookList.innerHTML = ''

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isCompleted) {
            uncompletedBookList.append(bookElement);
        } else {
            completedBookList.append(bookElement);
        }
    }
})

function makeBook(bookObject) {
    // Element
    const bookTitle = document.createElement('p')
    bookTitle.innerText = bookObject.title;
    bookTitle.classList.add('book-title');

    const bookAuthor = document.createElement('p')
    bookAuthor.innerText = bookObject.author;
    bookAuthor.classList.add('book-author');

    const bookYear = document.createElement('p')
    bookYear.innerText = bookObject.year;
    bookYear.classList.add('book-year');
    
    // Pembungkus
    const bookContainer = document.createElement('div');
    bookContainer.classList.add('book-container');
    bookContainer.append(bookTitle, bookAuthor, bookYear);

    const container = document.createElement('div');
    container.classList.add('books-container');
    container.append(bookContainer);
    container.setAttribute('id', `book-${bookObject.id}`);

    if (bookObject.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.innerText = 'Unfinished';
        undoButton.classList.add('button-container');

        undoButton.addEventListener('click', function(){
            undoBookFromCompleted(bookObject.id);
        })

        const trashButton = document.createElement('button');
        trashButton.innerText = 'Delete';
        trashButton.classList.add('button-container');

        trashButton.addEventListener('click', function(){
            const alert = confirm('Apakah anda yakin ingin menghapus buku ini?');
            if (alert) {
                removeBookFromCompleted(bookObject.id);
            }
        })

        container.append(undoButton, trashButton);
    } else {
        const checkButton = document.createElement('button');
        checkButton.innerText = 'Finished';
        checkButton.classList.add('button-container');

        checkButton.addEventListener('click', function(){
            addBookToCompleted(bookObject.id);
        })

        const trashButton = document.createElement('button');
        trashButton.innerText = 'Delete';
        trashButton.classList.add('button-container');


        trashButton.addEventListener('click', function(){
            const alert = confirm('Apakah anda yakin ingin menghapus buku ini?');
            if (alert) {
                removeBookFromCompleted(bookObject.id);
            }
        })
        container.append(checkButton);
        container.append(trashButton);
    }
    

    return container;
}

function addBookToCompleted (bookId){
    const bookTarget = findBook(bookId);

    if (bookTarget == null) {
        return;
    }

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBook()
}

function findBook(bookid) {
    for (const book of books) {
        if (book.id == bookid) {
            return book;
        }
    }
    return null;
}

function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId)

    if(bookTarget === -1) return

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBook()
}

function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);
    
    if (bookTarget == null) return

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBook()
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id == bookId) {
            return index;
        }
    }
    return -1;
}

function saveBook() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(RENDER_EVENT));
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data != null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function search(keyword) {
    const bookComponents = document.querySelectorAll('.books-container');
    for (const bookComponent of bookComponents) {
        const title = bookComponent.childNodes[0]
        if (!title.innerText.toLowerCase().includes(keyword)) {
            title.parentElement.style.display = 'none';
        } else {
            title.parentElement.style.display = '';
        }
    }
}