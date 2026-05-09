const prisma = require("../../../../packages/database/client");

// GET ALL
exports.getCategories = async (req, res) => {
  const categories =
    await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

  res.json(categories);
};

// CREATE
exports.createCategory = async (req, res) => {
    try {
        const category =
            await prisma.category.create({
                data: {
                    name: req.body.name,
                },
            });

        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
};

// UPDATE
exports.updateCategory = async (req, res) => {
  const category =
    await prisma.category.update({
      where: {
        id: Number(req.params.id),
      },
      data: req.body,
    });

  res.json(category);
};

// DELETE
exports.deleteCategory = async (req, res) => {
  await prisma.category.delete({
    where: {
      id: Number(req.params.id),
    },
  });

  res.json({ success: true });
};