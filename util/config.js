// config.js
const uri = 'mongodb+srv://hardimajmundar0906:Hardi@cluster0.odsmusw.mongodb.net/humberdb';


const config = {
  db: {
    uri: uri,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  //  redis: {
    //  host: process.env.REDIS_HOST,
      //port: process.env.REDIS_PORT,
      //password: process.env.REDIS_PASSWORD,
    //},
  },
  session: {
    secret: process.env.SESSION_SECRET,
  },
};

module.exports = config;
