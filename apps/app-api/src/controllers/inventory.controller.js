const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.restockProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, note } = req.body;

    const product = await prisma.product.update({
      where: {
        id: Number(id),
      },
      data: {
        stock: {
          increment: Number(quantity),
        },

        inventoryHistory: {
          create: {
            type: "IN",
            quantity: Number(quantity),
            note,
          },
        },
      },
    });

    res.json(product);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getInventoryHistory = async (req, res) => {
  try {
    const history =
      await prisma.inventoryHistory.findMany({
        include: {
          product: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    res.json(history);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};