import { useState, useEffect } from 'react';
import productService from '../services/product.service';

const useSearch = () => {
    const [suggestions, setSuggestions] = useState([]);
    
    const fetchSuggestions = async (q) => {
        if (!q || q.trim().length < 2) {
            setSuggestions([]);
            return;
        }
        try {
            const data = await productService.getSuggestions(q);
            setSuggestions(data);
        } catch (err) {
            console.error(err);
        }
    };

    return { suggestions, fetchSuggestions };
};

export default useSearch;
