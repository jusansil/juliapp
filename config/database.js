const crypto = require('crypto').randomBytes(256).toString('hex'); // Provides cryptographic functionality (OpenSSL's hash, HMAC, cipher, decipher, sign and verify functions)

// Export config object
module.exports = {
  uri: 'mongodb://msantana:0211ms11d4@ds125994.mlab.com:25994/loze', // Databse URI and database name
  secret: crypto, // Cryto-created secret
  db: 'mean-angular-2' // Database name
}
