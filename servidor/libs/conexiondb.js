const mysql= require('mysql');

const connection = mysql.createPool({
  connectionLimit : 10,
  host     : 'localhost',
  port     : '3306',
  user     : 'root',
  password : 'password',
  database : 'competencias',
  insecureAuth : true,
  multipleStatements: true, //para varias conexiones
});


module.exports = connection;
