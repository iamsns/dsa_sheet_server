const jwt = require('jsonwebtoken')

const authenticateUser = (req, res, next) => {

  const authHeader = req.headers['authorization'] || req.headers['Authorization']

  if (!authHeader) return res.status(401).json({ message: 'No token provided' })

  const token = authHeader.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Unauthorized user.' })

  try {
    const secret = process.env.JWT_SECRET
    const decoded = jwt.verify(token, secret)
    req.userId = decoded.userId

    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

module.exports = authenticateUser
