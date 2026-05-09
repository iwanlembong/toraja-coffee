const prisma = require("../../../../packages/database/client");

// GET CONTENT
exports.getContent = async (req, res) => {
    try {
        const content = await prisma.content.findFirst();

        res.json(content);
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
};

// UPDATE CONTENT
exports.updateContent = async (req, res) => {
    try {
        const { id } = req.params;

        const content = await prisma.content.update({
            where: {
                id: Number(id),
            },
            data: req.body,
        });

        res.json(content);
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
};