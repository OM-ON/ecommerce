const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const User = require("./model/user");
const session = require("express-session");

let app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(session({
  secret: "d1c6d69f948ff1f1a92117322a53d196a76a2b3e7b1c86f2a1c4919a74ab3299",
  resave: false,
  saveUninitialized: false,
}));


mongoose.connect("mongodb://localhost:27017/cartDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const CartItemSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  name: String,
  price: Number,
  image: String,
  quantity: Number,
});
const CartItem = mongoose.model("CartItem", CartItemSchema);


const OrderSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  fullName: String,
  email: String,
  address: String,
  items: [CartItemSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", OrderSchema);


// Define Wishlist Schema and Model here
const wishlistSchema = new mongoose.Schema({
  userId: String,
  productId: String,
  name: String,
  image: String,
  price: String
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);





// Route to add to wishlist
app.post('/wishlist/add', async (req, res) => {
  const {  productId, name, image, price } = req.body;
  const userId = req.session.userId;

  const exists = await Wishlist.findOne({ userId, productId });
  if (exists) {
    return res.json({ success: false, message: 'Already in wishlist' });
  }

  const item = new Wishlist({ userId, productId, name, image, price });
  await item.save();

  res.json({ success: true, message: 'Added to wishlist' });
});

app.get('/wishlist/list', async (req, res) => {
  const userId = req.session.userId;
  const items = await Wishlist.find({ userId });
  res.json(items);
});

// Route to remove from wishlist
app.post('/wishlist/remove', async (req, res) => {
  const { productId } = req.body;
  const userId = req.session.userId;

  await Wishlist.deleteOne({ userId, productId });

  res.json({ success: true, message: 'Removed from wishlist' });
});


//clear wishlist user id wise
app.post('/wishlist/clear', async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    await Wishlist.deleteMany({ userId });

    res.json({ success: true, message: 'Wishlist cleared' });
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    res.status(500).json({ success: false, message: 'Server error while clearing wishlist' });
  }
});

// ✅ Connect to MongoDB (Fixed)


// ✅ Define Cart Schema
// const CartItemSchema = new mongoose.Schema({
//   name: String,
//   price: Number,
//   quantity: Number,
// });
// const CartItem = mongoose.model("CartItem", CartItemSchema);

