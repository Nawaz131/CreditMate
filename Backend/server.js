const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

const mainRouter = require("./routes/main.router");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(express.json());

app.use(
    cors({
        origin: "https://creditmate-frontend.onrender.com",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
    })
);

//Route
app.use("/api", mainRouter);

app.get("/", (req, res) => {
  res.send("CreditMate Backend is Running!");
});

//MongoDB connection
mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("MongoDb connected");

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    }).catch((error) => {
        console.log("Unable to connect to MongoDB:", error.message);
    })