import React, { useState, useEffect, useRef } from "react";
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

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const previousAppointments = useRef([]); // Track old appointments
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);
  const navigate = useNavigate();

  // Convert date+time to Date object
  const parseDateTime = (date, time) => new Date(`${date}T${time}`);

  // Priority Sorting Algorithm
  const sortByPriority = (list) => {
    return list.sort((a, b) => {
      // Completed last
      if (a.status === "Completed" && b.status !== "Completed") return 1;
      if (b.status === "Completed" && a.status !== "Completed") return -1;

      const dateA = parseDateTime(a.date, a.time);
      const dateB = parseDateTime(b.date, b.time);
      return dateA - dateB;
    });
  };

  // Fetch all appointments
  const getAllAppoint = async (showNotification = false) => {
    try {
      dispatch(setLoading(true));
      const temp = await fetchData(`/appointment/getallappointments`);
      const sortedData = sortByPriority(temp);

      // Real-Time Notification Algorithm: Detect New Appointments
      if (showNotification && previousAppointments.current.length > 0) {
        const oldIds = previousAppointments.current.map((a) => a._id);
        const newAppointments = sortedData.filter(
          (a) => !oldIds.includes(a._id)
        );
        if (newAppointments.length > 0) {
          toast.success(
            `🔔 ${newAppointments.length} new appointment(s) added!`
          );
        }
      }

      previousAppointments.current = sortedData;
      setAppointments(sortedData);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      toast.error("Failed to fetch appointments");
    }
  };

  const complete = async (ele) => {
    try {
      await toast.promise(
        axios.put(
          "/appointment/completed",
          {
            appointid: ele?._id,
            doctorId: ele?.doctorId._id,
            doctorname: `${ele?.userId?.firstname} ${ele?.userId?.lastname}`,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
        {
          success: "Appointment marked as completed",
          error: "Unable to complete appointment",
          loading: "Updating appointment...",
        }
      );
      getAllAppoint();
    } catch (error) {
      toast.error("Error completing appointment");
    }
  };

  // Search + Filter Algorithm
  const filteredAppointments = appointments.filter((ele) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      ele?.doctorId?.firstname?.toLowerCase().includes(term) ||
      ele?.doctorId?.lastname?.toLowerCase().includes(term) ||
      ele?.userId?.firstname?.toLowerCase().includes(term) ||
      ele?.userId?.lastname?.toLowerCase().includes(term);

    const matchesStatus =
      statusFilter === "All" || ele?.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Highlight Algorithm
  const highlightRow = (ele) => {
    const now = new Date();
    const appointTime = parseDateTime(ele.date, ele.time);
    const diffHours = (appointTime - now) / (1000 * 60 * 60);

    if (diffHours > 0 && diffHours <= 24 && ele.status !== "Completed") {
      return { backgroundColor: "#fff3cd" }; // yellow highlight
    }
    return {};
  };

  useEffect(() => {
    getAllAppoint();

    // Auto-refresh algorithm: refresh every 30 seconds with notification
    const interval = setInterval(() => {
      getAllAppoint(true);
    }, 30000); // 30 seconds

    return () => clearInterval(interval); // Cleanup
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
          >
            ← Back to Homepage
          </button>

          <h3 className="home-sub-heading">All Appointments</h3>

          {/* Search + Status Filter */}
          <div style={{ marginBottom: "15px" }}>
            <input
              type="text"
              placeholder="Search by doctor or patient name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                marginRight: "10px",
                padding: "6px 12px",
                width: "50%",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: "6px 12px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {filteredAppointments.length > 0 ? (
            <div className="user-container">
              <table>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Doctor</th>
                    <th>Patient</th>
                    <th>Appointment Date</th>
                    <th>Appointment Time</th>
                    <th>Booking Date</th>
                    <th>Booking Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((ele, i) => (
                    <tr key={ele?._id} style={highlightRow(ele)}>
                      <td>{i + 1}</td>
                      <td>
                        {ele?.doctorId?.firstname +
                          " " +
                          ele?.doctorId?.lastname}
                      </td>
                      <td>
                        {ele?.userId?.firstname + " " + ele?.userId?.lastname}
                      </td>
                      <td>{ele?.date}</td>
                      <td>{ele?.time}</td>
                      <td>{ele?.createdAt.split("T")[0]}</td>
                      <td>{ele?.updatedAt.split("T")[1].split(".")[0]}</td>
                      <td>{ele?.status}</td>
                      <td>
                        <button
                          className={`btn user-btn accept-btn ${
                            ele?.status === "Completed" ? "disable-btn" : ""
                          }`}
                          disabled={ele?.status === "Completed"}
                          onClick={() => complete(ele)}
                        >
                          Complete
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

export default AdminAppointments;
