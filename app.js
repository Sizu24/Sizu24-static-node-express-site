const express = require('express');
const data = require('./data.json');
const app = express();
const port = 3000;

app.set('view engine', 'pug');
app.use(express.static('public'));

// Routes
app.get('/', (req, res)=>{
    res.render('index');
    // Saves properties object from data.json file to local data scoped to the index.pug file
    res.locals = data.properties;
});

app.get('/about', (req, res)=>{
    res.render('about');
});

/**
 * Dynamic route for projects. Insert project number as Id
 * Takes number from id, and uses it as index for data
 * Assigns data to variable for interpolation of data in project.pug file
 */
app.get('/project/:id', (req, res)=>{
    const paramData = data.properties[req.params.id];

    res.render('project', {
        projects: paramData.project,
        description: paramData.description,
        technologies: paramData.technologies
    });
});

// Middleware
app.use((req, res, next) =>{
    next();
});

// Errors
app.use((err, req, res, next)=>{
    res.locals.error = err;
    const error = new Error('Sorry, couldn\t find the page you\'re looking for');
    next(err);
})

// Port listener
app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
});