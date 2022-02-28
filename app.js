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
    // Saves properties object from data.json file to local data scoped to the index.pug file
    res.locals = data.properties;
    // render index.pug and create "projects" variable with data from JSON file to use in index.pug
    res.render('index', {projects: data.properties});

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
app.get('/project/:id', (req, res, next)=>{

    // params is the data coming from the ":id", and using the "id" property from JSON
    const paramData = data.properties[req.params.id];

    // Check to see if data exists. If so, render the project.pug file and assign all of the variables
    if(paramData){
   
        res.render('project', {
            projects: paramData.project,
            description: paramData.description,
            technologies: paramData.technologies,
            liveLink: paramData.live_link,
            github: paramData.github_link,
            imageLarge: paramData.image_urls[0],
            imageSmall: paramData.image_urls[1]
        });
    }else{
        // Run error for 404 error code
        const err = new Error();
        err.status = 404;
        err.message = "Page wasn't found, oh no!";
        console.log("Page Not Found.", `Error code: ${err.status}`);
        next(err);
    }
});

// Errors

/**
 * 404 error if page isn't found
 * If code get to this point after not finding routes above, will run 404 error handler
 */
app.use((req, res, next)=>{
    const err = new Error();
    err.message = "Page wasn't found, oh no!";
    err.status = 404;
    console.log("Page wasn't found, oh no!", `Error code: ${err.status}`);
    next(err);
});

/**
 * Global error handler, 500 error, like server error
 * Error message
 * next to error handler
 */
app.use((req, res, next)=>{
    const err = new Error();
    err.message = "Looks like something went wrong";
    err.status = 500;
    console.log("Looks like something went wrong.", `Error code: ${err.status}`);
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
    if(err.status === 404){
        res.render('page-not-found', err);
        res.status(err.status);
    }else{
        res.render('error', err);
        res.status(err.status);
    }
});

// Port listener
app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
});