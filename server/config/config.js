const env = (process.env.NODE_ENV || 'development').trim();
//env = String.trim(env);
// Note: process.env.NODE_ENV will be already set in heroku (production)

console.log(`Enironment used: "${env}"`);

if (env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://192.168.0.126:27017/TodoApp';
}
else if (env === 'test') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://192.168.0.126:27017/TodoAppTest';
}
else {
    // db on mlab, production code for heroku
    process.env.MONGODB_URI = 'mongodb://todoer:nodeman01@ds127506.mlab.com:27506/todoapp';    
}
