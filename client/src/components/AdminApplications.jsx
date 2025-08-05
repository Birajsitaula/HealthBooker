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

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("none");
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);
  const navigate = useNavigate();

  const getAllApp = async () => {
    try {
      dispatch(setLoading(true));
      const temp = await fetchData(`/doctor/getnotdoctors`);
      setApplications(temp);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      toast.error("Failed to fetch applications");
    }
  };

  const acceptUser = async (userId) => {
    try {
      const confirm = window.confirm("Are you sure you want to accept?");
      if (confirm) {
        await toast.promise(
          axios.put(
            "/doctor/acceptdoctor",
            { id: userId },
            {
              headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          ),
          {
            success: "Application accepted",
            error: "Unable to accept application",
            loading: "Accepting application...",
          }
        );
        getAllApp();
      }
    } catch (error) {
      toast.error("Error accepting application");
    }
  };

  const deleteUser = async (userId) => {
    try {
      const confirm = window.confirm("Are you sure you want to delete?");
      if (confirm) {
        await toast.promise(
          axios.put(
            "/doctor/rejectdoctor",
            { id: userId },
            {
              headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          ),
          {
            success: "Application rejected",
            error: "Unable to reject application",
            loading: "Rejecting application...",
          }
        );
        getAllApp();
      }
    } catch (error) {
      toast.error("Error rejecting application");
    }
  };

  // Search algorithm: filter by name, email, specialization
  const filteredApplications = applications.filter((ele) => {
    const term = searchTerm.toLowerCase();
    return (
      ele?.userId?.firstname?.toLowerCase().includes(term) ||
      ele?.userId?.lastname?.toLowerCase().includes(term) ||
      ele?.userId?.email?.toLowerCase().includes(term) ||
      ele?.specialization?.toLowerCase().includes(term)
    );
  });

  // Sorting algorithm
  const sortedApplications = [...filteredApplications].sort((a, b) => {
    if (sortBy === "experience") return b.experience - a.experience;
    if (sortBy === "fees") return a.fees - b.fees;
    if (sortBy === "name") {
      const nameA = a.userId.firstname.toLowerCase();
      const nameB = b.userId.firstname.toLowerCase();
      return nameA.localeCompare(nameB);
    }
    return 0; // no sorting
  });

  // Highlight rows with experience > 10 years
  const highlightRow = (ele) =>
    ele.experience > 10 ? { backgroundColor: "#d4edda" } : {};

  useEffect(() => {
    getAllApp();
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <section className="user-section">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
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
            ← Back
          </button>

          <h3 className="home-sub-heading">All Applications</h3>

          {/* Search and Sort Controls */}
          <div style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
            <input
              type="text"
              placeholder="Search by name, email or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                padding: "6px 12px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: "6px 12px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            >
              <option value="none">Sort by</option>
              <option value="experience">Experience (High to Low)</option>
              <option value="fees">Fees (Low to High)</option>
              <option value="name">Name (A to Z)</option>
            </select>
          </div>

          {sortedApplications.length > 0 ? (
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
                    <th>Experience</th>
                    <th>Specialization</th>
                    <th>Fees</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedApplications.map((ele, i) => (
                    <tr key={ele?._id} style={highlightRow(ele)}>
                      <td>{i + 1}</td>
                      <td>
                        <img
                          className="user-table-pic"
                          src={
                            ele?.userId?.pic ||
                            "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                          }
                          alt={ele?.userId?.firstname}
                        />
                      </td>
                      <td>{ele?.userId?.firstname}</td>
                      <td>{ele?.userId?.lastname}</td>
                      <td>{ele?.userId?.email}</td>
                      <td>{ele?.userId?.mobile}</td>
                      <td>{ele?.experience}</td>
                      <td>{ele?.specialization}</td>
                      <td>{ele?.fees}</td>
                      <td className="select">
                        <button
                          className="btn user-btn accept-btn"
                          onClick={() => acceptUser(ele?.userId?._id)}
                        >
                          Accept
                        </button>
                        <button
                          className="btn user-btn"
                          onClick={() => deleteUser(ele?.userId?._id)}
                        >
                          Reject
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

export default AdminApplications;
