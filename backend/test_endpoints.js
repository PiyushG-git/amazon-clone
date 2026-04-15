const testEndpoints = async () => {
    const BASE_URL = 'http://localhost:5000/api';
    let token = '';

    console.log('--- Starting Endpoint Tests ---');

    // 1. Test Products
    try {
        console.log('\n--- Testing GET /products ---');
        const p_res = await fetch(`${BASE_URL}/products`);
        const p_data = await p_res.json();
        console.log('Products fetched:', p_data.length, '(expected 8)');
        if(p_data.length > 0) {
            console.log('\n--- Testing GET /products/:id ---');
            const sp_res = await fetch(`${BASE_URL}/products/${p_data[0].id}`);
            const sp_data = await sp_res.json();
            console.log('Single product fetched:', sp_data.name);
        }
    } catch(err) {
        console.error('Products Test Failed:', err.message);
    }

    // 2. Test Auth (Register)
    try {
        console.log('\n--- Testing POST /auth/register ---');
        const reg_res = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: 'Tester', email: 'tester' + Date.now() + '@example.com', password: 'password123'})
        });
        const reg_data = await reg_res.json();
        if(reg_data.token) {
            token = reg_data.token;
            console.log('Registration successful, token received:', token.substring(0, 15) + '...');
        } else {
            console.log('Registration failed:', reg_data);
        }
    } catch(err) {
         console.error('Auth Test Failed:', err.message);
    }

    if (!token) {
        console.log('\nCannot proceed testing secure routes without token.');
        process.exit(1);
    }

    // 3. Test Cart
    try {
        console.log('\n--- Testing POST /cart ---');
        const c_res = await fetch(`${BASE_URL}/cart`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
            body: JSON.stringify({product_id: 1, quantity: 2})
        });
        const c_data = await c_res.json();
        console.log('Added to cart:', c_data.message);

        console.log('\n--- Testing GET /cart ---');
        const cg_res = await fetch(`${BASE_URL}/cart`, {
            headers: {'Authorization': `Bearer ${token}`}
        });
        const cg_data = await cg_res.json();
        console.log('Cart items fetched:', cg_data.length);
        if (cg_data.length > 0) {
             const cartItemId = cg_data[0].cart_item_id;
             console.log('\n--- Testing PUT /cart/:id ---');
             const cu_res = await fetch(`${BASE_URL}/cart/${cartItemId}`, {
                 method: 'PUT',
                 headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
                 body: JSON.stringify({quantity: 5})
             });
             const cu_data = await cu_res.json();
             console.log('Update Cart:', cu_data.message);
        }
    } catch(err) {
        console.error('Cart Test Failed:', err.message);
    }

    // 4. Test Wishlist
    try {
        console.log('\n--- Testing POST /wishlist ---');
        const w_res = await fetch(`${BASE_URL}/wishlist`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
            body: JSON.stringify({product_id: 2})
        });
        const w_data = await w_res.json();
        console.log('Added to wishlist:', w_data.message);

        console.log('\n--- Testing GET /wishlist ---');
        const wg_res = await fetch(`${BASE_URL}/wishlist`, {
            headers: {'Authorization': `Bearer ${token}`}
        });
        const wg_data = await wg_res.json();
        console.log('Wishlist items fetched:', wg_data.length);
    } catch(err) {
        console.error('Wishlist Test Failed:', err.message);
    }

    // 5. Test Orders
    try {
        console.log('\n--- Testing POST /orders ---');
        const o_res = await fetch(`${BASE_URL}/orders`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
            body: JSON.stringify({shipping_address: '123 Test Ave'})
        });
        const o_data = await o_res.json();
        console.log('Order checkout successful:', o_data);

        console.log('\n--- Testing GET /orders ---');
        const og_res = await fetch(`${BASE_URL}/orders`, {
            headers: {'Authorization': `Bearer ${token}`}
        });
        const og_data = await og_res.json();
        console.log('Orders history fetched:', og_data.length, 'order(s) found.');
        
        console.log('\n--- Verifying Cart is Empty After Checkout ---');
        const cle_res = await fetch(`${BASE_URL}/cart`, {
            headers: {'Authorization': `Bearer ${token}`}
        });
        const cle_data = await cle_res.json();
        console.log('Cart Items Left:', cle_data.length, '(expected 0)');

    } catch(err) {
         console.error('Orders Test Failed:', err.message);
    }

    console.log('\n--- All Tests Completed ---');
};

testEndpoints();
