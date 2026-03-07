const validateExpense = (req, res, next) => {
  const { title, amount } = req.body || {};

  const hasValidTitle = typeof title === 'string' && title.trim() !== '';
  const hasValidAmount = amount !== undefined && amount !== null && !Number.isNaN(Number(amount));

  if (!hasValidTitle || !hasValidAmount) {
    return res.status(400).json({ error: 'Invalid expense data' });
  }

  next();
};

module.exports = validateExpense;