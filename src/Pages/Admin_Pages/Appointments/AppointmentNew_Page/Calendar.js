import dayjs from "dayjs";
import React, { useState, useEffect } from "react";
import { generateDate, months } from "./AppointmentCalendar";
import cn from "./cn";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import TimeSlots from "./TimeSlots";
import ServiceList from "./ServiceList";
import CustomerInfo from "./CustomerInfo";
import CommentBox from "./CommentBox";
import Navbar from "../../../../Components/Navigation_Bars/Logged_In/NavBar.js";
import NavBar from "../../../../Components/Navigation_Bars/Not_Logged_In/NavBar.js";
import Footer from "../../../../Components/Footer/Footer.js";
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import adminService from "../../../../Services/admin.service.js";
import userService from "../../../../Services/user.service.js";

export default function Calendar() {
    const days = ["S", "M", "T", "W", "T", "F", "S"];
    const currentDate = dayjs();
    const [today, setToday] = useState(currentDate);
    const [selectDate, setSelectDate] = useState(currentDate);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedTime, setSelectedTime] = useState('10:00');
    const [selectedService, setSelectedService] = useState(null);
    const [comments, setComments] = useState('');
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(moment());

    const [customerId, setCustomerId] = useState('');
    const [vehicleId, setVehicleId] = useState('');
    const [publicContent, setPublicContent] = useState(null);
    const [message, setMessage] = useState('');
  
    useEffect(() => {
        userService.getAdminContent()
          .then(response => {
            if(response.data){
              if(response.data === "Admin Content.") {
                setPublicContent(true);
              } 
            }
          })
          .catch(error => {
            console.error('Error fetching public content:', error);
            setPublicContent(false);
            setMessage(error.response.data);
          });
      }, []); 


    const handleTimeSelect = (time) => {
        setSelectedTime(time);
        console.log('Selected Time:', time);
    };


    const handleSubmit = () => {

        const appointmentData = {
            customerId,
            vehicleId,
            appointmentDate: selectDate.format("YYYY-MM-DD") + 'T' + selectedTime,
            services: selectedService,
            comments,
            status: 'PENDING'
        };
        if (!customerId || !vehicleId) {
            alert("Customer ID and Vehicle ID are required.");
            console.log("Appointment data:", appointmentData)
            return;
        }

        adminService.addAppointment(customerId, appointmentData)
            .then(response => {
                if(response.status === 200){
                    alert("Appointment Created");
                    navigate('/admin/appointments');
                }
            })
            .catch(error => {
                console.error("Error creating appointment:", error);
                console.error("Appointment data:", appointmentData);
            });
       
    }


    const handleDayClick = (date) => {
        setSelectDate(date);
        setSelectedDate(moment(date.format("YYYY-MM-DD"), "YYYY-MM-DD"));
    };

    const handleServiceSelect = (service) => {
        setSelectedService(service);
        console.log("Selected Service:", service);
    };


    useEffect(() => {
        if (selectDate !== currentDate) {
            setShowTimePicker(true);
        }
    }, [selectDate, currentDate]);
    return (
        <div className="flex flex-col min-h-screen">
            {publicContent ? (
            <div>
                <Navbar />
                <div className="flex justify-center items-center bg-gray-300 w-full py-6">
                    <p className="text-2xl font-bold">New Appointment</p>
                </div>
                        <div className="flex justify-center items-center h-screen">
                            <div
                                className="bg-gray-50 p-6 rounded shadow-lg"
                                style={{ maxWidth: '1500px', maxHeight: '750px' }}
                            >
                                <div className="flex flex-col sm:flex-row gap-10 sm:divide-x justify-center items-center">
                                    <div className="flex flex-col gap-4">
                                        <CustomerInfo
                                            updateCustomerId={setCustomerId}
                                            updateVehicleId={setVehicleId}
                                        />
                                        <ServiceList onSelectService={handleServiceSelect} />
                                    </div>
                                <div className="w-96 h-96 ">
                                    <div className="flex justify-between items-center">
                                        <h1 className="select-none font-semibold">
                                            {months[today.month()]}, {today.year()}
                                        </h1>
                                        <div className="flex gap-10 items-center ">
                                            <GrFormPrevious
                                                className="w-5 h-5 cursor-pointer hover:scale-105 transition-all"
                                                onClick={() => {
                                                    setToday(today.month(today.month() - 1));
                                                }}
                                            />
                                            <h1
                                                className=" cursor-pointer hover:scale-105 transition-all"
                                                onClick={() => {
                                                    setToday(currentDate);
                                                }}
                                            >
                                                Today
                                            </h1>
                                            <GrFormNext
                                                className="w-5 h-5 cursor-pointer hover:scale-105 transition-all"
                                                onClick={() => {
                                                    setToday(today.month(today.month() + 1));
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-7 ">
                                        {days.map((day, index) => {
                                            return (
                                                <h1
                                                    key={index}
                                                    className="text-sm text-center h-14 w-14 grid place-content-center text-gray-500 select-none"
                                                >
                                                    {day}
                                                </h1>
                                            );
                                        })}
                                    </div>
                                    <div className=" grid grid-cols-7 ">
                                        {generateDate(today.month(), today.year()).map(
                                            ({ date, currentMonth, today }, index) => {
                                                return (
                                                    <div
                                                        key={index}
                                                        className="p-2 text-center h-14 grid place-content-center text-sm border-t"
                                                        onClick={() => handleDayClick(date)}
                                                    >
                                                        <h1
                                                            className={cn(
                                                                currentMonth ? "" : "text-gray-400",
                                                                today
                                                                    ? "bg-yellow-500 text-white"
                                                                    : "",
                                                                selectDate
                                                                    .toDate()
                                                                    .toDateString() ===
                                                                date.toDate().toDateString()
                                                                    ? "bg-black text-white"
                                                                    : "",
                                                                "h-10 w-10 rounded-full grid place-content-center hover:bg-black hover:text-white transition-all cursor-pointer select-none"
                                                            )}
                                                            onClick={() => {
                                                                setSelectDate(date);
                                                            }}
                                                        >
                                                            {date.date()}
                                                        </h1>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>


                                </div>
                                <div className="h-96 w-96 sm:px-5">
                                    <h1 className=" font-semibold">
                                        Schedule for {selectDate.toDate().toDateString()}
                                    </h1>
                                    <p className="text-gray-400">No meetings for today.</p>
                                    <TimeSlots
                                        selectedDate={selectedDate}
                                        onTimeSelect={handleTimeSelect}/>
                                    <CommentBox setComments={setComments}/>
                                </div>
                            </div>
                                <div className="mt-4">
                                    <button
                                        className="bg-gray-300 text-gray-700 hover:bg-gray-400 font-semibold py-2 px-4 rounded-l focus:outline-none focus:shadow-outline"
                                        type="button"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="bg-gray-700 text-white hover:bg-gray-800 font-semibold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline"
                                        type="button"
                                        onClick={handleSubmit}
                                    >
                                        Confirm
                                    </button>
                                </div>
                        </div>
                    </div>
                </div>) : (
                    <div className="text-center">
                        <NavBar/>
                      {publicContent === false ? <h1 className='text-4xl'>{message.status} {message.error} </h1> : 'Error'}
                      {message && (
                        <>
                          <h3>{message.message}</h3>
                        </>
                      )}
                    </div>
                  )}
            <Footer/>
        </div>

    );
}