// ✅ Add item to cart
app.post("/add-to-cart", async (req, res) => {
  const { name, price, quantity, image } = req.body;
  const userId = req.session.userId;

  if (!userId) {
    return res.redirect("/login");
  }

  try {
    // Check if the item already exists in the user's cart
    let existingItem = await CartItem.findOne({ userId, name });

    if (existingItem) {
      // Update quantity if item exists
      existingItem.quantity += quantity;
      await existingItem.save();
      res.json({ message: "Item quantity updated", item: existingItem });
    } else {
      // Create new item if not found
      const newItem = await CartItem.create({ userId, name, price, quantity, image });
      res.json({ message: "Item added", item: newItem });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ Session & Authentication Setup
app.use(require("express-session")({
  secret: "Rusty is a dog",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ✅ Serve Static Files (CSS, Images, etc.)
app.use(express.static(path.join(__dirname, "views")));

// =====================
// ROUTES (Serve HTML Pages)
// =====================
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "views", "home.html")));
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "views", "login.html")));
app.get("/register", (req, res) => res.sendFile(path.join(__dirname, "views", "register.html")));
//app.get("/fix", isLoggedIn, (req, res) => res.sendFile(path.join(__dirname, "views", "fix.html")));

// ✅ User Registration
app.post("/register", async (req, res) => {
  const user = await User.create({
    username: req.body.username,
    password: req.body.password,
  });
  return res.status(200).json(user);
});



// Dummy products
const products = [
  {
    "id": 1,
    "name": "Goggles",
    "price": 2999,
    "originalPrice":"3999",
    "images": ["img/product/of1.jpg", "img/product/of2.jpg", "img/product/of3.jpg"],
    "rating": 4.3,
    "reviews": 30
  },
  {
    "id": 2,
    "name": "Bracelet",
    "price": 4999,
    "originalPrice":"6000",
    "images": ["img/product/hbrac2.jpg", "img/product/vbrac2.jpg", "img/product/mbrac2.jpg"],
    "rating": 4.2,
    "reviews": 43
  },
  {
    "id": 3,
    "name": "Sunglass thinx",
    "price": 4000,
    "originalPrice":"7000",
    "images": ["img/product/s1.jpg", "img/product/s2.jpg", "img/product/s3.jpg"],
    "rating": 4.1,
    "reviews": 38
  },
  {
    "id": 4,
    "name": "Necklace",
    "price": 4999,
    "originalPrice":"6399",
    "images": ["img/product/2hnc.jpg", "img/product/2vnc.jpg", "img/product/2mnc.jpg"],
    "rating": 4.8,
    "reviews": 27
  },
  {
    "id": 5,
    "name": "Chain Bracelet",
    "price":2999,
    "originalPrice":"3399",
    "images": ["img/product/cb1.jpeg", "img/product/cb2.jpeg", "img/product/cb3.jpeg"],
    "rating": 4.3,
    "reviews": 22
  },
  {
    "id": 6,
    "name": "Neckchain",
    "price": 2999,
    "originalPrice":"3999",
    "images": ["img/product/chain nec1.jpeg", "img/product/chian nec2.jpeg", "img/product/chain nec3.jpeg"],
    "rating": 4.3,
    "reviews": 34
  },
  {
    "id": 7,
    "name": " Gold Ring",
    "price": 2999,
    "originalPrice":"3999",
    "images": ["img/product/gz1.jpeg", "img/product/gz2.jpeg", "img/product/gz3.jpeg"],
    "rating": 4.3,
    "reviews": 18
  },
  {
    "id": 8,
    "name": "Golden Bracelet",
    "price":  2999,
    "originalPrice":"3999",
    "images": ["img/product/gb1.jpeg", "img/product/gb2.jpeg", "img/product/gb3.jpeg"],
    "rating": 4.3,
    "reviews": 29
  },
  {
    "id": 9,
    "name": "Ring",
    "price": 2999,
    "originalPrice":"3999",
    "images": ["img/product/hring.jpg", "img/product/vring.jpg", "img/product/mring.jpg"],
    "rating": 4.3,
    "reviews": 40
  },
  {
    "id": 10,
    "name": "Ear Ring",
    "price": 2999,
    "originalPrice":"3999",
    "images": ["img/product/earhring1.jpg", "img/product/earvring1.jpg", "img/product/earmring1.jpg"],
    "rating": 4.3,
    "reviews": 32
  },
  {
    "id": 11,
    "name": "Handbag Brown",
    "price": 2999,
    "originalPrice":"4399",
    "images": ["img/product/hg2.jpg"],
    "rating": 4.4,
    "reviews": 21
  },
  {
    "id": 12,
    "name": "Handbag Black",
    "price": 2999,
    "originalPrice":"4399",
    "images": ["img/product/hg3.webp"],
    "rating": 4.4,
    "reviews": 25
  },
  {
    "id": 13,
    "name": "Handbag Greycraft",
    "price":  2999,
    "originalPrice":" 4399",
    "images": ["img/product/hg4.webp"],
    "rating": 4.4,
    "reviews": 20
  },
  {
    "id": 14,
    "name": "Handbag",
    "price": 2999,
    "originalPrice":"4399",
    "images": ["img/product/hg5.webp"],
    "rating": 4.4,
    "reviews": 35
  },
  
  {
    "id": 16,
    "name": "Sunglass Epic",
    "price": 2999,
    "originalPrice":"3999",
    "images": ["img/product/sg1.jpg", "img/product/sg2.jpg", "img/product/sg3.jpg"],
    "rating": 4.3,
    "reviews": 28
  },
  {
    "id": 17,
    "name": "Glasses",
    "price": 2999,
    "originalPrice":"3999",
    "images": ["img/product/sg1.jpg", "img/product/sg2.jpg", "img/product/sg3.jpg"],
    "rating": 4.3,
    "reviews": 30
  },
  {
    "id": 18,
    "name": "ENVY",
    "price": 2999,
    "originalPrice":"4399",
    "images": ["img/product/en1.jpeg"],
    "rating": 4.4,
    "reviews": 50
  },
  {
    "id": 19,
    "name": "Denver",
    "price": 2999,
    "originalPrice":"4399",
    "images": ["img/product/dn1.jpeg"],
    "rating": 4.4,
    "reviews": 45
  },
  {
    "id": 20,
    "name": "Wild Stone",
    "price": 2999,
    "originalPrice":"4399",
    "images": ["img/product/ws1.jpeg"],
    "rating": 4.4,
    "reviews": 60
  },
  {
    "id": 21,
    "name": "Fogg",
    "price": 2999,
    "originalPrice":"4399",
    "images": ["img/product/fg1.jpeg"],
    "rating": 4.4,
    "reviews": 55
  }
];
// Serve search page
app.get("/search-page", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "search.html"));
 
});

