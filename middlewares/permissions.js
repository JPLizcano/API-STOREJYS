const validatePermission = (requiredPermission) => {
    return (req, res, next) => {
        const menu = req.cookies.menu;
        if (!menu || !menu.includes(requiredPermission)) {
            return res.status(401).json(false);
        }
        next();
    };
};

module.exports = { validatePermission };