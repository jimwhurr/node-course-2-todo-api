const env = process.env.NODE_ENV || 'development';
// Note: process.env.NODE_ENV will be already set in heroku (production)

if (env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://192.168.0.126:27017/TodoApp';
}
else if (env === 'test') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://192.168.0.126:27017/TodoAppTest';
}