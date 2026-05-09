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
const updateLastActive = require("./middleware/updateLastActive");

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
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search || "";

        // 🔥 FIX: ambil sorting dari query
        const allowedSort = ["name", "slug", "price", "stock", "createdAt"];

        const sortBy = allowedSort.includes(req.query.sortBy)
            ? req.query.sortBy
            : "createdAt";
        const sortOrder = req.query.sortOrder === "asc" ? "asc" : "desc";

        const skip = (page - 1) * limit;

        const where = {
            OR: [
                {
                    name: {
                        contains: search,
                    },
                },
                {
                    slug: {
                        contains: search,
                    },
                },
            ],
        };

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    category: true,
                },
                skip,
                take: limit,

                // 🔥 FIX: sorting yang benar
                orderBy: {
                    [sortBy]: sortOrder,
                },
            }),

            prisma.product.count({
                where,
            }),
        ]);


        res.json({
            data: products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(
                    total / limit
                ),
            }
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
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
app.get(
    "/orders",
    auth(["SUPERADMIN", "ORDER_ADMIN"]),

    async (req, res) => {
        try {
            const page = Number(
                req.query.page || 1
            );

            const limit = Number(
                req.query.limit || 10
            );

            const search =
                req.query.search || "";

            const status =
                req.query.status || "ALL";

            const skip =
                (page - 1) * limit;

            const where = {
                AND: [
                    search
                        ? {
                            OR: [
                                {
                                    name: {
                                        contains:
                                            search,
                                    },
                                },

                                {
                                    email: {
                                        contains:
                                            search,
                                    },
                                },

                                {
                                    phone: {
                                        contains:
                                            search,
                                    },
                                },
                            ],
                        }
                        : {},

                    status !== "ALL"
                        ? {
                            status,
                        }
                        : {},
                ],
            };

            const [
                orders,
                total,
            ] = await Promise.all([
                prisma.order.findMany({
                    where,

                    skip,

                    take: limit,

                    orderBy: {
                        createdAt:
                            "desc",
                    },

                    include: {
                        items: {
                            include: {
                                product: true,
                            },
                        },
                    },
                }),

                prisma.order.count({
                    where,
                }),
            ]);

            res.json({
                data: orders,

                pagination: {
                    total,

                    page,

                    limit,

                    totalPages:
                        Math.ceil(
                            total / limit
                        ),
                },
            });
        } catch (error) {
            res.status(500).json({
                error:
                    error.message,
            });
        }
    }
);

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

        if (!items || items.length === 0) {
            return res.status(409).json({
                error: "Keranjang kosong"
            });
        }

        const order =
            await prisma.$transaction(
                async (tx) => {

                    // cek stok
                    for (const item of items) {
                        const product =
                            await tx.product.findUnique({
                                where: {
                                    id: item.id
                                }
                            });

                        if (!product) {
                            throw {
                                status: 404,
                                message:
                                    "Produk tidak ditemukan"
                            };
                        }

                        if (
                            product.stock <
                            (item.qty || 1)
                        ) {
                            throw {
                                status: 409,
                                message: `Stok ${product.name} tidak cukup`
                            };
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
                                total:
                                    Number(total),
                                status:
                                    "PENDING",
                                items: {
                                    create:
                                        items.map(
                                            (
                                                item
                                            ) => ({
                                                productId:
                                                    item.id,
                                                quantity:
                                                    item.qty ||
                                                    1,
                                                price:
                                                    item.price,
                                                subtotal:
                                                    item.price *
                                                    (item.qty ||
                                                        1)
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
                                        item.qty ||
                                        1
                                }
                            }
                        });
                    }

                    return createdOrder;
                }
            );

        res.status(201).json(order);

    } catch (error) {
        res.status(
            error.status || 500
        ).json({
            error:
                error.message ||
                "Terjadi kesalahan server"
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

        await prisma.user.update({
            where: { id: user.id },
            data: {
                lastActive: new Date()
            }
        });

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

app.get("/auth/me", verifyToken, updateLastActive, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            },
            select: {
                id: true,
                email: true,
                role: true,
                lastActive: true
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


// analytics
app.get(
    "/analytics",
    auth(["SUPERADMIN"]),
    async (req, res) => {
        try {
            // total order
            const totalOrders =
                await prisma.order.count();

            // total revenue
            const revenueResult =
                await prisma.order.aggregate({
                    _sum: {
                        total: true
                    }
                });

            const revenue =
                revenueResult._sum
                    .total || 0;

            const rawStatusSummary =
                await prisma.order.groupBy({
                    by: ["status"],
                    _count: {
                        _all: true
                    }
                });

            // summary status
            const statusSummary =
                rawStatusSummary.map(
                    (item) => ({
                        status: item.status,
                        count:
                            item._count._all
                    })
                );

            // recent orders
            const recentOrders =
                await prisma.order.findMany({
                    orderBy: {
                        createdAt: "desc"
                    },
                    take: 5
                });

            // top products
            const topProducts =
                await prisma.orderItem.groupBy({
                    by: ["productId"],
                    _sum: {
                        quantity: true
                    },
                    orderBy: {
                        _sum: {
                            quantity: "desc"
                        }
                    },
                    take: 5
                });

            const products =
                await Promise.all(
                    topProducts.map(
                        async (item) => {
                            const product =
                                await prisma.product.findUnique(
                                    {
                                        where: {
                                            id:
                                                item.productId
                                        }
                                    }
                                );

                            return {
                                name:
                                    product?.name ||
                                    "Unknown",
                                sold:
                                    item._sum
                                        .quantity
                            };
                        }
                    )
                );

            // low stock
            const lowStock =
                await prisma.product.findMany(
                    {
                        where: {
                            stock: {
                                lte: 5
                            }
                        },
                        select: {
                            id: true,
                            name: true,
                            stock: true
                        }
                    }
                );

            // sales trend 7 hari
            const orders =
                await prisma.order.findMany({
                    where: {
                        createdAt: {
                            gte: new Date(
                                Date.now() -
                                7 *
                                24 *
                                60 *
                                60 *
                                1000
                            )
                        }
                    },
                    select: {
                        createdAt: true,
                        total: true
                    }
                });

            const salesTrendMap =
                {};

            orders.forEach((order) => {
                const date =
                    order.createdAt.toLocaleDateString(
                        "id-ID"
                    );

                salesTrendMap[
                    date
                ] =
                    (salesTrendMap[
                        date
                    ] || 0) +
                    order.total;
            });

            const salesTrend =
                Object.entries(
                    salesTrendMap
                ).map(
                    ([date, total]) => ({
                        date,
                        total
                    })
                );

            res.json({
                totalOrders,
                revenue,
                statusSummary,
                recentOrders,
                products,
                lowStock,
                salesTrend
            });
        } catch (error) {
            res.status(500).json({
                error:
                    error.message
            });
        }
    }
);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
});