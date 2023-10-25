const express = require('express');
const mongoose = require('mongoose');
//view engines - UI - ejs - create a dynamic website

//set up a express server
const app = express();
const methodOverride = require('method-override')

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        req.method = req.body._method
        delete req.body._method
        return req.method
    }
}))

//schema
const Schema = new mongoose.Schema({
    title: { type: String, required: true },
    snippet: { type: String, required: true },
    body: { type: String, required: true }
});

//model - help us to assign a name to a schema
const Model = mongoose.model('Model', Schema);

// http://localhost:5000
app.get('/', async (req, res) => {
    const blogs = await Model.find(); // all the blogs saved

    res.render('index.ejs', { all_blogs: blogs });
});

// http://localhost:5000/about
app.get('/about', (req, res) => {
    res.render('about.ejs');
});

//http://localhost:5000/contact
app.get('/contact', (req, res) => {
    res.render('contact.ejs');
});

// POST /blog/create
app.post('/blog/create', async (req, res) => {
    console.log(req.body);

    const blog = await Model.create(req.body); //this will make a request to save the data into the database

    console.log(blog);

    //http;localhost:5000
    res.redirect('/');
});

app.post('/blog/delete', async(req, res) => {
    console.log(req.body.blog_id)

    await Model.findByIdAndRemove(req.body.blog_id);

    res.redirect('/')
});

app.get('/blog/edit/:id', async (req, res) => {
    console.log(req.params.id)

    const blog = await Model.findById(req.params.id);

    console.log(blog);

    res.render('edit.ejs', { blog: blog });
});

app.put('/blog/edit/:id', async (req, res) => {
    const updated_blog = await Model.findByIdAndUpdate(req.params.id, req.body);

    console.log(updated_blog);

    res.redirect('/');
});

const CONNECTION_URI = 'mongodb+srv://mongodb:mongodb@cluster0.kyxpvui.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((success) => app.listen(5000, () => console.log('Server listening on port 5000')))
    .catch((error) => console.log(error));