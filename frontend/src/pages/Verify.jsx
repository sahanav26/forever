{/*import React from 'react'
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useSearchParams } from 'react-router-dom';
import { useEffect} from 'react';

import axios from 'axios';
import { toast } from 'react-toastify';

const Verify = () => {

    const {navigate , token , setCartItems, backendUrl} = useContext(ShopContext);
    const {searchParams, setSearchParams} = useSearchParams();
    const success = searchParams.get('success');
    const orderId = searchParams.get('orderId');

    const verifyPayment = async () => {
        try {
            if( !token){
                return null;
            }
            const response = await axios.post (`${backendUrl}/api/order/verifyStripe`, {success, orderId}, {headers: {token}});
            if(response.data.success){
                toast.success(response.data.message);
                setCartItems({});
                navigate('/orders');
            }
            else{
                toast.error(response.data.message);
                navigate('/cart');
            }
        } catch (error) {
            console.error(error);
            toast.error(error)
        }

    }

    useEffect(() => {
        verifyPayment();
    }, [token]);

  return (
    <div>
      
    </div>
  )
}

export default Verify */}

import React from 'react'
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useSearchParams } from 'react-router-dom';
import { useEffect} from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Verify = () => {
    const {navigate, token, setCartItems, backendUrl,  userId, getUserId} = useContext(ShopContext);
    const [searchParams] = useSearchParams();
    const success = searchParams.get('success');
    const orderId = searchParams.get('orderId');

    const verifyPayment = async () => {
        try {
            if (!token) {
                console.log('No token available');
                return null;
            }

            

            // Get userId - try from context first, then decode from token
            let currentUserId = userId || getUserId();
            
            if (!currentUserId) {
                console.log('No userId available');
                toast.error('User authentication error');
                navigate('/login');
                return;
            }

            console.log('Verifying payment with:', {
                success,
                orderId,
                userId: currentUserId
            });

            const response = await axios.post(
                `${backendUrl}/api/order/verifyStripe`, 
                {
                    success, 
                    orderId,
                    userId: currentUserId // Include userId in the request body
                }, 
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            if (response.data.success) {
                toast.success(response.data.message);
                setCartItems({});
                navigate('/orders');
            } else {
                toast.error(response.data.message);
                navigate('/cart');
            }
        } catch (error) {
            console.error('Verification error:', error);
            // Better error handling
            if (error.response) {
                console.log('Error response:', error.response.data);
                if (error.response.status === 401 || error.response.status === 403) {
                    toast.error(' Please login again.');
                    navigate('/login');
                } else {
                    toast.error(error.response.data.message || 'Payment verification failed');
                    navigate('/cart');
                }
            } 
        }
    }

    useEffect(() => {
        if (token && orderId && success) {
            console.log('Starting payment verification...');
            verifyPayment();
        } else {
            console.log('Missing verification parameters:', {
                hasToken: !!token,
                hasOrderId: !!orderId,
                hasSuccess: !!success
            });
        }
    }, [token, orderId, success]); // Removed userId as dependency

    return (
         <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p>Verifying payment...</p>
            </div>
        </div>
    )
}

export default Verify;