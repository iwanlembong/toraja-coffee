const prisma = require("../../../../packages/database/client");

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
    } catch (err) {
        res.status(
            err.status || 500
        ).json({
            error:
                err.message ||
                "Terjadi kesalahan server"
        });
    }
};

exports.updateStatus = async (req, res) => {
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
    } catch (err) {
        res.status(500).json({ error: err.message });
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