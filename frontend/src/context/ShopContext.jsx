import { createContext, useEffect, useState } from "react"; 
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

export const ShopContext = createContext(); 

const ShopContextProvider = (props) => { 
    const currency = '$'; 
    const delivery_fee = 10; 
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"
    
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({})
    const [products, setProducts] = useState([])
    const [token, setToken] = useState('')
    const [userId, setUserId] = useState('');
    const navigate = useNavigate();

    // Function to handle logout
    const logout = () => {
        localStorage.removeItem('token');
        setToken('');
        setUserId('');
        setCartItems({});
        toast.info('Logged out successfully');
        navigate('/login');
    };

    // Function to get consistent headers for API calls
    const getAuthHeaders = () => {
          return {
        'token': token,  // Backend expects 'token' header, not 'Authorization'
        'Content-Type': 'application/json'
    };
    };

    // Get userId from token (since tokens don't expire, we don't need to check expiration)
    const getUserId = () => {
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                return payload.id || payload.userId;
            } catch (error) {
                console.log('Error decoding token:', error);
                return null;
            }
        }
        return null;
    };

    {/*const addToCart = async (itemId, size) => {
        console.log('🛒 ADD TO CART FRONTEND DEBUG');
        console.log('📦 ItemId:', itemId, 'Size:', size);
        console.log('🔑 Token exists:', !!token);
        console.log('🔗 Backend URL:', backendUrl);

        
        if(!size){
            toast.error('Select Product Size');
            return;
        }
        
        let cartData = structuredClone(cartItems || {});
        
        if(cartData[itemId]){
            if(cartData[itemId][size]){
                cartData[itemId][size] += 1;
            }
            else{
                cartData[itemId][size] = 1;
            }
        }
        else{
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        
        setCartItems(cartData);
        
        // If user is logged in, sync with server
        if(token){
            try{
                const headers = getAuthHeaders();
                console.log('📡 Request headers:', headers);
                console.log('🎯 Full URL:', backendUrl + '/api/cart/add');
                console.log('📝 Request body:', {itemId, size});
                
                const response = await axios.post(
                    backendUrl + '/api/cart/add', 
                    {itemId, size}, 
                    {headers}
                );
                
                console.log('✅ API Response:', response.data);
                toast.success('Item added to cart');
            }
            catch(error){
                console.log('💥 ADD TO CART ERROR:');
                console.log('Status:', error.response?.status);
                console.log('Status Text:', error.response?.statusText);
                console.log('Response Data:', error.response?.data);
                console.log('Full Error:', error);
                
                // Revert cart changes on error
                setCartItems(cartItems || {});
                
                if (error.response?.status === 401 || error.response?.status === 403) {
                    toast.error('Authentication failed - Please login again');
                    logout();
                } else {
                    toast.error(error.response?.data?.message || 'Failed to add item to cart');
                }
            }
        } else {
            toast.success('Item added to cart');
        }
    } */}

    const addToCart = async (itemId, size) => {
    console.log('🛒 ADD TO CART FRONTEND DEBUG');
    console.log('📦 ItemId:', itemId, 'Size:', size);
    console.log('🔑 Token exists:', !!token);
    console.log('🔗 Backend URL:', backendUrl);
    
    if(!size){
        toast.error('Select Product Size');
        return;
    }
    
    let cartData = structuredClone(cartItems || {});
    
    if(cartData[itemId]){
        if(cartData[itemId][size]){
            cartData[itemId][size] += 1;
        }
        else{
            cartData[itemId][size] = 1;
        }
    }
    else{
        cartData[itemId] = {};
        cartData[itemId][size] = 1;
    }
    
    setCartItems(cartData);
    
    // If user is logged in, sync with server
    if(token){
        try{
            const headers = getAuthHeaders(); // FIX: Define headers properly
            console.log('🔍 EXACT REQUEST BEING SENT:');
            console.log('URL:', backendUrl + '/api/cart/add');
            console.log('Headers:', headers);
            console.log('Body:', {itemId, size});
            console.log('Token length:', token.length);
            
            const response = await axios.post(
                backendUrl + '/api/cart/add', 
                {itemId, size}, 
                {headers}
            );
            
            console.log('✅ API Response:', response.data);
            toast.success('Item added to cart');
        }
        catch(error){
            // ... rest of your error handling
            console.log(error);
        }
    }
}
       
    const getCartCount = () => {
        let totalCount = 0;
        const items = cartItems || {};
        
        for(const itemId in items){
            for(const size in items[itemId]){
                try{
                    if(items[itemId][size] > 0){
                        totalCount += items[itemId][size]
                    }
                }
                catch(error){
                    console.log(error);
                }
            }   
        }
        return totalCount;
    }
    
    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems || {});
        
        if (!cartData[itemId]) {
            cartData[itemId] = {};
        }
        
        cartData[itemId][size] = quantity;
        setCartItems(cartData);
        
        if(token){
            try{
                await axios.post(
                    backendUrl + '/api/cart/update', 
                    {itemId, size, quantity}, 
                    {headers: getAuthHeaders()}
                );
            }
            catch(error){
                console.log(error);
                setCartItems(cartItems || {});
                
                if (error.response?.status === 401 || error.response?.status === 403) {
                    toast.error('Please login again');
                    logout();
                } else {
                    toast.error(error.response?.data?.message || 'Failed to update cart');
                }
            }
        }
    }
    
    const getCartAmount = () => {
        let totalAmount = 0;
        for(const items in cartItems){
            let itemInfo = products.find((product)=> product._id === items);
            for(const item in cartItems[items]){
                try{
                    if(itemInfo && itemInfo.price &&cartItems[items][item] > 0){
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                }
                catch (error){
                    console.log(error);
                }
            }
        }
        return totalAmount;
    }

    const getProductsData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list')
            
            if(response.data.success){
                setProducts(response.data.products);
            }
            else{
                toast.error(response.data.message)
            }
        }
        catch (error){
            console.log("API Error:", error)
            toast.error(error.message)
        }
    }

    const getUserCart = async (token) => {
        if (!token) {
            return;
        }

        try{
            const response = await axios.post(
                backendUrl + '/api/cart/get', 
                {}, 
                {headers: {'token': token}}
            );
            
            if(response.data.success){
                setCartItems(response.data.cartData || {});
            }
        }
        catch (error){
            console.log('Get cart error:', error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                logout();
            } else {
                toast.error(error.response?.data?.message || 'Failed to get cart');
            }
        }
    }

    // Initialize on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            const id = getUserId();
            if (id) {
                setUserId(id);
            }
            getUserCart(storedToken);
        }
    }, []);

    // Get products on mount
    useEffect(()=>{
        getProductsData()
    }, [])

    // Update userId when token changes
    useEffect(() => {
        if (token) {
            const id = getUserId();
            if (id && id !== userId) {
                setUserId(id);
            }
        } else {
            setUserId('');
        }
    }, [token]);

    const value = { 
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems: cartItems || {}, 
        setCartItems, addToCart, 
        getCartCount, updateQuantity, getCartAmount,
        navigate, backendUrl, token, setToken,
        setProducts, userId, setUserId, getUserId, 
        logout, getAuthHeaders
    } 
    
    return ( 
        <ShopContext.Provider value={value}> 
            {props.children}
        </ShopContext.Provider> 
    ) 
} 

