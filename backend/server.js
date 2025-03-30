const express = require('express');
const path = require('path');
const PORT = 3000;
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// this is my temp DB:
let books = [
  {
    id: 1,
    image:
      'https://whitmorerarebooks.cdn.bibliopolis.com/pictures/6162.jpg?auto=webp&v=1713807429',
    name: 'Harry Potter',
    category: 'fiction',
  },

  {
    id: 2,
    image:
      'https://cdn.prod.website-files.com/60852ab67650bc0c3908e894/612b6f58e8f93d627a935ef5_feature%20Letters%20From%20a%20Stoic.jpg',
    name: 'Letters from a Stoic',
    category: 'philosophy',
  },
];

// GET - show all books from my DB!
app.get('/api/books', (req, res) => {
  res.json(books);
});

// GET - show 1 book data based on ID:
app.get('/api/books/:id', (req, res) => {
  const bookId = req.params.id;
  const bookData = books.find((book) => book.id === Number(bookId));

  if (!bookData) {
    res.status(404).json({ error: 'No book found with such ID' });
    return;
  }

  res.json(bookData);
});

// POST
app.post('/api/books', (req, res) => {
  // take data from frontend:
  const { name, category } = req.body;

  if (!name || !category) {
    return res.status(400).json({ error: 'data is missing!' });
  }

  // create new object, where new data will be stored:
  const newBook = {
    id: books.length + 1,
    name: name,
    category: category,
  };

  // add this new data:
  books.push(newBook);
  res.status(201).json({ message: 'success' });
});

// PUT
app.put('/api/books/:id', (req, res) => {
  const bookId = req.params.id;
  const { image, name, category } = req.body;

  if (!image && !name && !category) {
    return res.status(400).json({ error: 'Data is missing!' });
  }

  const bookData = books.find((book) => book.id === Number(bookId));

  if (!bookData) {
    return res.status(404).json({ error: 'Book does not exist!' });
  }

  bookData.image = image || bookData.image;
  bookData.name = name || bookData.name;
  bookData.category = category || bookData.category;

  res.json({ message: 'Book is updated!' });
});

// DELETE - WHY IT DOES NOT WORK??
app.delete('/api/books/:id', (req, res) => {
  const bookId = Number(req.params.id);
  const initialLength = books.length;

  books = books.filter((book) => book.id !== bookId);

  if (books.length === initialLength) {
    return res.status(404).json({ error: 'Book is not found' });
  }

  res.json({ message: 'Book is deleted' });
});

app.listen(PORT, () => {
  console.log(`Server is on: http://localhost:${PORT}`);
});
