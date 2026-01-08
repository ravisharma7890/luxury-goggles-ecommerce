import db from "../config/db.js";

export const getDashboardStats = async (req, res) => {
  try {
    const range = req.query.range || "week";

    let dateCondition = "";
    if (range === "today") {
      dateCondition = "DATE(created_at) = CURDATE()";
    } else if (range === "month") {
      dateCondition = "MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE())";
    } else {
      // default: last 7 days
      dateCondition = "created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)";
    }

    const [[totalOrders]] = await db.query(
      `SELECT COUNT(*) as count FROM orders WHERE ${dateCondition}`
    );

    const [[paidOrders]] = await db.query(
      `SELECT COUNT(*) as count FROM orders WHERE payment_status='paid' AND ${dateCondition}`
    );

    const [[revenue]] = await db.query(
      `SELECT IFNULL(SUM(total),0) as total 
       FROM orders 
       WHERE payment_status='paid' AND ${dateCondition}`
    );

    const [ordersByDay] = await db.query(
      `SELECT DATE(created_at) as date, COUNT(*) as count
       FROM orders
       WHERE ${dateCondition}
       GROUP BY DATE(created_at)
       ORDER BY date`
    );

    const [revenueByDay] = await db.query(
      `SELECT DATE(created_at) as date, SUM(total) as amount
       FROM orders
       WHERE payment_status='paid' AND ${dateCondition}
       GROUP BY DATE(created_at)
       ORDER BY date`
    );

    res.json({
      totalOrders: totalOrders.count,
      paidOrders: paidOrders.count,
      totalRevenue: revenue.total,
      ordersByDay,
      revenueByDay
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