// Search API
app.get("/search", (req, res) => {
  const query = req.query.q ? req.query.q.toLowerCase() : "";
  const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(query)
  );

  res.json(filteredProducts);
});


// ✅ User Login
app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      const result = req.body.password === user.password;
      if (result) {
        req.session.userId = user._id; // Store user ID in session
        res.redirect("/home"); // Redirect to /fix
      } else {
        res.status(400).json({ error: "Password doesn't match" });
      }
    } else {
      res.status(400).json({ error: "User doesn't exist" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/home", async(req, res) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  res.sendFile(path.join(__dirname, "views", "fix.html"));
});

app.get("/jewellery", async(req, res) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  res.sendFile(path.join(__dirname, "views", "nav.html"));
});

app.get("/handbags", async(req, res) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  res.sendFile(path.join(__dirname, "views", "handbag.html"));
});


app.get("/sunglasses", async(req, res) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  res.sendFile(path.join(__dirname, "views", "sunglasses.html"));
});

app.get("/perfumes", async(req, res) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  res.sendFile(path.join(__dirname, "views", "perfume.html"));
});


// Logout route
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Could not log out" });
    }
    res.redirect("/"); // Redirect to homepage or login page after logout
  });
});

app.get("/checkout", async(req, res) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  res.sendFile(path.join(__dirname, "views", "checkout.html"));
});


app.get("/order-confirmation", async(req, res) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  res.sendFile(path.join(__dirname, "views", "order-con.html"));
});
// ✅ Middleware: Check if Logged In
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}
app.get("/get-cart", async (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }

  try {
    const cart = await CartItem.find({ userId: req.session.userId });
    res.json({ cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch("/update-cart-item", async (req, res) => {
  const { name, quantity } = req.body;
  const userId = req.session.userId;

  if (!userId) return res.redirect("/login");

  try {
    const item = await CartItem.findOne({ userId, name });

    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity = quantity;
    await item.save();
    res.json({ message: "Item updated", item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/remove-cart-item", async (req, res) => {
  const { name } = req.body;
  const userId = req.session.userId;

  if (!userId) return res.redirect("/login");

  try {
    await CartItem.deleteOne({ userId, name });
    res.json({ message: "Item removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// ✅ User Logout
app.get("/logout", (req, res) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect("/");
  });
});
app.post("/checkout", async (req, res) => {
  const userId = req.session.userId;

  if (!userId) return res.redirect("/login");

  try {
    const { fullName, email, address } = req.body;
    const cartItems = await CartItem.find({ userId });

    if (!cartItems.length) {
      return res.status(400).json({ message: "Cart is empty!" });
    }

    const newOrder = new Order({
      userId,
      fullName,
      email,
      address,
      items: cartItems,
    });

    await newOrder.save();
    await CartItem.deleteMany({ userId }); // clear cart after order

    res.json({ message: "✅ Order placed successfully!" , order_id: newOrder._id});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong." });
  }
});

app.get("/order/:id", async (req, res) => {
  const orderId = req.params.id;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Calculate total from items if needed (example assumes each item has a `price` and `quantity`)
    const total = order.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    res.json({
      order_id: order._id,
      name: order.fullName,
      email: order.email,
      items: order.items.map(i => `${i.name} x${i.quantity}`).join(", "),
      total
    });
  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Start Server (Fixed)
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));
