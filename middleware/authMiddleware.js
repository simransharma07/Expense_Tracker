module.exports = (req, res, next) => {
  const userId = req.headers['userid'];
  if (!userId) return res.status(403).json({ message: 'Unauthorized' });
  next();
};