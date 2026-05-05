require("dotenv").config();
const multer = require("multer");
const path = require("path");
const express = require("express");
const cors = require("cors");
const prisma = require("../../../packages/database/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const {
    verifyToken,
    auth
} = require("./middleware/auth");

const app = express();

app.use(cookieParser());

app.use(
    cors({
        origin: ["http://localhost:3000", "http://localhost:3001"],
        credentials: true,
    })
);

app.use(express.json());

const storage = multer.diskStorage({
    destination: "./uploads",
    filename: (req, file, cb) => {
        cb(
            null,
            Date.now() + path.extname(file.originalname)
        );
    }
});

const upload = multer({ storage });

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
    res.json({
        message: "Toraja Coffee API Running"
    });
});


// PRODUCTS
app.get("/products", async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            include: {
                category: true
            }
        });

        res.json(products);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.post(
    "/products",
    auth(["SUPERADMIN", "PRODUCT_ADMIN"]),
    upload.single("image"),
    async (req, res) => {
        try {
            const {
                name,
                slug,
                description,
                price,
                stock,
                categoryId
            } = req.body;

            const product = await prisma.product.create({
                data: {
                    name,
                    slug,
                    description,
                    price: Number(price),
                    stock: Number(stock),
                    categoryId: Number(categoryId),
                    image: req.file
                        ? `/uploads/${req.file.filename}`
                        : null
                }
            });

            res.status(201).json(product);
        } catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    }
);

app.put("/products/:id", auth(["SUPERADMIN", "PRODUCT_ADMIN"]), upload.single("image"), async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            slug,
            description,
            price,
            stock
        } = req.body;

        const product = await prisma.product.update({
            where: {
                id: Number(id)
            },
            data: {
                name,
                slug,
                description,
                price: Number(price),
                stock: Number(stock),
                image: req.file
                    ? `/uploads/${req.file.filename}`
                    : undefined
            }
        });

        res.json(product);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.delete("/products/:id", auth(["SUPERADMIN", "PRODUCT_ADMIN"]), async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.product.delete({
            where: {
                id: Number(id)
            }
        });

        res.json({
            message: "Produk berhasil dihapus"
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.get("/categories", async (req, res) => {
    try {
        const categories = await prisma.category.findMany();
        res.json(categories);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// ORDERS
app.get("/orders", auth(["SUPERADMIN", "ORDER_ADMIN"]), async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });

        res.json(orders);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.post("/orders", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      city,
      address,
      notes,
      total,
      items
    } = req.body;

    const order = await prisma.$transaction(
      async (tx) => {

        // cek stok dulu
        for (const item of items) {
          const product =
            await tx.product.findUnique({
              where: {
                id: item.id
              }
            });

          if (!product) {
            throw new Error(
              `Produk tidak ditemukan`
            );
          }

          if (
            product.stock <
            (item.qty || 1)
          ) {
            throw new Error(
              `Stok ${product.name} tidak cukup`
            );
          }
        }

        // create order
        const createdOrder =
          await tx.order.create({
            data: {
              name,
              email,
              phone,
              city,
              address,
              notes,
              total: Number(total),
              status: "PENDING",
              items: {
                create: items.map(
                  (item) => ({
                    productId: item.id,
                    quantity:
                      item.qty || 1,
                    price: item.price,
                    subtotal:
                      item.price *
                      (item.quantity || 1)
                  })
                )
              }
            },
            include: {
              items: {
                include: {
                  product: true
                }
              }
            }
          });

        // reduce stock
        for (const item of items) {
          await tx.product.update({
            where: {
              id: item.id
            },
            data: {
              stock: {
                decrement:
                  item.qty || 1
              }
            }
          });
        }

        return createdOrder;
      }
    );

    res.status(201).json(order);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

app.put("/orders/:id/status", auth(["SUPERADMIN", "ORDER_ADMIN"]), async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await prisma.order.update({
            where: {
                id: Number(id)
            },
            data: {
                status
            }
        });

        res.json(order);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.delete("/orders/:id", auth(["SUPERADMIN", "ORDER_ADMIN"]), async (req, res) => {
    try {
        await prisma.order.delete({
            where: {
                id: Number(req.params.id)
            }
        });

        res.json({
            message: "Order dihapus"
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// CONTENT
app.get("/content", async (req, res) => {
    const content =
        await prisma.content.findFirst();

    res.json(content);
});


app.put("/content/:id", auth(["SUPERADMIN", "CONTENT_ADMIN"]), async (req, res) => {
    try {
        const { id } = req.params;

        const content =
            await prisma.content.update({
                where: {
                    id: Number(id)
                },
                data: req.body
            });

        res.json(content);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// LOGIN
app.post("/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({
                error: "User tidak ditemukan"
            });
        }

        const valid = await bcrypt.compare(
            password,
            user.password
        );

        if (!valid) {
            return res.status(401).json({
                error: "Password salah"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // kalau production set true
            sameSite: "lax",
            path: "/"
        });

        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// app.get("/auth/me", async (req, res) => {
//     try {
//         const token = req.cookies.token;

//         if (!token) {
//             return res.status(401).json({
//                 error: "Unauthorized"
//             });
//         }

//         const decoded = jwt.verify(
//             token,
//             process.env.JWT_SECRET
//         );

//         const user = await prisma.user.findUnique({
//             where: { id: decoded.id }
//         });

//         res.json(user);
//     } catch {
//         res.status(401).json({
//             error: "Invalid token"
//         });
//     }
// });

app.get("/auth/me", verifyToken, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            },
            select: {
                id: true,
                email: true,
                role: true
            }
        });

        res.json(user);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.post("/auth/logout", (req, res) => {
    res.clearCookie("token");

    res.json({
        success: true
    });
});

app.post("/seed-admin", async (req, res) => {
    const hashed = await bcrypt.hash("order123", 10);

    const user = await prisma.user.create({
        data: {
            name: "Order Admin",
            email: "order@torajacoffee.com",
            password: hashed,
            role: "ORDER_ADMIN"
        }
    });

    res.json(user);
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
});