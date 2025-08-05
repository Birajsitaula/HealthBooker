import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "./Loading";
import { setLoading } from "../redux/reducers/rootSlice";
import { useDispatch, useSelector } from "react-redux";
import Empty from "./Empty";
import fetchData from "../helper/apiCall";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("firstname"); // algorithm for sorting
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.root);

  // Fetch all users
  const getAllUsers = async () => {
    try {
      dispatch(setLoading(true));
      const temp = await fetchData(`/user/getallusers`);
      setUsers(temp);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      toast.error("Unable to fetch users");
    }
  };

  // Delete user algorithm
  const deleteUser = async (userId, isDoctor) => {
    try {
      // Algorithm: Prevent deleting doctors directly
      if (isDoctor) {
        const confirm = window.confirm(
          "This user is a doctor. Are you sure you want to delete?"
        );
        if (!confirm) return;
      } else {
        const confirm = window.confirm("Are you sure you want to delete?");
        if (!confirm) return;
      }

      await toast.promise(
        axios.delete("/user/deleteuser", {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          data: { userId },
        }),
        {
          pending: "Deleting user...",
          success: "User deleted successfully",
          error: "Unable to delete user",
        }
      );

      getAllUsers();
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  // Search Algorithm (Linear Search)
  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      `${user.firstname} ${user.lastname} ${user.email}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  // Sorting Algorithm
  const sortedUsers = useMemo(() => {
    const usersCopy = [...filteredUsers];
    usersCopy.sort((a, b) => {
      if (sortType === "firstname")
        return a.firstname.localeCompare(b.firstname);
      if (sortType === "lastname") return a.lastname.localeCompare(b.lastname);
      if (sortType === "email") return a.email.localeCompare(b.email);
      return 0;
    });
    return usersCopy;
  }, [filteredUsers, sortType]);

  useEffect(() => {
    getAllUsers();
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

          <h3 className="home-sub-heading">All Users</h3>

          {/* Search and Sort */}
          <div style={{ marginBottom: "15px" }}>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: "8px",
                marginRight: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              style={{ padding: "8px", borderRadius: "4px" }}
            >
              <option value="firstname">Sort by First Name</option>
              <option value="lastname">Sort by Last Name</option>
              <option value="email">Sort by Email</option>
            </select>
          </div>

          {sortedUsers.length > 0 ? (
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
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Is Doctor</th>
                    <th>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedUsers.map((ele, i) => (
                    <tr key={ele?._id}>
                      <td>{i + 1}</td>
                      <td>
                        <img
                          className="user-table-pic"
                          src={ele?.pic}
                          alt={ele?.firstname}
                        />
                      </td>
                      <td>{ele?.firstname}</td>
                      <td>{ele?.lastname}</td>
                      <td>{ele?.email}</td>
                      <td>{ele?.mobile}</td>
                      <td>{ele?.age}</td>
                      <td>{ele?.gender}</td>
                      <td>{ele?.isDoctor ? "Yes" : "No"}</td>
                      <td className="select">
                        <button
                          className="btn user-btn"
                          onClick={() => deleteUser(ele?._id, ele?.isDoctor)}
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

export default Users;
