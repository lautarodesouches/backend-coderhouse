export const requireAdminOrPremium = (req, res, next) => {

    const role = req.user.role

    if (role !== "admin" || role !== "premium") return res.status(403).json({ message: "Access denied. Only admin or premium users are allowed." })

    next()

}

export const requireUser = (req,res, next) => {

    const role = req.user.role

    if (role !== "user") return res.status(403).json({ message: "Access denied. Only users are allowed." })

    next()

}