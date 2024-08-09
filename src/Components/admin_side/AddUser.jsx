import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { BASE_URL } from '../../redux/actions/authService'

function AddUser() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' })
    const navigate = useNavigate()
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        try {
            const response = await axios.post(`${BASE_URL}account/api/register/`, formData)
            console.log('User registered:', response.data);
            navigate("/dashboard")

        } catch (error) {
            if (error.response) {

                console.error('Error response:', error.response);


                let errorMessage = '';

                if (error.response.data.email) {
                    errorMessage += 'Email: ' + error.response.data.email.join(' ') + ' ';
                }
                if (error.response.data.name) {
                    errorMessage += 'Name: ' + error.response.data.name.join(' ') + ' ';
                }
                if (formData.password !== formData.confirm_password) {
                    alert('Passwords do not match.');
                    return;
                }


                if (!errorMessage) {
                    errorMessage = 'Registration failed. Please try again.';
                }


                alert(errorMessage.trim());
            } else {

                alert('Registration failed. Please try again.');
            }
            console.error('Registration error:', error);
        }
    }
    return (

        <div className='flex justify-center items-center h-full p-10'>
            <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
                <h1 className='text-4xl font-bold  ml-32'>Add User</h1>
                <form className='flex flex-col mt-9' onSubmit={handleSubmit}>
                    <label className='mb-3'>Name</label>
                    <input onChange={handleChange} value={formData.name} name='name' className='border rounded-md border-black p-3' type="text" placeholder='Name' />
                    <label className='my-3'>Email</label>
                    <input onChange={handleChange} value={formData.email} name='email' className='border rounded-md border-black p-3' type="email" placeholder='Email' />
                    <label className='my-3'>Password</label>
                    <input onChange={handleChange} value={formData.password} name='password' className='border rounded-md border-black p-3' type="password" placeholder='password' />
                    <label className='my-3'>Confirm Password</label>
                    <input onChange={handleChange} value={formData.confirm_password} name='confirm_password' className='border rounded-md border-black p-3' type="password" placeholder='Confirm password' />
                    <button type='submit' className='w-full bg-blue-900 text-white rounded-md py-2 px-4 hover:bg-blue-500 transition duration-300 mt-6'>Register</button>
                </form>

            </div>
        </div>

    )
}

export default AddUser