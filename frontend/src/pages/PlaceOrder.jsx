{/*import React, { useContext, useState } from 'react';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const { backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products,logout} = useContext(ShopContext);
  const [method, setMethod] = useState('cod');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const initPay = (order) =>{
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Order Payment",
      description: `Order #${order._id}`,
      order_id: order.id,
      handler: async (response) => {
  // Handle successful payment here
  console.log(response);
        
  try {

     const verifyUrl = `${backendUrl}/api/order/verifyRazorpay`;
    console.log('🚀 Making verification request to:', verifyUrl);
    console.log('📤 Sending data:', response);
    console.log('🔑 Using token:', token ? 'Token exists' : 'No token');

    const { data } = await axios.post(verifyUrl, response, { 
      headers: { token } 
    });
     console.log('📥 Verification response:', data);

    if (data.success) {
      console.log('✅ Payment verification successful');
      setCartItems({});
      toast.success('Order placed successfully!');
       navigate('/orders');
    }
    else {
      console.log('❌ Verification failed:', data.message);
      toast.error(data.message || "Payment verification failed");
    }
  } catch (error) {
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      toast.error(`Verification failed: ${error.response.data?.message || error.message}`);
    } else {
      console.error('Network error:', error.message);
      toast.error('Network error during verification');
    }
  }
}

        
        
      
    }
    const rzp = new window.Razorpay(options);
    rzp.open();

  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    // Check authentication
    if (!token) {
        toast.error('Please login to place an order');
        navigate('/login');
        return;
    }
    
   
    try {
      let orderItems = [];

      Object.keys(cartItems).forEach((itemId) => {
        Object.keys(cartItems[itemId]).forEach((size) => {
          if (cartItems[itemId][size] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === itemId));
            if (itemInfo) {
              itemInfo.size = size;
              itemInfo.quantity = cartItems[itemId][size];
              orderItems.push(itemInfo);
            }
          }
        });
      });
       console.log('Form Data:', formData);
      console.log('Order Items:', orderItems);
      
      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee
      };

      switch (method) {
        case 'cod':
          const response = await axios.post(`${backendUrl}/api/order/place`, orderData, { headers: { token } });
          if (response.data.success) {
            setCartItems({});
            toast.success('Order placed successfully!');
            navigate('/orders');
          } else {
            toast.error(response.data.message);
          }
          break;

        case 'stripe':
          const stripeResponse = await axios.post(`${backendUrl}/api/order/stripe`, orderData, { headers: { token } });
          if (stripeResponse.data.success) {
            
            const session_url = stripeResponse.data.url;
            window.location.replace(session_url);
          } else {
            toast.error(stripeResponse.data.message);
          }
          break;

        case 'razorpay':
          const razorpayResponse = await axios.post(`${backendUrl}/api/order/razorpay`, orderData, { headers: { token } });
          if (razorpayResponse.data.success) {
            const order = razorpayResponse.data.order;
            initPay(order);
          }
          break;

        default:
          break;
      }
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401 || error.response?.status === 403) {
            logout();
        } else {
            toast.error(error.response?.data?.message || error.message);
        }
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First name' />
          <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last name' />
        </div>
        <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email address' />
        <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' />
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' />
          <input required onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Zipcode' />
          <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' />
        </div>
        <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Phone' />
      </div>
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>
        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'} />
          <div className='flex gap-3 flex-col lg:flex-row'>
            <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
              <img className={`h-5 mx-4`} src={assets.stripe_logo} alt="Stripe" />
            </div>
            <div onClick={() => setMethod('razorpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`} ></p>
              <img className={`h-5 mx-4`} src={assets.razorpay_logo} alt="Razorpay" />
            </div>
            <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>
          <div className='w-full text-end mt-8'>
            <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>PLACE ORDER</button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder; */}

