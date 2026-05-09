const prisma = require("../../../../packages/database/client");

exports.getProducts = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search || "";

        const allowedSort = ["name", "slug", "price", "stock", "createdAt"];

        const sortBy = allowedSort.includes(req.query.sortBy)
            ? req.query.sortBy
            : "createdAt";

        const sortOrder =
            req.query.sortOrder === "asc" ? "asc" : "desc";

        const skip = (page - 1) * limit;

        const where = {
            OR: [
                { name: { contains: search } },
                { slug: { contains: search } },
            ],
        };

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: { category: true },
                skip,
                take: limit,
                orderBy: {
                    [sortBy]: sortOrder,
                },
            }),

            prisma.product.count({ where }),
        ]);

        res.json({
            data: products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const {
            name,
            slug,
            description,
            price,
            stock,
            categoryId,
        } = req.body;

        const product =
            await prisma.product.create({
                data: {
                    name,
                    slug,
                    description,

                    price: Number(price),
                    stock: Number(stock),

                    categoryId:
                        categoryId
                            ? Number(categoryId)
                            : null,

                    image: req.file
                        ? `/uploads/${req.file.filename}`
                        : null,
                },
            });

        res.status(201).json(product);
    } catch (err) {
        console.error(
            "CREATE PRODUCT ERROR:",
            err
        );

        res.status(500).json({
            error: err.message,
        });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const existingProduct =
            await prisma.product.findUnique({
                where: {
                    id: Number(id),
                },
            });

        if (!existingProduct) {
            return res.status(404).json({
                message:
                    "Product tidak ditemukan",
            });
        }

        const {
            name,
            slug,
            description,
            price,
            stock,
            categoryId,
        } = req.body;

        const product =
            await prisma.product.update({
                where: {
                    id: Number(id),
                },
                data: {
                    name,
                    slug,
                    description,
                    price: Number(price),
                    stock: Number(stock),

                    categoryId:
                        categoryId
                            ? Number(categoryId)
                            : existingProduct.categoryId,

                    image: req.file
                        ? `/uploads/${req.file.filename}`
                        : existingProduct.image,
                },
            });

        res.json(product);
    } catch (err) {
        console.error(
            "UPDATE PRODUCT ERROR:",
            err
        );

        res.status(500).json({
            error: err.message,
        });
    }
};

exports.getProductBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        console.log(slug, "isi slug>>>>>")

        const product = await prisma.product.findFirst({
            where: {
                slug: slug, // ✅ lebih simple & aman
            },
            include: {
                category: true,
            },
        });

        if (!product) {
            return res.status(404).json({
                message: "Product tidak ditemukan",
            });
        }

        res.json(product);
    } catch (error) {
        console.error("PRISMA ERROR:", error);
        res.status(500).json({
            error: error.message,
        });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await prisma.product.delete({
            where: { id: Number(req.params.id) },
        });

        res.json({ message: "Produk berhasil dihapus" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};