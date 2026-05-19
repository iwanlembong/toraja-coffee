const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

const categoryRoutes = require("./routes/category.routes");
const inventoryRoutes = require("./routes/inventory.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes.js");
const authRoutes = require("./routes/auth.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const contentRoutes = require("./routes/content.routes");

const app = express();

app.use(cookieParser());

app.use(
    cors({
        origin: ["http://localhost:3000", "http://localhost:3001"],
        credentials: true,
    })
);

app.use(express.json());

// routes
// 🔥 STATIC FILES (INI TEMPATNYA)
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);
app.use("/categories", categoryRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/auth", authRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/content", contentRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Toraja Coffee API Running" });
});

module.exports = app;