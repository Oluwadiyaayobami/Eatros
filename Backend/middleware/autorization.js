const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt")
const authorization = async (req, res, next) => {
    try {
        const authenticationToken = req.headers['authorization']

        if (!authenticationToken) {
            return res.status(401).json({
                message: "can't process this request"
            })
        }
        const acessToken = authenticationToken.split(" ")[1]
        if (!acessToken) {
            return res.status(401).json({
                message: "can not proceed with this request"
            })
        }
        const verifyingAcessToken = jwt.verify(acessToken, process.env.jwt)
        if (!verifyingAcessToken) {
            return res.status(401).json({
                message: "acesstoken not valid "
            })
        }
        req.acessToken = verifyingAcessToken
        next()
    }
    catch (error) {
        console.error("JWT Verification Error:", error.message);
        return res.status(401).json({
            message: "Your session has expired or is invalid. Please log in again."
        })
    }
}
/*
const security = async (req, res, next) => {
    try {
        const { password } = req.body
        const { tranxId } = req.params
        const checkingTransaxtionStatus = await ceratingPaymentlink.findById(tranxId).select('transactionStatus hasPaid customerEmail')

        if (!checkingTransaxtionStatus) {
            return res.status(404).json({
                message: "transaction not found "
            })
        }
        const email = checkingTransaxtionStatus.customerEmail

        // If the buyer hasn't paid yet, allow open access (e.g. for the checkout page)
        if (checkingTransaxtionStatus.hasPaid === false) {
          return next()
        }

        const checkingIfpasswordexist = await securingPassword.findOne({ email, transactionid: tranxId })
        
        if (!checkingIfpasswordexist) {
          // 401 signals the frontend: "Paid, but needs to set a password"
          return res.status(401).json({
            message: "password not found "
          })
        }

        // If we have a password record but the buyer hasn't provided a password in the body yet
        if (!password) {
          return res.status(403).json({
            message: "password required"
          })
        }

        const returedPassword = checkingIfpasswordexist.password
        const comperePassword = await bcrypt.compare(password, returedPassword)
        
        if (!comperePassword) {
          return res.status(403).json({
            message: "invalid password"
          })
        }

        return next()
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            message: "an error occured"
        })
    }
}
*/

module.exports = { authorization }