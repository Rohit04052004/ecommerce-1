import prisma from "../lib/prisma.js";

export const getAnalyticsData = async () => {
	const totalUsers = await prisma.user.count();
	const totalProducts = await prisma.product.count();

	const salesData = await prisma.order.aggregate({
		_count: { _all: true },
		_sum: { totalAmount: true },
	});

	return {
		users: totalUsers,
		products: totalProducts,
		totalSales: salesData._count._all,
		totalRevenue: salesData._sum.totalAmount || 0,
	};
};

export const getDailySalesData = async (startDate, endDate) => {
	try {
		const orders = await prisma.order.findMany({
			where: { createdAt: { gte: startDate, lte: endDate } },
			select: { createdAt: true, totalAmount: true },
		});

		const byDate = {};
		for (const order of orders) {
			const day = order.createdAt.toISOString().split("T")[0];
			if (!byDate[day]) byDate[day] = { sales: 0, revenue: 0 };
			byDate[day].sales += 1;
			byDate[day].revenue += order.totalAmount;
		}

		const dateArray = getDatesInRange(startDate, endDate);

		return dateArray.map((date) => ({
			date,
			sales: byDate[date]?.sales || 0,
			revenue: byDate[date]?.revenue || 0,
		}));
	} catch (error) {
		throw error;
	}
};

function getDatesInRange(startDate, endDate) {
	const dates = [];
	let currentDate = new Date(startDate);

	while (currentDate <= endDate) {
		dates.push(currentDate.toISOString().split("T")[0]);
		currentDate.setDate(currentDate.getDate() + 1);
	}

	return dates;
}
