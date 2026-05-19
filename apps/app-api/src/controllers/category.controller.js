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
        const { name, slug } = req.body;

        const category =
            await prisma.category.create({
                data: {
                    name,
                    slug,
                },
            });

        res.json(category);
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
};

// UPDATE
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug } = req.body;

    const category =
      await prisma.category.update({
        where: {
          id: Number(id),
        },
        data: {
          name,
          slug,
        },
      });

    res.json(category);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
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