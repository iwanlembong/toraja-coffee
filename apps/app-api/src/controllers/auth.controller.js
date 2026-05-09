const prisma = require("../../../../packages/database/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({
                error: "User tidak ditemukan",
            });
        }

        const valid = await bcrypt.compare(
            password,
            user.password
        );

        if (!valid) {
            return res.status(401).json({
                error: "Password salah",
            });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                lastActive: new Date(),
            },
        });

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // production: true
            sameSite: "lax",
            path: "/",
        });

        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
};

// LOGOUT
exports.logout = async (req, res) => {
    res.clearCookie("token");

    res.json({
        success: true,
    });
};

// ME
exports.me = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id,
            },
            select: {
                id: true,
                email: true,
                role: true,
                lastActive: true,
            },
        });

        res.json(user);
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
};