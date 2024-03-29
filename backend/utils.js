import jwt from 'jsonwebtoken'

const JWT_SECRET = 'someSecret'

export const generateToken = (user) => {
  return jwt.sign(
    {
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      _id: user._id,
    },
    JWT_SECRET,
    { expiresIn: '30d' },
  )
}

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization
  if (authorization) {
    const token = authorization.slice(7, authorization.length)
    jwt.verify(token, JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid Token' })
      } else {
        req.user = decode
        next()
      }
    })
  } else {
    res.status(401).send({ message: 'No Token' })
  }
}
