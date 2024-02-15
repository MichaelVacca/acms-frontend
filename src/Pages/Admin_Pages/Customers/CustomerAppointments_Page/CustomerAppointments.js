import React, { useState, useEffect } from 'react';
import adminService from '../../../../Services/admin.service.js';
import { useParams } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';
import Navbar from '../../../../Components/Navigation_Bars/Logged_In/NavBar.js';
import NavBar from '../../../../Components/Navigation_Bars/Not_Logged_In/NavBar.js';
import Footer from '../../../../Components/Footer/Footer.js';
import Sidebar from '../../../../Components/Navigation_Bars/Sidebar/Sidebar.js';
import CustomerAppointmentBlock from './CustomerAppointmentBlock.js';
import userService from '../../../../Services/user.service.js';

function CustomerAppointments() {
  const { customerId } = useParams();
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();
  const [publicContent, setPublicContent] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    userService.getAdminContent().then(
      (response) => {
        setPublicContent(true);
      })
      .catch(error => {
        console.log(error);
        setPublicContent(false);
        if (error.response && error.response.status === 403) {
          
          setMessage({
            status: 403,
            error: 'Forbidden',
            message: 'You do not have permission to access this resource.',
          });
        } else {
          
          setMessage(error.response.data);
        }
      })
  }, []);

  useEffect(() => {
    getCustomerAppointments();
  }, []);

  function getCustomerAppointments() {
    adminService.getAllCustomerAppointments(customerId)  
    .then(res => {
        console.log('API response:', res); 
        if (res.status === 200) {
            setAppointments(res.data);
        }
      })
      .catch(error => {
        console.log(error);
      })
  }

  const handleAddAppointmentClick = () => {
    navigate(`/admin/customers/${customerId}/appointments/newAppointment`, customerId);
  };


  return (
    <div className="flex flex-col min-h-screen">
      {publicContent ?(
        <div>
          <Navbar />
          <div className="flex flex-1 mt-5">
            <Sidebar customerId={customerId} />
            <div className="flex-1 ml-5 mt-10">
              <div className="w-5/6 rounded bg-gray-300 mx-auto mt-1 mb-5">
                <div className="flex p-2 bg-gray-300 w-full">
                  <p className="text-2xl font-bold mx-auto">APPOINTMENTS</p>
                  <div className="flex items-center space-x-4">
                    <div className="relative flex">
                      <input className="w-full rounded border-gray-300 px-4 py-2 focus:outline-none focus:border-indigo-500" type="text" placeholder="Search..." />
                      <span className="text-gray-400 cursor-pointer">&#128269;</span>
                    </div>
                    <button className="text-white border-none px-4 py-2 rounded font-bold transition duration-300 hover:scale-110 bg-black">
                    Add+
                  </button>
                  </div>
                </div>
                <div className="w-full overflow-y-scroll sm:h-96">
                  <table className="w-full table-auto">
                    <thead className="bg-white sticky top-0">
                      <tr>
                        <th>ID</th>
                        <th>DATE & TIME</th>
                        <th>SERVICES</th>
                        <th>VEHICLE</th>
                        <th>STATUS</th>
                        <th></th> {/* Don't del for table structure*/}
                        <th></th> {/* Don't del for table structure*/}
                      </tr>
                    </thead>
                    <tbody className="text-center">
                      {appointments.map((appointment) => (
                        <CustomerAppointmentBlock 
                        key={appointment.appointmentId} 
                        appointment={appointment}
                        refreshCustomerAppointments={getCustomerAppointments} 
                        />
                      ))}
                  </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-5">
              <img src="/appointments.svg" alt="appointment's Image" />
            </div>
        </div>) : (
        <div className="flex-1 text-center">
          <NavBar />
          {publicContent === false ? <h1 className='text-4xl'>{message.status} {message.error} </h1> : 'Error'}
          {message && (
            <>
              <p className='text-2xl'>{message.message} </p>
            </>
          )}
        </div>)}
      <Footer />
    </div>
  );
}

export default CustomerAppointments;
