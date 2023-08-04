const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const ejs = require('ejs');
const path = require('path');

const Sign = require('./Models/SignUpInModel');
const Home = require('./Models/House');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/HouseImages', express.static(__dirname + '/HouseImages'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Connect to MongoDB and load JSON data
const mongoose = require('mongoose');
const config = require('./util/config');

async function loadJsonData() {
  try {
    console.log('Loading JSON data...');
    // Clear the existing data in the 'House' collection
    await Home.deleteMany({});

    // Load your JSON data here (replace 'jsonFilePath' with the actual path to your JSON data file)
    const jsonData = require('D://HouseProjectFinal/House_Listing/houses.json');

    console.log('JSON data loaded:', jsonData);

    // Insert the JSON data into the 'House' collection
    const insertedData = await Home.insertMany(jsonData);

    console.log(`${insertedData.length} documents inserted into the 'House' collection.`);
  } catch (err) {
    console.error('Error loading JSON data into MongoDB:', err);
  }
}

loadJsonData();

// Authentication middleware
const authenticateUser = (req, res, next) => {
  const user = req.session.user;

  if (user) {
    next(); // User is authenticated, continue to the next middleware or route handler
  } else {
    res.redirect('/signin'); // User is not authenticated, redirect to the sign-in page
  }
};

app.get('/', (req, res) => {
  res.render('mainDashboard');
});

app.get('/signup', (req, res) => {
  res.render('signup'); // Render the sign-up form view
});

app.get('/signin', (req, res) => {
  res.render('signin'); // Render the sign-in form view
});

app.post('/signup', async (req, res) => {
  try {
    const { userID, username, password, email } = req.body;
    const existingUser = await Sign.findOne({ username: username.toLowerCase() });

    if (existingUser) {
      res.render('signup', { error: 'Username already exists', success: '' });
      return;
    }

    const newUser = new Sign({ userID, username, password, email });
    await newUser.save();
    res.redirect('/signin'); // Redirect to the sign-in page
  } catch (err) {
    console.error(err);
    res.status(500).send('Error registering user');
  }
});


app.post('/signin', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await Sign.findOne({ username: username.toLowerCase() });

    if (!user) {
      return res.render('userNotFound', { username: username });
    }
    if (password !== user.password) {
      return res.render('signin', { error: 'Incorrect password', username: '' });
    }
    req.session.user = user;
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
   res.status(500).send('Error signing in');
  }
});

app.get('/dashboard', authenticateUser, (req, res) => {
  const user = req.session.user;
  res.render('dashboard', { user });
});

app.get('/mainDashboard', (req, res) => {
  req.session.destroy(); // Destroy the session to logout the user
  res.redirect('/'); // Redirect to the mainDashboard page
});

// Fetch all houses from the MongoDB collection
app.get('/houses', async (req, res) => {
  try {
    const houses = await Home.find({});

    if (houses.length === 0) {
      res.render('houses', { error: 'No houses found', houses: [], currentUser: req.session.user });
      return;
    }

    res.render('houses', { houses, currentUser: req.session.user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving houses');
  }
});

app.get('/add-house', authenticateUser, (req, res) => {
  res.render('addHouse'); // Render the add-house form view
});


app.post('/add-house', authenticateUser, async (req, res) => {
  try {
    const { title, description, price, location, photos } = req.body;
    const userID = req.session.user._id;
    const newHouse = new Home({ title, description, price, location, photos, userID });
    await newHouse.save();
    res.redirect('/houses');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding house');
  }
});

app.get('/update-house/:id', authenticateUser, async (req, res) => {
  try {
    const houseID = req.params.id;
    const userID = req.session.user._id;
    const house = await Home.findOne({ _id: houseID, userID });
    if (!house) {
      res.status(404).send('House not found');
      return;
    }
    res.render('updateHouse', { house });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving house');
  }
});

app.post('/update-house/:id', authenticateUser, async (req, res) => {
  try {
    const houseID = req.params.id;
    const userID = req.session.user._id;
    const { title, description, price, location, photos } = req.body;
    const updatedHouse = await Home.findOneAndUpdate({ _id: houseID, userID }, { title, description, price, location, photos });
    if (!updatedHouse) {
      res.status(404).send('House not found');
      return;
    }

    res.redirect('/houses');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating house');
  }
});

app.get('/delete-house/:id', authenticateUser, async (req, res) => {
  try {
    const houseID = req.params.id;
    const userID = req.session.user._id;
    const house = await Home.findOne({ _id: houseID, userID });

    if (!house) {
      res.status(404).send('House not found');
      return;
    }

    res.render('deleteHouse', { house });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting house');
  }
});

app.post('/delete-house/:id', authenticateUser, async (req, res) => {
  try {
    const houseID = req.params.id;
    const userID = req.session.user._id;
    const deletedHouse = await Home.findOneAndRemove({ _id: houseID, userID });

    if (!deletedHouse) {
      res.status(404).send('House not found');
      return;
    }

    res.redirect('/houses');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting house');
  }
});

app.use((req, res, next) => {
  res.status(404).send('Page not found.');
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send('Something went wrong.');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
