const fs = require('fs');

if (fs.existsSync('./public')) {
  process.env.NODE_ENV = 'production';
  process.env.databaseUri = 'mongodb://msantana:0211ms11d4@ds125994.mlab.com:25994/loze'; // Databse URI and database name
  process.env.databaseName = 'production database: loze'; // Database name
} else {
  process.env.NODE_ENV = 'development';
  process.env.databaseUri = 'mongodb://msantana:0211ms11d4@ds125994.mlab.com:25994/loze'; // Databse URI and database name
  process.env.databaseName = 'development database:loze'; // Database name
}