import React, { useContext, useState } from 'react';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const { backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products, logout} = useContext(ShopContext);
  const [method, setMethod] = useState('cod');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const initPay = (order) => {
    // Check if Razorpay is loaded
    if (!window.Razorpay) {
      toast.error('Razorpay SDK not loaded. Please refresh the page and try again.');
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Order Payment",
      description: `Order #${order._id}`,
      order_id: order.id,
      handler: async (response) => {
        // Handle successful payment here
        console.log('Payment successful:', response);
        
        try {
          const verifyUrl = `${backendUrl}/api/order/verifyRazorpay`;
          console.log('🚀 Making verification request to:', verifyUrl);
          console.log('📤 Sending data:', response);
          console.log('🔑 Using token:', token ? 'Token exists' : 'No token');

          const { data } = await axios.post(verifyUrl, response, { 
            headers: { token } 
          });
          console.log('📥 Verification response:', data);

          if (data.success) {
            console.log('✅ Payment verification successful');
            setCartItems({});
            toast.success('Order placed successfully!');
            navigate('/orders');
          } else {
            console.log('❌ Verification failed:', data.message);
            toast.error(data.message || "Payment verification failed");
          }
        } catch (error) {
          console.error('Verification error:', error);
          if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
            toast.error(`Verification failed: ${error.response.data?.message || error.message}`);
          } else {
            console.error('Network error:', error.message);
            toast.error('Network error during verification');
          }
        }
      },
      modal: {
        ondismiss: function() {
          toast.info('Payment cancelled');
        }
      },
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        contact: formData.phone
      },
      theme: {
        color: '#000000'
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error initializing Razorpay:', error);
      toast.error('Error initializing payment. Please try again.');
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    
    // Check authentication
    if (!token) {
        toast.error('Please login to place an order');
        navigate('/login');
        return;
    }
    
    try {
      let orderItems = [];

      Object.keys(cartItems).forEach((itemId) => {
        Object.keys(cartItems[itemId]).forEach((size) => {
          if (cartItems[itemId][size] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === itemId));
            if (itemInfo) {
              itemInfo.size = size;
              itemInfo.quantity = cartItems[itemId][size];
              orderItems.push(itemInfo);
            }
          }
        });
      });

      console.log('Form Data:', formData);
      console.log('Order Items:', orderItems);
      
      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee
      };

      switch (method) {
        case 'cod':
          const response = await axios.post(`${backendUrl}/api/order/place`, orderData, { headers: { token } });
          if (response.data.success) {
            setCartItems({});
            toast.success('Order placed successfully!');
            navigate('/orders');
          } else {
            toast.error(response.data.message);
          }
          break;

        case 'stripe':
          const stripeResponse = await axios.post(`${backendUrl}/api/order/stripe`, orderData, { headers: { token } });
          if (stripeResponse.data.success) {
            const session_url = stripeResponse.data.url;
            window.location.replace(session_url);
          } else {
            toast.error(stripeResponse.data.message);
          }
          break;

        case 'razorpay':
          // Check if Razorpay is available before making request
          if (!window.Razorpay) {
            toast.error('Razorpay is not available. Please refresh the page and try again.');
            return;
          }

          const razorpayResponse = await axios.post(`${backendUrl}/api/order/razorpay`, orderData, { headers: { token } });
          if (razorpayResponse.data.success) {
            const order = razorpayResponse.data.order;
            console.log('Razorpay order created:', order);
            initPay(order);
          } else {
            toast.error(razorpayResponse.data.message || 'Failed to create Razorpay order');
          }
          break;

        default:
          break;
      }
    } catch (error) {
      console.error('Order submission error:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
          logout();
      } else {
          toast.error(error.response?.data?.message || error.message);
      }
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First name' />
          <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last name' />
        </div>
        <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email address' />
        <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' />
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' />
          <input required onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Zipcode' />
          <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' />
        </div>
        <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Phone' />
      </div>
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>
        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'} />
          <div className='flex gap-3 flex-col lg:flex-row'>
            <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
              <img className={`h-5 mx-4`} src={assets.stripe_logo} alt="Stripe" />
            </div>
            <div onClick={() => setMethod('razorpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`} ></p>
              <img className={`h-5 mx-4`} src={assets.razorpay_logo} alt="Razorpay" />
            </div>
            <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>
          <div className='w-full text-end mt-8'>
            <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>PLACE ORDER</button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
