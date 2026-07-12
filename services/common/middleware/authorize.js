const authorize = (...allowedRoles) => {

    return (req, res, next) => {

        const userRoles = req.user.roles || [];

        const permitted = allowedRoles.some(role =>
            userRoles.includes(role)
        );

        if (!permitted) {
            return res.status(403).json({
                success: false,
                message: "Access Denied"
            });
        }

        next();

    };

};

module.exports = authorize;