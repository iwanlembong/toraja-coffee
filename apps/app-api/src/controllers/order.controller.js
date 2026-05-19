const prisma = require("../../../../packages/database/client");
const sendOrderConfirmation = require("../utils/sendEmail");

exports.getOrders = async (req, res) => {
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
};

exports.createOrder = async (req, res) => {
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

        if (!items?.length) {
            return res.status(409).json({
                error: "Keranjang kosong"
            });
        }

        const order = await prisma.$transaction(async (tx) => {

            // 1. CREATE ORDER DULU (PENDING)
            const createdOrder = await tx.order.create({
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
                        create: items.map(item => ({
                            productId: item.id,
                            quantity: item.qty || 1,
                            price: item.price,
                            subtotal: item.price * (item.qty || 1)
                        }))
                    }
                },
                include: {
                    items: true
                }
            });

            // 2. REDUCE STOCK + INVENTORY LOG (ATOMIC)
            for (const item of items) {

                const updated = await tx.product.updateMany({
                    where: {
                        id: item.id,
                        stock: {
                            gte: item.qty || 1
                        }
                    },
                    data: {
                        stock: {
                            decrement: item.qty || 1
                        }
                    }
                });

                if (updated.count === 0) {
                    throw {
                        status: 409,
                        message: `Stok produk tidak cukup`
                    };
                }

                // 3. INVENTORY HISTORY
                await tx.inventoryHistory.create({
                    data: {
                        productId: item.id,
                        orderId: createdOrder.id,
                        type: "OUT", // keluar barang
                        quantity: item.qty || 1,
                        note: "Order created"
                    }
                });
            }

            return createdOrder;
        });

        // KIRIM EMAIL SETELAH TRANSACTION BERHASIL
        await sendOrderConfirmation(email, order);

        res.status(201).json(order);

    } catch (err) {
        res.status(err.status || 500).json({
            error: err.message || "Terjadi kesalahan server"
        });
    }
};
exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const result = await prisma.$transaction(async (tx) => {

            const order = await tx.order.findUnique({
                where: { id: Number(id) },
                include: { items: true }
            });

            if (!order) {
                throw {
                    status: 404,
                    message: "Order tidak ditemukan"
                };
            }

            const updatedOrder = await tx.order.update({
                where: { id: Number(id) },
                data: { status }
            });

            // 🔥 kalau CANCEL → RESTOCK
            if (status === "CANCELLED") {
                for (const item of order.items) {

                    await tx.product.update({
                        where: { id: item.productId },
                        data: {
                            stock: {
                                increment: item.quantity
                            }
                        }
                    });

                    await tx.inventoryHistory.create({
                        data: {
                            productId: item.productId,
                            orderId: order.id,
                            type: "IN", // balik masuk stok
                            quantity: item.quantity,
                            note: "Order cancelled - restock"
                        }
                    });
                }
            }

            // optional: log status change
            await tx.inventoryHistory.create({
                data: {
                    orderId: order.id,
                    type: "SYSTEM",
                    quantity: 0,
                    note: `Status changed to ${status}`
                }
            });

            return updatedOrder;
        });

        res.json(result);

    } catch (err) {
        res.status(err.status || 500).json({
            error: err.message || "Terjadi kesalahan server"
        });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        await prisma.order.delete({
            where: {
                id: Number(req.params.id)
            }
        });

        res.json({
            message: "Order dihapus"
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};