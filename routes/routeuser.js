const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const verifyToken = require("../middleware/verify");
const bcrypt = require("bcrypt");
const Org = require("../model/org");

const stripe = require('stripe')("sk_test_51NtOJqA7EOLFqNcIgdh0F9LzzS80PeItdHdQp5LEaEwXDQk3z4TLHt8Tax5dizhBDofKZ12b5ovG22vbpJ521XYJ00Im70Ns3X");

// Registration Endpoint
app.post("/register", async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    const existingUser = await User.findOne({ phoneNumber });

    if (existingUser) {
      return res.json({ message: "El teléfono ya se encuentra registrado" });
    }

    let hashed_password = bcrypt.hashSync(password, 10);

    const newUser = new User({
      phoneNumber: phoneNumber,
      password: hashed_password,
    });
    await newUser.save();

    res.status(201).json({ message: "Registro exitoso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    // Revisamos si el usuario existe.
    const user = await User.findOne({ phoneNumber });

    // Revisamos si el usuario no existe y si la contraseña no es la misma
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // Generamos el token
    const token = jwt.sign(
      { phoneNumber: user.phoneNumber, userId: user._id },
      "your-secret-key",
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ token: token, isAdmin: user.isAdmin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error" });
  }
});


app.post('/process-payment', async (req, res) => {
  try {
    const { cardNumber, expiration, cvc } = req.body;
    console.log('CardNum: ${cardNumber} Exp: ${expiration} CVC: ${cvc}')

    // Create a payment intent using the Stripe API
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // Change to your desired amount in cents (e.g., $10)
      currency: 'usd', // Change to your desired currency
      payment_method_types: ['card'],
      payment_method_data: {
        card: {
          number: cardNumber,
          exp_month: expiration.split('/')[0],
          exp_year: expiration.split('/')[1],
          cvc,
        },
        type: 'card',
      },
    });

    // Confirm the payment intent
    await stripe.paymentIntents.confirm(paymentIntent.id);

    // Payment successful
    res.status(200).json({ success: true });
  } catch (error) {
    // Payment failed
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/add-favorite/:organizationId", verifyToken, async (req, res) => {
  try {
    const organizationId = req.params.organizationId;
    const userId = req.user.userId;

    // Verificamos si existe la organizacion

    const user = await User.findById(userId);
    const organization = await Org.findById(organizationId);

    console.log(user);
    console.log(organization);

    if (!user || !organization) {
      return res
        .status(404)
        .json({ message: "User or organization not found" });
    }

    if (!user.favoriteOrganizations.includes(organizationId)) {
      user.favoriteOrganizations.push(organizationId);
      await user.save();
      res.status(200).json({ message: "Organization added to favorites" });
    } else {
      res.status(400).json({ message: "Organization already in favorites" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});


app.post("/hasFav/:organizationId", verifyToken, async (req, res) => {
  try {
    const organizationId = req.params.organizationId;
    const userId = req.user.userId;

    
    // Verificamos si existe la organizacion

    const user = await User.findById(userId);
    const organization = await Org.findById(organizationId);

    console.log(" - ");

    console.log(user);
    console.log(organization);

    if (!user || !organization) {
      return res
        .status(404)
        .json({ message: "User or organization not found" });
    }

    if (user.favoriteOrganizations.includes(organizationId)) {
      res.status(200).json({ message: true });
    } else {
      res.status(200).json({ message: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete(
  "/remove-favorite/:organizationId",
  verifyToken,
  async (req, res) => {
    try {
      const organizationId = req.params.organizationId;
      const userId = req.user.userId;

      const user = await User.findById(userId);
      const organization = await Org.findById(organizationId);

      if (!user || !organization) {
        return res
          .status(404)
          .json({ message: "User or organization not found" });
      }

      // Remove the organization from the user's favorites if it's present
      const index = user.favoriteOrganizations.indexOf(organizationId);
      if (index !== -1) {
        user.favoriteOrganizations.splice(index, 1);
        await user.save();
        res
          .status(200)
          .json({ message: "Organization removed from favorites" });
      } else {
        res.status(400).json({ message: "Organization not in favorites" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

app.get("/getUserFavoriteOrganizations", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);

    console.log(user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Retrieve the organization records for the user's favorite organization IDs
    const favoriteOrganizations = await Org.find({
      _id: { $in: user.favoriteOrganizations },
    });

    return res.status(200).json(favoriteOrganizations);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});



app.get("/protected", verifyToken, (req, res) => {
  res.status(200).json({ message: "Acceso permitido" });
});

module.exports = app;
