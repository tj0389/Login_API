const express = require('express');
const mongoose = require('mongoose');
const path = require('path')
const bcrypt = require('bcryptjs');

mongoose.connect('lmongodb://localhost/tj', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }).then(() => {
  console.log('We are Connected')
}).catch((e) => {
  console.log(e)
})

const Schema = new mongoose.Schema({
  email: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  }
});

const user = mongoose.model('logindata', Schema);

const app = express();
const port = 80;

app.use(express.json());

//for serving static files
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// const file_path=path.join(__dirname ,'views/file.json')

var show_data =
{
  "status": "success",
  "msg": "no request found",
  "email": "",
  "password": "Encrypted...."
}

// GET method route
app.get('/', function (req, res) {
  print_data = show_data;
  res.status(200).send(print_data);
})

app.post('/fetch_password', async (req, res) => {
  // console.log(req.body);
  var { email, password } = req.body;
  let err

  if (email == undefined || password == undefined) {
    print_data = show_data;
    print_data.status = "failure",
    print_data.msg = "Error",
    res.status(500).send(print_data);
  }
  
  if (typeof err == 'undefined') {
    if (email == "" || password == "") {
      print_data = show_data;
      print_data.status = "success",
        print_data.msg = "Data Field can't be empty",
        res.status(200).send(print_data);
    }
    else {
      const data = await user.findOne({ email: email })
      if (data) {
        print_data = show_data;
        print_data.status = "success",
          print_data.msg = "Data already exist",
          // console.log(data)
          print_data.email = email
        // print_data.data.password=password
        res.status(200).send(print_data);
      }
      else {
        const salt=await bcrypt.genSalt(10);
        const hash=await bcrypt.hash(password, salt);
        let uncrypt_password = password
        password = hash;
        user({ email, password }).save();
        print_data = show_data;
        print_data.status = "success",
        print_data.msg = "Data Saved Successfully",
        print_data.email = email
        // print_data.data.password=uncrypt_password
        res.status(200).send(print_data);
      }
    }
  }
})

app.post('/fetch_login', async (req, res) => {
  // console.log(req.body);
  var { email, password } = req.body;

  const data = await user.findOne({ email: email });
  if (!data) {
    print_data = show_data;
    print_data.status = "success",
      print_data.msg = "User Doesn't exist",
      print_data.email = email
    // print_data.data.password=password
    res.status(200).send(print_data);
  }
  const match = await bcrypt.compare(password, data.password);
  if (!match) {
    print_data = show_data;
    print_data.status = "success",
      print_data.msg = "Password Don't Match",
      print_data.email = email
    // print_data.data.password=password
    res.status(200).send(print_data);
  }
  if (match) {
    print_data = show_data;
    print_data.status = "success",
      print_data.msg = "Password Match Login Successfully ",
      print_data.email = email
    // print_data.data.password=password
    res.status(200).send(print_data);
  }
})

app.post('/update_password', async (req, res) => {

  var { email, password } = req.body;

  const data = await user.findOne({ email: email })
  if (!data) {
    print_data = show_data;
    print_data.status = "success",
      print_data.msg = "Data not exist",
      print_data.email = email
    res.status(200).send(print_data);
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  data.password = hash;
  await user(data).save();
  print_data = show_data;
  print_data.status = "success",
    print_data.msg = "Data Updated Successfully",
    print_data.email = email
  res.status(200).send(print_data);
});

app.listen(port, () => {
  console.log(`serving at ${port}`);
})