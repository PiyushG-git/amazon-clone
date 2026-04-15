import ProductService from '../services/product.service.js';

export const getProducts = async (req, res, next) => {
    try {
        const products = await ProductService.getAllProducts(req.query);
        res.json(products);
    } catch (err) {
        next(err);
    }
};

export const getCategories = async (req, res, next) => {
    try {
        const categories = await ProductService.getCategories();
        res.json(categories);
    } catch (err) {
        next(err);
    }
};

export const getSuggestions = async (req, res, next) => {
    try {
        const suggestions = await ProductService.getSuggestions(req.query.q);
        res.json(suggestions);
    } catch (err) {
        next(err);
    }
};

export const getProductById = async (req, res, next) => {
    try {
        const product = await ProductService.getProductById(req.params.id);
        res.json(product);
    } catch (err) {
        next(err);
    }
};
