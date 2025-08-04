//update the Book Appointment

import React, { useState } from "react";
import "../styles/bookappointment.css";
import axios from "axios";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io";

const BookAppointment = ({ setModalOpen, ele }) => {
  const [formDetails, setFormDetails] = useState({
    date: "",
    time: "",
  });

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails((prev) => ({ ...prev, [name]: value }));
  };

  const bookAppointment = async (e) => {
    e.preventDefault();

    if (!formDetails.date || !formDetails.time) {
      toast.error("Please select both date and time.");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(formDetails.date);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      toast.error("You cannot book an appointment for a past date.");
      return;
    }

    try {
      await toast.promise(
        axios.post(
          "/appointment/bookappointment",
          {
            doctorId: ele?.userId?._id,
            date: formDetails.date,
            time: formDetails.time,
            doctorname: `${ele?.userId?.firstname} ${ele?.userId?.lastname}`,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
        {
          loading: "Booking appointment...",
          success: "Appointment booked successfully!",
          error: "Failed to book appointment.",
        }
      );
      setModalOpen(false);
    } catch {
      toast.error("Error booking appointment. Please try again.");
    }
  };

  return (
    <div className="modal flex-center">
      <div className="modal__content">
        <h2 className="page-heading">Book Appointment</h2>
        <IoMdClose onClick={() => setModalOpen(false)} className="close-btn" />

        <div className="register-container flex-center book">
          <form className="register-form" onSubmit={bookAppointment}>
            <input
              type="date"
              name="date"
              className="form-input"
              value={formDetails.date}
              onChange={inputChange}
              min={new Date().toISOString().split("T")[0]} // disable past dates
            />
            <input
              type="time"
              name="time"
              className="form-input"
              value={formDetails.time}
              onChange={inputChange}
            />
            <button type="submit" className="btn form-btn">
              Book
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
