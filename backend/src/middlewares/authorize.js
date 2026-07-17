/**
 * Middleware phân quyền theo role
 * Sử dụng sau authenticate middleware
 * Ví dụ: router.delete("/users/:id", authenticate, authorize("admin"), deleteUser)
 */
function authorize(...roles) {
  return (req, res, next) => {
    // req.user đã được gán bởi authMiddleware
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền thực hiện thao tác này."
      });
    }
    next();
  };
}

module.exports = authorize;