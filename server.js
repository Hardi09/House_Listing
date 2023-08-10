const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const ejs = require('ejs');
const path = require('path');
const multer = require('multer');
const Sign = require('./Models/SignUpInModel');
const Home = require('./Models/House');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/HouseImages', express.static(path.join(__dirname, 'HouseImages')));
app.use(express.static(path.join(__dirname, 'public'))); // Adjust 'public' to your directory
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
    const count = await Home.countDocuments();
    if (count === 0) {
      // Clear the existing data in the 'Home' collection
      await Home.deleteMany({});

      // Load your JSON data here (replace 'jsonFilePath' with the actual path to your JSON data file)
      const houseData = require('./housesData.json');
      console.log('House Data:', houseData);
      // Insert the JSON data into the 'Home' collection
      const insertedData = await Home.insertMany(houseData);
      console.log(`${insertedData.length} documents inserted into the 'Home' collection.`);
    } else {
      console.log('Data already exists in the "Home" collection. Skipping JSON data loading.');
    }
  } catch (err) {
    console.error('Error loading JSON data into MongoDB:', err);
  }
}
loadJsonData();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'HouseImages'); // Set the destination folder for uploaded images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix); // Set the filename for the uploaded image
  }
});

const upload = multer({ storage: storage });
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
    const { userID, username, password, email,contactNumber } = req.body;
    const existingUser = await Sign.findOne({ username: username.toLowerCase() });

    if (existingUser) {
      res.render('signup', { error: 'Username already exists', success: '' });
      return;
    }

    const newUser = new Sign({ userID, username, password, email,contactNumber });
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
app.get('/api/houses', async (req, res) => {
  try {
    const houses = await Home.find({});
    if (houses.length === 0) {
      return res.status(404).json({ error: 'No houses found' });
    }
    // Include owner details for each house
    const housesWithOwners = await Promise.all(houses.map(async house => {
      const owner = house.ownerData;
      if (owner) {
        return { ...house._doc, ownerData: owner };
      }
      return house;
    }));
    res.json({ houses: housesWithOwners });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error retrieving houses' });
  }

});
app.get('/houses', async (req, res) => {
  try {
    const houses = await Home.find({});
    if (houses.length === 0) {
      return res.status(404).render('houses', { houses: [], currentUser: req.session.user });
    }
    const housesWithOwners = await Promise.all(houses.map(async house => {
      const owner = house.ownerData;
      if (owner) {
        return { ...house._doc, ownerData: owner };
      }
      return house;
    }));

    // Render the houses.ejs template and pass houses and currentUser variables
    res.render('houses', { houses: housesWithOwners, currentUser: req.session.user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving houses');
  }
});

app.get('/add-house', authenticateUser, (req, res) => {
  res.render('addHouse'); // Render the add-house form view
});

app.post('/add-house', authenticateUser, upload.array('photos', 4), async (req, res) => {
  try {
    const { title, description, price, location } = req.body;
    const userID = req.session.user._id;
    const photos = req.files.map(file => `/HouseImages/${file.filename}`);

    // Fetch the user's sign-up details
    const user = await Sign.findById(userID);
    
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Create a new house object with owner's information
    const newHouse = new Home({
      title, description, price, location, photos, userID,
      owner: {
        ownerName: user.username,
        contactNumber: user.contactNumber,
        email: user.email
      }
    });

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

app.post('/update-house/:id', authenticateUser, upload.array('photos', 4), async (req, res) => {
  try {
    const houseID = req.params.id;
    const userID = req.session.user._id;
    const { title, description, price, location } = req.body;
    const photos = req.files.map(file => `/HouseImages/${file.filename}`);
    const updatedHouse = await Home.findOneAndUpdate(
      { _id: houseID, userID },
      { title, description, price, location, photos }
    );
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

app.get('/search', async (req, res) => {
  try {
    const titleQuery = req.query.title;
    const locationQuery = req.query.location; // Get the location query parameter

    // Construct the search criteria using regular expressions for both title and location
    const searchCriteria = {
      $or: [
        { title: { $regex: new RegExp(`^${titleQuery}$`, 'i') } },
        { location: { $regex: new RegExp(`^${locationQuery}$`, 'i') } }
      ]
    };

    // Use the search criteria to find matching houses
    const houses = await Home.find(searchCriteria);

    if (houses.length === 0) {
      res.render('searchResults', { error: 'No houses found', houses: [], currentUser: req.session.user });
      return;
    }

    res.render('searchResults', { houses, currentUser: req.session.user, error: null });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error searching for houses');
  }
});

// Add this route after your other routes
app.get('/owner-details/:houseTitle', async (req, res) => {
  try {
    const houseTitle = req.params.houseTitle;
    console.log('Requested house title:', houseTitle);

    // Query the database to find the house by title
    const house = await Home.findOne({ title: houseTitle });
    console.log('Found house:', house);

    if (!house) {
      console.log('House not found in database');
      return res.status(404).send('House not found');
    }

    // Check if the house has owner details
    if (!house.owner) {
      console.log('Owner details not found for the house');
      return res.status(404).send('Owner details not found');
    }

    console.log('Owner details found:', house.owner);

    // Render the owner details template with owner data
  // Render the owner details template with owner data
res.render('ownerDetails', { ownerDetails: house.owner, house: house, currentUser: req.session.user });

  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving owner details');
  }
});

app.use((req, res, next) => {
  res.status(404).render('404'); // Render a 404 view
});

app.use((req, res, next) => {
  console.log('Request received:', req.url);
  next();
});
// Error handler middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send('Something went wrong.');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
