const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//server static
app.use(express.static(path.join(__dirname, 'public')));

// global middlewares
app.use(helmet());

//development logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

//limit requests
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'too many requests from this IP, please try again in an hour'
});
app.use('/api', limiter);

//body parser
app.use(express.json({ limit: '10kb' }));

//data sanitisation against nosql injection
app.use(mongoSanitize());

//data sanitisation against XSS
app.use(xss());

//prevent parameter pollution
app.use(hpp({
    whitelist: [
        'duration',
        'ratingsQuantity', 
        'ratingsAverage', 
        'maxGroupSize', 
        'difficulty', 
        'price'
    ]
}));

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

app.get('/', (req, res) => {
    res.status(200).render('base', {
        tour: 'The Forest Hiker',
        user: 'Jonas'
    });
});

app.get('/overview', (req, res) => {
    res.status(200).render('overview', {
        title: 'All Tours'
    });
});

app.get('/tour', (req, res) => {
    res.status(200).render('tour', {
        title: 'The Forest Hiker Tour'
    });
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
