import cloudinary from "../lib/cloudinary.js";
import prisma from "../lib/prisma.js";

const withId = (product) => product && { ...product, _id: product.id };

export const getAllProducts = async (req, res) => {
	try {
		const products = await prisma.product.findMany();
		res.json({ products: products.map(withId) });
	} catch (error) {
		console.log("Error in getAllProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getFeaturedProducts = async (req, res) => {
	try {
		const featuredProducts = await prisma.product.findMany({ where: { isFeatured: true } });
		res.json(featuredProducts.map(withId));
	} catch (error) {
		console.log("Error in getFeaturedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const createProduct = async (req, res) => {
	try {
		const { name, description, price, image, category } = req.body;

		let cloudinaryResponse = null;

		if (image) {
			cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
		}

		const product = await prisma.product.create({
			data: {
				name,
				description,
				price: Number(price),
				image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
				category,
			},
		});

		res.status(201).json(withId(product));
	} catch (error) {
		console.log("Error in createProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const deleteProduct = async (req, res) => {
	try {
		const id = Number(req.params.id);
		const product = await prisma.product.findUnique({ where: { id } });

		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		if (product.image) {
			const publicId = product.image.split("/").pop().split(".")[0];
			try {
				await cloudinary.uploader.destroy(`products/${publicId}`);
				console.log("deleted image from cloduinary");
			} catch (error) {
				console.log("error deleting image from cloduinary", error);
			}
		}

		await prisma.product.delete({ where: { id } });

		res.json({ message: "Product deleted successfully" });
	} catch (error) {
		console.log("Error in deleteProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getRecommendedProducts = async (req, res) => {
	try {
		const products = await prisma.$queryRaw`
			SELECT id, name, description, image, price FROM "Product"
			ORDER BY random()
			LIMIT 4
		`;

		res.json(products.map(withId));
	} catch (error) {
		console.log("Error in getRecommendedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getProductsByCategory = async (req, res) => {
	const { category } = req.params;
	try {
		const products = await prisma.product.findMany({ where: { category } });
		res.json({ products: products.map(withId) });
	} catch (error) {
		console.log("Error in getProductsByCategory controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const toggleFeaturedProduct = async (req, res) => {
	try {
		const id = Number(req.params.id);
		const product = await prisma.product.findUnique({ where: { id } });

		if (product) {
			const updatedProduct = await prisma.product.update({
				where: { id },
				data: { isFeatured: !product.isFeatured },
			});
			res.json(withId(updatedProduct));
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		console.log("Error in toggleFeaturedProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
