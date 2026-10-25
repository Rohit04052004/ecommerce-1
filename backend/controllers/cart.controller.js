import prisma from "../lib/prisma.js";

export const getCartProducts = async (req, res) => {
	try {
		const cartItems = await prisma.cartItem.findMany({
			where: { userId: req.user.id },
			include: { product: true },
		});

		const items = cartItems.map(({ product, quantity }) => ({
			...product,
			_id: product.id,
			quantity,
		}));

		res.json(items);
	} catch (error) {
		console.log("Error in getCartProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const addToCart = async (req, res) => {
	try {
		const productId = Number(req.body.productId);

		await prisma.cartItem.upsert({
			where: { userId_productId: { userId: req.user.id, productId } },
			update: { quantity: { increment: 1 } },
			create: { userId: req.user.id, productId, quantity: 1 },
		});

		const cartItems = await prisma.cartItem.findMany({ where: { userId: req.user.id } });
		res.json(cartItems.map((item) => ({ id: item.productId, quantity: item.quantity })));
	} catch (error) {
		console.log("Error in addToCart controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const removeAllFromCart = async (req, res) => {
	try {
		const { productId } = req.body;

		if (!productId) {
			await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });
		} else {
			await prisma.cartItem.deleteMany({ where: { userId: req.user.id, productId: Number(productId) } });
		}

		const cartItems = await prisma.cartItem.findMany({ where: { userId: req.user.id } });
		res.json(cartItems.map((item) => ({ id: item.productId, quantity: item.quantity })));
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const updateQuantity = async (req, res) => {
	try {
		const productId = Number(req.params.id);
		const { quantity } = req.body;

		const existingItem = await prisma.cartItem.findUnique({
			where: { userId_productId: { userId: req.user.id, productId } },
		});

		if (!existingItem) {
			return res.status(404).json({ message: "Product not found" });
		}

		if (quantity === 0) {
			await prisma.cartItem.delete({ where: { id: existingItem.id } });
		} else {
			await prisma.cartItem.update({ where: { id: existingItem.id }, data: { quantity } });
		}

		const cartItems = await prisma.cartItem.findMany({ where: { userId: req.user.id } });
		res.json(cartItems.map((item) => ({ id: item.productId, quantity: item.quantity })));
	} catch (error) {
		console.log("Error in updateQuantity controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
