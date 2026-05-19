const prisma = require("../../../../packages/database/client");

exports.getAnalytics = async (req, res) => {
    const { range, startDate, endDate } = req.query;

    try {
        // =========================
        // 1. DATE FILTER (FIXED PROPERLY)
        // =========================
        let dateFilter = {};

        if (range === "custom" && startDate && endDate) {
            const start = new Date(startDate);

            // IMPORTANT: set ke akhir hari (23:59:59.999)
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);

            dateFilter = {
                createdAt: {
                    gte: start,
                    lte: end,
                },
            };

        } else if (range === "30d") {
            dateFilter = {
                createdAt: {
                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                },
            };

        } else {
            // default 7 hari
            dateFilter = {
                createdAt: {
                    gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                },
            };
        }

        // =========================
        // 2. TOTAL ORDERS
        // =========================
        const totalOrders = await prisma.order.count({
            where: dateFilter,
        });

        // =========================
        // 3. REVENUE
        // =========================
        const revenueResult = await prisma.order.aggregate({
            where: dateFilter,
            _sum: { total: true },
        });

        const revenue = revenueResult._sum.total || 0;

        // =========================
        // 4. STATUS SUMMARY
        // =========================
        const rawStatusSummary = await prisma.order.groupBy({
            by: ["status"],
            where: dateFilter,
            _count: { _all: true },
        });

        const statusSummary = rawStatusSummary.map((item) => ({
            status: item.status,
            count: item._count._all,
        }));

        // =========================
        // 5. RECENT ORDERS
        // =========================
        const recentOrders = await prisma.order.findMany({
            where: dateFilter,
            orderBy: { createdAt: "desc" },
            take: 5,
        });

        // =========================
        // 6. TOP PRODUCTS (KEEP GLOBAL / or you can filter later)
        // =========================
        const topProducts = await prisma.orderItem.groupBy({
            by: ["productId"],
            _sum: { quantity: true },
            orderBy: {
                _sum: { quantity: "desc" },
            },
            take: 5,
        });

        const products = await Promise.all(
            topProducts.map(async (item) => {
                const product = await prisma.product.findUnique({
                    where: { id: item.productId },
                });

                return {
                    name: product?.name || "Unknown",
                    sold: item._sum.quantity,
                    stock: product?.stock
                };
            })
        );

        // =========================
        // 7. LOW STOCK (GLOBAL)
        // =========================
        const lowStock = await prisma.product.findMany({
            where: {
                stock: { lte: 5 },
            },
            select: {
                id: true,
                name: true,
                stock: true,
            },
        });

        // =========================
        // 8. SALES TREND (FIXED FILTER)
        // =========================
        const orders = await prisma.order.findMany({
            where: dateFilter,
            select: {
                createdAt: true,
                total: true,
            },
        });

        const salesTrendMap = {};

        orders.forEach((order) => {
            const date = order.createdAt.toLocaleDateString("id-ID");

            salesTrendMap[date] =
                (salesTrendMap[date] || 0) + order.total;
        });

        const salesTrend = Object.entries(salesTrendMap).map(
            ([date, total]) => ({
                date,
                total,
            })
        );

        // ========================= // 
        // 9. INVENTORY MOVEMENT     // 
        // ========================= //

        const inventoryLogs = await prisma.inventoryHistory.findMany(
            {
                where: dateFilter, select:
                {
                    quantity: true,
                    type: true,
                    createdAt: true,
                },
            });

        const inventoryMovementMap = {};
        inventoryLogs.forEach((log) => {
            const date = log.createdAt.toLocaleDateString("id-ID");

            if (!inventoryMovementMap[date]) {
                inventoryMovementMap[date] = { date, IN: 0, OUT: 0, };
            }

            if (log.type === "IN") {
                inventoryMovementMap[date].IN += log.quantity;
            }

            if (log.type === "OUT") {
                inventoryMovementMap[date].OUT += log.quantity;
            }
        });

        const inventoryMovement = Object.values(inventoryMovementMap);

        // =========================
        // RESPONSE
        // =========================
        res.json({
            totalOrders,
            revenue,
            statusSummary,
            recentOrders,
            products,
            lowStock,
            salesTrend,
            inventoryMovement,
        });

    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
};