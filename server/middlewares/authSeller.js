import jwt from 'jsonwebtoken';

const authSeller = async (req, res, next) => {
  const { sellerToken } = req.cookies;

  // No token → unauthorized
  if (!sellerToken) {
    return res.status(401).json({ success: false, message: 'Not Authorized' });
  }

  try {
    const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET);

    // Only allow the correct seller
    if (tokenDecode.email === process.env.SELLER_EMAIL) {
      next(); // pass to next middleware or route
    } else {
      return res.status(401).json({ success: false, message: 'Not Authorized' });
    }
  } catch (error) {
    // Invalid or expired token
    return res.status(401).json({ success: false, message: 'Not Authorized' });
  }
};

export default authSeller;
