const getUser = async(req, res, next) => {
    res.status(200).json(req.user)
}

module.exports = {
    getUser
}