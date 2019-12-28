export const checkAuth = req => {
  if (!req.isAuth) throw new Error('Error, must be autenticated')
}

export const checkAdmin = req => {
  if (req.user.privilege !== 'admin')
    throw new Error('Must be admin to perfom that action')
}
