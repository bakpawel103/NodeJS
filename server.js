const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const path = require('path');
var mysql = require('mysql');

app.use(express.json())

var connection = mysql.createConnection({
  host: 'remotemysql.com',
  user: 'N3PAtynhTt',
  password: 'SaIF9juMs5',
  database: 'N3PAtynhTt'
});

  connection.connect(function(err){
    if(!err) {
        console.log("Database is connected ...");    
    } else {
        console.log("Error connecting database ...");    
    }
  });
  

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname+'/index.html'));
})

app.get('/users', (req, res) => {
  res.json(users);
});

app.post('/users', async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = { name: req.body.name, surname: req.body.surname, login: req.body.login, password: hashedPassword }
  let query = "INSERT INTO `users` (name, surname, login, password) VALUES ('" + user.name + "', '" + user.surname + "', '" + user.login + "', '" + user.password + "')";
  connection.query(query, (err, result) => {
    if (err) {
      console.log("error " + err);
    }
  });
  res.status(201).send("Added user with login: " + user.login);
})

app.post('/users/login', async (req, res) => {
  var user = {};
  let query = "SELECT * FROM `users` WHERE login = '" + req.body.login + "'";
  connection.query(query, (err, result) => {
    if (err) {
      console.log("error " + err);
    }
    user = { name: result[0].name, surname: result[0].surname, login: result[0].login, password: result[0].password };

    if(user == null) {
      return res.status(400).send('Cannot find user');
    }
    try {
      if(bcrypt.compareSync(req.body.password, user.password)) {
          res.send(user);
      } else {
          res.status(400).send('Wrong username or password');
      }
    } catch {
      res.status(500).send();
    }
  });
})

app.listen(5000);