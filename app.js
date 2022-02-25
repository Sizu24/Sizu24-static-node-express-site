const express = require('express');
const res = require('express/lib/response');
const data = require('./data.json');
const app = express();
const port = 3000;

app.set('view engine', 'pug');

// Static server for public folder to serve images, css, and js script file
app.use('/static', express.static('public'));

// Routes
app.get('/', (req, res)=>{
    // render index.pug and create "projects" variable with data from JSON file to use in index.pug
    res.render('index', {projects: data.properties});
    // Saves properties object from data.json file to local data scoped to the index.pug file
    res.locals = data.properties;
});

app.get('/about', (req, res)=>{
    res.render('about');
});

/**
 * Dynamic route for projects. Insert project number as Id
 * Takes number from id, and uses it as index for data
 * Assigns data to variables for interpolation of data in project.pug file
 * Pug uses the properties in the object as variables in the Pug files
 */
app.get('/project/:id', (req, res)=>{
    // params is the data coming from the ":id", and using the "id" property from JSON
    const paramData = data.properties[req.params.id];

    res.render('project', {
        projects: paramData.project,
        description: paramData.description,
        technologies: paramData.technologies,
        liveLink: paramData.live_link,
        github: paramData.github_link,
        imageLarge: paramData.image_urls[0],
        imageSmall: paramData.image_urls[1]
    });
});

// Errors

/**
 * 404 error if page isn't found
 * If code get to this point after not finding routes above, will run 404 error handler
 */
app.use((req, res, next)=>{
    const err = new Error();
    err.message = "Page wasn't found, oh no!"
    err.status = 404;
    next(err);
});

/**
 * Global error handler, 500 error, like server error
 * Error message
 * next to error handler
 */
app.use((req, res, next)=>{
    const err = new Error("Hey there's an error!");
    err.status = 500;
    next(err);
});

/**
 * Error handler shows pug error file
 * create local error property
 * set error status
 * render error pug file
 */
app.use((err, req, res, next)=>{
    res.locals.error = err;
    res.status(err.status);
    res.render('error');
});

// Port listener
app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
});