export default ShopContextProvider;
{/*import { createContext, useEffect, useState } from "react"; 
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

export const ShopContext = createContext(); 

const ShopContextProvider = (props) => { 
    const currency = '$'; 
    const delivery_fee = 10; 
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"
    
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({})
    const [products, setProducts] = useState([])
    const [token, setToken] = useState('')
    const [userId, setUserId] = useState('');
    const navigate = useNavigate();

    // Function to handle logout
    const logout = () => {
        localStorage.removeItem('token');
        setToken('');
        setUserId('');
        setCartItems({});
        toast.info('Logged out successfully');
        navigate('/login');
    };

    // Function to get consistent headers for API calls
    const getAuthHeaders = () => {
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    };

    // Get userId from token (since tokens don't expire, we don't need to check expiration)
    const getUserId = () => {
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                return payload.id || payload.userId;
            } catch (error) {
                console.log('Error decoding token:', error);
                return null;
            }
        }
        return null;
    };

    const addToCart = async (itemId, size) => {
        if(!size){
            toast.error('Select Product Size');
            return;
        }
        
        let cartData = structuredClone(cartItems || {});
        
        if(cartData[itemId]){
            if(cartData[itemId][size]){
                cartData[itemId][size] += 1;
            }
            else{
                cartData[itemId][size] = 1;
            }
        }
        else{
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        
        setCartItems(cartData);
        
        // If user is logged in, sync with server
        if(token){
            try{
                await axios.post(
                    backendUrl + '/api/cart/add', 
                    {itemId, size}, 
                    {headers: getAuthHeaders()}
                );
                toast.success('Item added to cart');
            }
            catch(error){
                console.log('Add to cart error:', error);
                // Revert cart changes on error
                setCartItems(cartItems || {});
                
                if (error.response?.status === 401 || error.response?.status === 403) {
                    toast.error('Please login again');
                    logout();
                } else {
                    toast.error(error.response?.data?.message || 'Failed to add item to cart');
                }
            }
        } else {
            toast.success('Item added to cart');
        }
    }
       
    const getCartCount = () => {
        let totalCount = 0;
        const items = cartItems || {};
        
        for(const itemId in items){
            for(const size in items[itemId]){
                try{
                    if(items[itemId][size] > 0){
                        totalCount += items[itemId][size]
                    }
                }
                catch(error){
                    console.log(error);
                }
            }   
        }
        return totalCount;
    }
    
    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems || {});
        
        if (!cartData[itemId]) {
            cartData[itemId] = {};
        }
        
        cartData[itemId][size] = quantity;
        setCartItems(cartData);
        
        if(token){
            try{
                await axios.post(
                    backendUrl + '/api/cart/update', 
                    {itemId, size, quantity}, 
                    {headers: getAuthHeaders()}
                );
            }
            catch(error){
                console.log(error);
                setCartItems(cartItems || {});
                
                if (error.response?.status === 401 || error.response?.status === 403) {
                    toast.error('Please login again');
                    logout();
                } else {
                    toast.error(error.response?.data?.message || 'Failed to update cart');
                }
            }
        }
    }
    
    const getCartAmount = () => {
        let totalAmount = 0;
        for(const items in cartItems){
            let itemInfo = products.find((product)=> product._id === items);
            for(const item in cartItems[items]){
                try{
                    if(itemInfo && itemInfo.price &&cartItems[items][item] > 0){
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                }
                catch (error){
                    console.log(error);
                }
            }
        }
        return totalAmount;
    }

    const getProductsData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list')
            
            if(response.data.success){
                setProducts(response.data.products);
            }
            else{
                toast.error(response.data.message)
            }
        }
        catch (error){
            console.log("API Error:", error)
            toast.error(error.message)
        }
    }

    const getUserCart = async (token) => {
        if (!token) {
            return;
        }

        try{
            const response = await axios.post(
                backendUrl + '/api/cart/get', 
                {}, 
                {headers: {'Authorization': `Bearer ${token}`}}
            );
            
            if(response.data.success){
                setCartItems(response.data.cartData || {});
            }
        }
        catch (error){
            console.log('Get cart error:', error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                logout();
            } else {
                toast.error(error.response?.data?.message || 'Failed to get cart');
            }
        }
    }

    // Initialize on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            const id = getUserId();
            if (id) {
                setUserId(id);
            }
            getUserCart(storedToken);
        }
    }, []);

    // Get products on mount
    useEffect(()=>{
        getProductsData()
    }, [])

    // Update userId when token changes
    useEffect(() => {
        if (token) {
            const id = getUserId();
            if (id && id !== userId) {
                setUserId(id);
            }
        } else {
            setUserId('');
        }
    }, [token]);

    const value = { 
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems: cartItems || {}, 
        setCartItems, addToCart, 
        getCartCount, updateQuantity, getCartAmount,
        navigate, backendUrl, token, setToken,
        setProducts, userId, setUserId, getUserId, 
        logout, getAuthHeaders
    } 
    
    return ( 
        <ShopContext.Provider value={value}> 
            {props.children}
        </ShopContext.Provider> 
    ) 
} 

export default ShopContextProvider; */}

