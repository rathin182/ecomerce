const jwt = require("jsonwebtoken");
const UserModel = require("../models/user-model");

module.exports = async (req, res, next) => {
    if (!req.cookies.token) {
        req.flash("error", "you need to login first");
        return res.redirect("/");  
    }

    try {
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        let user = await UserModel
            .findOne({ email: decoded.email })
            .select("-password");
            req.user = user;
            next();
    } catch (error) {
        req.flash("error", "you need to login first");
        return res.redirect("/");
    }
}