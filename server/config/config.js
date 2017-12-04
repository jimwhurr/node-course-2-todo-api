const env = (process.env.NODE_ENV || 'development').trim();
//env = String.trim(env);
// Note: process.env.NODE_ENV will be already set in heroku (production)

console.log(`Enironment used: "${env}"`);

if ( (env === 'development') || (env === 'test') ) {
    const config = require('./config.json');

    const envConfig = config[env];
    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];
    });
}

