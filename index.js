const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')

const app = express();

app.engine('hbs', exphbs({
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir  : [
        //  path to your partials
        path.join(__dirname, 'views/partials'),
    ]
}));

app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/thank-you', (req, res) => {
    res.render('thank-you');
})

app.listen(5000, () => {
    console.log('The web server has started listening on port 5000');
});

