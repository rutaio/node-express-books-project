const api = 'http://localhost:3000/api/books';
const allBooksButton = document.getElementById('get-books-btn');
const addNewBook = document.getElementById('add-book-btn');

// GET - all books:
// when a button is clicked, data from API should come:
allBooksButton.addEventListener('click', async () => {
  try {
    const response = await fetch(api);
    // give data in json format:
    const data = await response.json();
    // when data from API arrives, I call the function to display the books!
    displayBooks(data);
  } catch (error) {
    console.error(error);
  }
});

// GET - show a single book by ID:
async function singleBookClick(id) {
  const response = await fetch(`${api}/${id}`);
  const book = await response.json();

  if (book.error) {
    alert(book.error);
    return;
  }

  // ??? HOW TO SEND PEOPLE SOMEWHERE AFTER A CLICK???
  console.log(book);

  // is this function needed here?
  // or perhaps instead it should open a card with content of that book?
  displayBooks([book]);
}

// POST - add a new book to a list of all books:
addNewBook.addEventListener('click', async () => {
  const image = document.getElementById('new-book-image').value;
  const name = document.getElementById('new-book-name').value;
  const category = document.getElementById('new-book-category').value;

  try {
    const response = await fetch(api, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image,
        name,
        category,
      }),
    });

    if (!response.ok) {
      throw new Error('Adding a book did not work!');
    }
  } catch (error) {
    console.error('Error in adding a book');
    alert('Error in adding a book!');
  }

  console.log(response);
});

// PATCH - edit a book based on ID:
// NOT FINISHED ...
async function editSingleBook(id, name, category) {
  const newName = prompt('New book name:', name);
  const newCategory = prompt('New book category:', category);

  if (newName || newCategory) {
    try {
      const response = await fetch(`${apiUrl}/${id}`, {
        method: 'PATCH', 
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({
          name: name,
          category: category,
        }),
      });
    }
  }
}

// DELETE - WHY error is caught?
async function deleteSingleBook(id) {
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'DELETE',
    });

    // reload and show the latest books:
    // does this work?
    await response.json();
    displayBooks(books);

    if (!response.ok) {
      throw new Error('Deleting this book did not work!');
    }
  } catch (error) {
    console.error('Error in deleting a single book...');
    alert('Error in deleting a single book...');
  }
}

// this function shows books data as cards in html:
function displayBooks(books) {
  const booksContainer = document.getElementById('books-container');
  // turn on a loop, which creates a card for every book:
  // forEach is a method of Array:
  books.forEach((book) => {
    const bookCard = document.createElement('div');
    bookCard.classList.add('book-card');
    bookCard.innerHTML = `
      <p>${book.id}</p>
      <img src="${book.image}" alt="Book cover" width="100">
      <h3>${book.name}</h3>
      <h6>${book.category}</h6>
      <button id="single-book-btn" onclick="singleBookClick(${book.id})">Open This Book</button>
      <button id="single-book-btn" onclick="editSingleBook(${book.id})">Edit</button>
      <button id="delete-single-book-btn" onclick="deleteSingleBook(${book.id})">Delete</button>
      `;
    booksContainer.appendChild(bookCard);
  });
}
