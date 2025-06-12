const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const port = 3000;

// Hardcoded admin credentials
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'password';

// Paths
const CATEGORIES_PATH = path.join(__dirname, 'data', 'product-categories.json');
const INSPIRATIONS_PATH = path.join(__dirname, 'data', 'inspirations.json');

// Multer setup for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) // Append extension
    }
});
const upload = multer({ storage: storage });

// Helper functions
const readData = (path) => JSON.parse(fs.readFileSync(path, 'utf8'));
const writeData = (path, data) => fs.writeFileSync(path, JSON.stringify(data, null, 2));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Serve static files
app.use(express.static(path.join(__dirname)));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Admin Routes
app.get('/admin', (req, res) => req.session.loggedIn ? res.redirect('/admin/dashboard') : res.sendFile(path.join(__dirname, 'admin/login.html')));
app.post('/admin/login', (req, res) => {
    if (req.body.username === ADMIN_USER && req.body.password === ADMIN_PASS) {
        req.session.loggedIn = true;
        res.redirect('/admin/dashboard');
    } else {
        res.send('Invalid username or password');
    }
});
app.get('/admin/dashboard', (req, res) => req.session.loggedIn ? res.sendFile(path.join(__dirname, 'admin/dashboard.html')) : res.redirect('/admin'));
app.get('/admin/inspirations', (req, res) => {
    if (!req.session.loggedIn) return res.redirect('/admin');
    res.sendFile(path.join(__dirname, 'admin', 'inspirations.html'));
});
app.get('/admin/categories', (req, res) => {
    if (!req.session.loggedIn) return res.redirect('/admin');
    res.sendFile(path.join(__dirname, 'admin', 'categories.html'));
});
app.get('/admin/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/admin'));
});

// API: Product Categories

// API: Product Categories (new endpoints)
app.get('/api/product-categories', (req, res) => {
    const categories = readData(CATEGORIES_PATH);
    res.json(categories);
});
app.post('/api/product-categories', (req, res) => {
    if (!req.session.loggedIn) return res.status(403).send('Unauthorized');
    const categories = readData(CATEGORIES_PATH);
    const newCategory = {
        id: Date.now(),
        title: req.body.title,
        description: req.body.description
    };
    categories.push(newCategory);
    writeData(CATEGORIES_PATH, categories);
    res.status(201).json(newCategory);
});
app.put('/api/product-categories/:id', (req, res) => {
    if (!req.session.loggedIn) return res.status(403).send('Unauthorized');
    const categories = readData(CATEGORIES_PATH);
    const categoryIndex = categories.findIndex(c => c.id == req.params.id);
    if (categoryIndex === -1) {
        return res.status(404).send('Category not found');
    }
    const updatedCategory = { ...categories[categoryIndex], ...req.body };
    categories[categoryIndex] = updatedCategory;
    writeData(CATEGORIES_PATH, categories);
    res.json(updatedCategory);
});
app.delete('/api/product-categories/:id', (req, res) => {
    if (!req.session.loggedIn) return res.status(403).send('Unauthorized');
    let categories = readData(CATEGORIES_PATH);
    const categoryIndex = categories.findIndex(c => c.id == req.params.id);
    if (categoryIndex === -1) {
        return res.status(404).send('Category not found');
    }
    categories.splice(categoryIndex, 1);
    writeData(CATEGORIES_PATH, categories);
    res.status(204).send();
});

// API: Inspirations
app.get('/api/inspirations', (req, res) => res.json(readData(INSPIRATIONS_PATH)));
app.post('/api/inspirations', upload.single('image'), (req, res) => {
    if (!req.session.loggedIn) return res.status(403).send('Unauthorized');
    const inspirations = readData(INSPIRATIONS_PATH);
    const newInspiration = {
        id: Date.now(),
        title: req.body.title,
        description: req.body.description,
        tags: req.body.tags.split(',').map(tag => tag.trim()),
        image: '/uploads/' + req.file.filename
    };
    inspirations.push(newInspiration);
    writeData(INSPIRATIONS_PATH, inspirations);
    res.status(201).json(newInspiration);
});
app.delete('/api/inspirations/:id', (req, res) => {
    if (!req.session.loggedIn) return res.status(403).send('Unauthorized');
    let inspirations = readData(INSPIRATIONS_PATH);
    const id = parseInt(req.params.id, 10);
    const inspirationToDelete = inspirations.find(insp => insp.id === id);
    if (inspirationToDelete) {
        const imagePath = path.join(__dirname, inspirationToDelete.image);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }
    inspirations = inspirations.filter(insp => insp.id !== id);
    writeData(INSPIRATIONS_PATH, inspirations);
    res.status(200).send('Inspiration deleted');
});

// Public Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
