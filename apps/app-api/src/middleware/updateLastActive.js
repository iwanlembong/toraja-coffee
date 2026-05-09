const prisma = require("../../../../packages/database/client");

const updateLastActive = async (req, res, next) => {
    try {
        if (req.user?.id) {
            await prisma.user.update({
                where: {
                    id: req.user.id
                },
                data: {
                    lastActive: new Date()
                }
            });
        }

        next();
    } catch (error) {
        console.error("updateLastActive error:", error);
        next();
    }
};

module.exports = updateLastActive;