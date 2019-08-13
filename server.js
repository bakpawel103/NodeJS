const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const path = require('path');

app.use(express.json())

const users = []

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname+'/index.html'));
})

app.get('/users', (req, res) => {
  res.json(users);
});

app.post('/users', async (req, res) => {
  try {
    if(users.find(user => user.login == req.body.login) != null) {
      return res.status(409).send('User already exist');
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = { name: req.body.name, surname: req.body.surname, login: req.body.login, password: hashedPassword }
    users.push(user);
    res.status(201).send("Added user with login: " + user.login);
  } catch {
    req.status(500).send();
  }
})

app.post('/users/login', async (req, res) => {
  const user = users.find(user => user.login == req.body.login);
  if(user == null) {
    return res.status(400).send('Cannot find user');
  }
  try {
    if(await bcrypt.compare(req.body.password, user.password)) {
        res.send(user);
    } else {
        res.status(400).send('Wrong username or password');
    }
  } catch {
    res.status(500).send();
  }
})

app.listen(2500);