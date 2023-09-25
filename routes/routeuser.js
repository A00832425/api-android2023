const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const verifyToken = require("../middleware/verify");
const bcrypt = require("bcrypt");

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
      { phoneNumber: user.phoneNumber },
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
          type: 'card',
        },
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




app.get("/protected", verifyToken, (req, res) => {
  res.status(200).json({ message: "Acceso permitido" });
});

module.exports = app;
