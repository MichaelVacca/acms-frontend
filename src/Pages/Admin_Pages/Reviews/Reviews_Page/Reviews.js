import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import adminService from '../../../../Services/admin.service.js';
import Navbar from '../../../../Components/Navigation_Bars/Logged_In/NavBar.js';
import NavBar from '../../../../Components/Navigation_Bars/Not_Logged_In/NavBar.js';
import Footer from '../../../../Components/Footer/Footer.js';
import MechanicDisplay from '../../../../Components/User_Components/MechanicDisplay.js';
import ReviewBlock from './ReviewsBlock.js';

function Reviews(){
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [publicContent, setPublicContent] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        getReviews();
    }, []);

    function getReviews() {
        adminService.getAllReviews()
        .then(res => {
            if (res.status === 200) {
                setReviews(res.data);
                setPublicContent(true);
            }
        })
        .catch(error => {
            console.log(error);
            setPublicContent(false);
            setMessage(error.response.data);
        });
    }

    return(

        <div className="flex flex-col min-h-screen">
            {publicContent ? (
                <div>
                    <Navbar />
                    <div className="content">
                        <div className="ml-5 mt-1">
                            <MechanicDisplay />
                        </div>

                        <div className="w-4/5 rounded bg-gray-300 mx-auto mt-1 mb-5">
                            <div className="flex p-2 bg-gray-300 w-full">
                                <p className="text-2xl font-bold mx-auto">REVIEWS</p>
                                <div className="flex items-center space-x-4">
                                <div className="relative flex">
                    <input
                      className="w-full rounded border-gray-300 px-4 py-2 focus:outline-none focus:border-indigo-500"
                      type="text"
                      placeholder="Search..."
                    />
                    <span className="text-gray-400 cursor-pointer">&#128269;</span>
                  </div>
                                </div>
                            </div>

                            <div className="flex flex-col p-2 bg-gray-200">
                                <table className="w-full table-auto">
                                    <thead className="bg-white sticky top-0">
                                    <tr>
                                        <th>ID</th>
                                        <th>CUSTOMER</th>
                                        <th>APPOINTMENT</th>
                                        <th>COMMENTS</th>
                                        <th>RATING</th>
                                        <th>DATE & TIME</th>
                                    </tr>
                                    </thead>
                                    <tbody className="text-center">
                                    {reviews.map((review) => (
                                        <ReviewBlock
                                            key={review.reviewId}
                                            review={review}
                                            refreshReviews={getReviews}
                                            navigate={navigate}
                                        />
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="mb-5">
                        <img src="/reviews.svg" alt="invoice's Image" />
                    </div>
                </div>
            ) : (
                <div className="flex-1 text-center">
                    <NavBar />
                    {publicContent === false ? <h1 className='text-4xl'>{message.status} {message.error} </h1> : 'Error'}
                    {message && (
                        <>
                            <h3>{message.message}</h3>
                        </>
                    )}
                </div>
            )}
            <Footer />
        </div>
    );
}
export default Reviews;