import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "./Loading";
import { setLoading } from "../redux/reducers/rootSlice";
import { useDispatch, useSelector } from "react-redux";
import Empty from "./Empty";
import fetchData from "../helper/apiCall";
import { useNavigate } from "react-router-dom";
import "../styles/user.css";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // search state
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);
  const navigate = useNavigate();

  // Sorting Algorithm: sort by experience (descending)
  const sortDoctorsByExperience = (list) => {
    return list.sort((a, b) => (b.experience || 0) - (a.experience || 0));
  };

  // Fetch all doctors and sort
  const getAllDoctors = async () => {
    try {
      dispatch(setLoading(true));
      const temp = await fetchData(`/doctor/getalldoctors`);
      const sortedDoctors = sortDoctorsByExperience(temp); // Apply sorting algorithm
      setDoctors(sortedDoctors);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      toast.error("Failed to fetch doctors");
    }
  };

  // Delete doctor
  const deleteUser = async (userId) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this doctor?"
      );
      if (confirmDelete) {
        await toast.promise(
          axios.put(
            "/doctor/deletedoctor",
            { userId },
            {
              headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          ),
          {
            success: "Doctor deleted successfully",
            error: "Unable to delete doctor",
            loading: "Deleting doctor...",
          }
        );
        getAllDoctors(); // Refresh after deletion
      }
    } catch (error) {
      toast.error("Error deleting doctor");
    }
  };

  // Search Algorithm: filter doctors based on multiple fields
  const filteredDoctors = doctors.filter((doc) => {
    const term = searchTerm.toLowerCase();
    return (
      doc?.userId?.firstname?.toLowerCase().includes(term) ||
      doc?.userId?.lastname?.toLowerCase().includes(term) ||
      doc?.userId?.email?.toLowerCase().includes(term) ||
      doc?.specialization?.toLowerCase().includes(term)
    );
  });

  // Fetch doctors on component mount
  useEffect(() => {
    getAllDoctors();
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <section className="user-section">
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="btn back-home-btn"
            style={{
              alignSelf: "flex-start",
              marginBottom: "10px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              padding: "6px 12px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            aria-label="Back to homepage"
          >
            ← Back to Homepage
          </button>

          <h3 className="home-sub-heading">
            All Doctors (Sorted & Searchable)
          </h3>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search by name, email, or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              marginBottom: "15px",
              padding: "6px 12px",
              width: "50%",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />

          {filteredDoctors.length > 0 ? (
            <div className="user-container">
              <table>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Pic</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Mobile No.</th>
                    <th>Experience (Years)</th>
                    <th>Specialization</th>
                    <th>Fees</th>
                    <th>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDoctors.map((ele, i) => (
                    <tr key={ele?._id}>
                      <td>{i + 1}</td>
                      <td>
                        <img
                          className="user-table-pic"
                          src={ele?.userId?.pic}
                          alt={ele?.userId?.firstname}
                        />
                      </td>
                      <td>{ele?.userId?.firstname}</td>
                      <td>{ele?.userId?.lastname}</td>
                      <td>{ele?.userId?.email}</td>
                      <td>{ele?.userId?.mobile}</td>
                      <td>{ele?.experience || 0}</td>
                      <td>{ele?.specialization}</td>
                      <td>{ele?.fees}</td>
                      <td className="select">
                        <button
                          className="btn user-btn"
                          onClick={() => deleteUser(ele?.userId?._id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty />
          )}
        </section>
      )}
    </>
  );
};

export default AdminDoctors;