{/*import { createContext, useEffect, useState } from "react"; 
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

export const ShopContext = createContext(); 

const ShopContextProvider = (props) => { 
    const currency = '$'; 
    const delivery_fee = 10; 
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"
    console.log("Backend URL:", backendUrl) // Debug log
    console.log("Environment VITE_BACKEND_URL:", import.meta.env.VITE_BACKEND_URL) // Debug log
    
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({}) // Fixed: Initialize as empty object instead of array;
    const [products, setProducts] = useState([])
    const [token, setToken] = useState('')
    const [userId, setUserId] = useState('');
    const navigate = useNavigate();

    // Function to check if token is expired
    const isTokenExpired = (token) => {
        if (!token) return true;
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            return payload.exp < currentTime;
        } catch (error) {
            console.log('Error checking token expiration:', error);
            return true;
        }
    };

    // Function to handle logout
    const logout = () => {
        localStorage.removeItem('token');
        setToken('');
        setUserId('');
        setCartItems({});
        toast.info('Session expired. Please login again.');
        navigate('/login');
    };

    // Function to check token validity before API calls
    const validateToken = () => {
        if (token && isTokenExpired(token)) {
            logout();
            return false;
        }
        return true;
    };

    // Function to get consistent headers for API calls
    const getAuthHeaders = () => {
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    };

    const addToCart = async (itemId, size) => {
        if(!size){
            toast.error('Select Product Size');
            return;
        }
        let cartData = structuredClone(cartItems);
        if(cartData[itemId]){
            if(cartData[itemId][size]){
                cartData[itemId][size] += 1;
            }
            else{
                cartData[itemId][size] = 1;
            }
        }
        else{
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);
        
        if(token){
            if (!validateToken()) return;
            try{
                console.log('Adding to cart with token:', token);
                console.log('ItemId:', itemId, 'Size:', size);
                
                // Use consistent header format
                await axios.post(
                    backendUrl + '/api/cart/add', 
                    {itemId, size}, 
                    {headers: getAuthHeaders()}
                );
            }
            catch(error){
                console.log('Add to cart error:', error);
                // Handle token expiration error
                if (error.response?.status === 401 || error.response?.status === 403) {
                    logout();
                } else {
                    toast.error(error.response?.data?.message || error.message);
                }
            }
        }
    }
       
    const getCartCount = () => {
        let totalCount = 0;
        // Safety check: ensure cartItems is an object
        const items = cartItems || {};
        
        for(const itemId in items){
            for(const size in items[itemId]){
                try{
                    if(items[itemId][size] > 0){
                        totalCount += items[itemId][size]
                    }
                }
                catch(error){
                    console.log(error);
                }
            }   
        }
        return totalCount;
    }
    
    const updateQuantity = async (itemId, size, quantity) => {
        // Safety check: ensure cartItems is an object
        let cartData = structuredClone(cartItems || {});
        
        // Ensure the item exists in cart
        if (!cartData[itemId]) {
            cartData[itemId] = {};
        }
        
        cartData[itemId][size] = quantity;
        setCartItems(cartData);
        
        if(token){
            if (!validateToken()) return;
            try{
                await axios.post(
                    backendUrl + '/api/cart/update', 
                    {itemId, size, quantity}, 
                    {headers: getAuthHeaders()}
                );
            }
            catch(error){
                console.log(error);
                if (error.response?.status === 401 || error.response?.status === 403) {
                    logout();
                } else {
                    toast.error(error.response?.data?.message || error.message);
                }
            }
        }
    }
    
    const getCartAmount = () => {
        let totalAmount = 0;
        for(const items in cartItems){
            let itemInfo = products.find((product)=> product._id === items);
            for(const item in cartItems[items]){
                try{
                    if(itemInfo && itemInfo.price &&cartItems[items][item] > 0){
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                }
                catch (error){
                    console.log(error);
                }
            }
        }
        return totalAmount;
    }

    const getProductsData = async () => {
        console.log("getProductsData called"); // Debug log
        console.log("Making request to:", backendUrl + '/api/product/list'); // Debug log
        
        try {
            const response = await axios.get(backendUrl + '/api/product/list')
            console.log("API Response:", response); // Debug log
            console.log("API Response data:", response.data); // Debug log
            
            if(response.data.success){
                console.log("API Success - Setting products:", response.data.products); // Debug log
                setProducts(response.data.products);
            }
            else{
                console.log("API returned success: false, message:", response.data.message); // Debug log
                toast.error(response.data.message)
            }
        }
        catch (error){
            console.log("API Error:", error) // Debug log
            console.log("API Error message:", error.message) // Debug log
           
            toast.error(error.message)
        }
    }

    const getUserCart = async (token) => {
         if (!token || isTokenExpired(token)) {
            logout();
            return;
        }

        try{
            const response = await axios.post(
                backendUrl + '/api/cart/get', 
                {}, 
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            if(response.data.success){
                setCartItems(response.data.cartData);
            }
        }
        catch (error){
            console.log('Get cart error:', error);
             if (error.response?.status === 401 || error.response?.status === 403) {
                logout();
            } else {
                toast.error(error.response?.data?.message || error.message);
            }
        }
    }

    const getUserId = () => {
        if (token) {
            try {
                // If your token is JWT, decode it:
                const payload = JSON.parse(atob(token.split('.')[1]));
                return payload.id || payload.userId;
            } catch (error) {
                console.log('Error decoding token:', error);
                return null;
            }
        }
        return null;
    };

    // Initialize token and user data on component mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            if (isTokenExpired(storedToken)) {
                logout();
            } else {
                setToken(storedToken);
                // Set userId immediately when setting token
                const id = getUserId();
                if (id) {
                    setUserId(id);
                }
                getUserCart(storedToken);
            }
        }
    }, []);

    useEffect(()=>{
        console.log("ShopContext useEffect - calling getProductsData"); // Debug log
        getProductsData()
    }, [])

    // Update userId when token changes
    useEffect(() => {
        if (token) {
            const id = getUserId();
            if (id && id !== userId) {
                setUserId(id);
            }
            
            // Set up token expiration check interval
            const interval = setInterval(() => {
                if (isTokenExpired(token)) {
                    logout();
                }
            }, 60000); // Check every minute

            return () => clearInterval(interval);
        } else {
            setUserId('');
        }
    }, [token]);

    // Debug log for cartItems state changes
    useEffect(() => {
        console.log("CartItems state changed:", cartItems);
        console.log("CartItems type:", typeof cartItems);
    }, [cartItems])

    const value = { 
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, setCartItems, addToCart, 
        getCartCount, updateQuantity, getCartAmount,
        navigate, backendUrl, token, setToken,
        setProducts, userId, setUserId, getUserId, 
        logout, validateToken, isTokenExpired, getAuthHeaders
    } 
    
    return ( 
        <ShopContext.Provider value={value}> 
            {props.children}
        </ShopContext.Provider> 
    ) 
} 

export default ShopContextProvider;

{/*import { createContext, useEffect, useState } from "react"; 
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

export const ShopContext = createContext(); 

const ShopContextProvider = (props) => { 
    const currency = '$'; 
    const delivery_fee = 10; 
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"
    console.log("Backend URL:", backendUrl) // Debug log
    console.log("Environment VITE_BACKEND_URL:", import.meta.env.VITE_BACKEND_URL) // Debug log
    
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({}) // Fixed: Initialize as empty object instead of array;
    const [products, setProducts] = useState([])
    const [token, setToken] = useState('')
    const [userId, setUserId] = useState('');
    const navigate = useNavigate();

    // Function to check if token is expired
    const isTokenExpired = (token) => {
        if (!token) return true;
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            return payload.exp < currentTime;
        } catch (error) {
            console.log('Error checking token expiration:', error);
            return true;
        }
    };

    // Function to handle logout
    const logout = () => {
        localStorage.removeItem('token');
        setToken('');
        setCartItems({});
        toast.info('Session expired. Please login again.');
        navigate('/login');
    };

    // Function to check token validity before API calls
    const validateToken = () => {
        if (token && isTokenExpired(token)) {
            logout();
            return false;
        }
        return true;
    };

    const getAuthHeaders = () => {
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    };

    const addToCart = async (itemId, size) => {
        if(!size){
            toast.error('Select Product Size');
            return;
        }
        let cartData = structuredClone(cartItems);
        if(cartData[itemId]){
            if(cartData[itemId][size]){
                cartData[itemId][size] += 1;
            }
            else{
                cartData[itemId][size] = 1;
            }
        }
        else{
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);
        if(token){
            if (!validateToken()) return;
            try{
                console.log(token)
                console.log(itemId)
                console.log(size)
                await axios.post(backendUrl + '/api/cart/add', {itemId, size}, {headers: getAuthHeaders()})
            }
            catch(error){
                console.log(error);
                // Handle token expiration error
                if (error.response?.status === 401 || error.response?.status === 403) {
                    logout();
                } else {
                    toast.error(error.message);
                }
            }
        }
    }
       
    const getCartCount = () => {
        let totalCount = 0;
        // Safety check: ensure cartItems is an object
        const items = cartItems || {};
        
        for(const itemId in items){
            for(const size in items[itemId]){
                try{
                    if(items[itemId][size] > 0){
                        totalCount += items[itemId][size]
                    }
                }
                catch(error){
                    console.log(error);
                    toast.error(error.message)
                }
            }   
        }
        return totalCount;
    }
    
    const updateQuantity = async (itemId, size, quantity) => {
        // Safety check: ensure cartItems is an object
        let cartData = structuredClone(cartItems || {});
        
        // Ensure the item exists in cart
        if (!cartData[itemId]) {
            cartData[itemId] = {};
        }
        
        cartData[itemId][size] = quantity;
        setCartItems(cartData);
        
        if(token){
            if (!validateToken()) return;
            try{
                await axios.post(backendUrl + '/api/cart/update', {itemId, size, quantity}, {headers: getAuthHeaders()})
            }
            catch(error){
                console.log(error);
                if (error.response?.status === 401 || error.response?.status === 403) {
                    logout();
                } else {
                    toast.error(error.message);
                }
            }
        }
    }
    
    const getCartAmount = () => {
        let totalAmount = 0;
        for(const items in cartItems){
            let itemInfo = products.find((product)=> product._id === items);
            for(const item in cartItems[items]){
                try{
                    if(itemInfo && itemInfo.price &&cartItems[items][item] > 0){
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                }
                catch (error){
                    console.log(error);
                    toast.error(error.message)
                }
            }
        }
        return totalAmount;
    }

    const getProductsData = async () => {
        console.log("getProductsData called"); // Debug log
        console.log("Making request to:", backendUrl + '/api/product/list'); // Debug log
        
        try {
            const response = await axios.get(backendUrl + '/api/product/list')
            console.log("API Response:", response); // Debug log
            console.log("API Response data:", response.data); // Debug log
            
            if(response.data.success){
                console.log("API Success - Setting products:", response.data.products); // Debug log
                setProducts(response.data.products);
            }
            else{
                console.log("API returned success: false, message:", response.data.message); // Debug log
                toast.error(response.data.message)
            }
        }
        catch (error){
            console.log("API Error:", error) // Debug log
            console.log("API Error message:", error.message) // Debug log
           
            toast.error(error.message)
        }
    }

    const getUserCart = async (token) => {

         if (!token || isTokenExpired(token)) {
            logout();
            return;
        }

        try{
            const response = await axios.post(backendUrl + '/api/cart/get', {}, {headers: getAuthHeaders()})
            if(response.data.success){
                setCartItems(response.data.cartData);
            }
        }
        catch (error){
            console.log(error)
             if (error.response?.status === 401 || error.response?.status === 403) {
                logout();
            } else {
                toast.error(error.message);
            }
        }
    }

    const getUserId = () => {
    if (token) {
        try {
            // If your token is JWT, decode it:
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.id || payload.userId;
        } catch (error) {
            console.log('Error decoding token:', error);
            return null;
        }
    }
    return null;
};
     useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            if (isTokenExpired(storedToken)) {
                logout();
            } else {
                setToken(storedToken);
                getUserCart(storedToken);
            }
        }
    }, []);

    useEffect(()=>{
        console.log("ShopContext useEffect - calling getProductsData"); // Debug log
        getProductsData()
    }, [])

    useEffect(()=>{
        if(!token && localStorage.getItem('token')){
            setToken(localStorage.getItem('token'))
            getUserCart(localStorage.getItem('token'))
        }
    }, [token])

    // Debug log for cartItems state changes
    useEffect(() => {
        console.log("CartItems state changed:", cartItems);
        console.log("CartItems type:", typeof cartItems);
    }, [cartItems])

    useEffect(() => {
        if (token) {
            const interval = setInterval(() => {
                if (isTokenExpired(token)) {
                    logout();
                }
            }, 60000); // Check every minute

            return () => clearInterval(interval);
        }
    }, [token]);

    useEffect(() => {
    if (!token && localStorage.getItem('token')) {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
        getUserCart(storedToken);
        
        // Set userId from token
        const id = getUserId();
        if (id) {
            setUserId(id);
        }
    }
}, [token]);

    const value = { 
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, setCartItems, addToCart, 
        getCartCount, updateQuantity, getCartAmount,
        navigate, backendUrl, token, setToken,
        setProducts , userId, setUserId, getUserId, logout, validateToken, isTokenExpired , getAuthHeaders
    } 
    
    return ( 
        <ShopContext.Provider value={value}> 
            {props.children}
        </ShopContext.Provider> 
    ) 
} 

export default ShopContextProvider; */}