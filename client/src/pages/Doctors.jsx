// Searching and sorting with adding new css
import React, { useEffect, useState } from "react";
import DoctorCard from "../components/DoctorCard";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../styles/doctors.css";
import fetchData from "../helper/apiCall";
import Loading from "../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../redux/reducers/rootSlice";
import Empty from "../components/Empty";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // search
  const [sortOption, setSortOption] = useState(""); // sorting
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);

  const fetchAllDocs = async () => {
    dispatch(setLoading(true));
    const data = await fetchData(`/doctor/getalldoctors`);
    setDoctors(data);
    dispatch(setLoading(false));
  };

  useEffect(() => {
    fetchAllDocs();
  }, []);

  // 1️⃣ Filter by specialization
  const filteredDoctors =
    searchTerm.trim() === ""
      ? doctors
      : doctors.filter((doc) =>
          doc.specialization.toLowerCase().includes(searchTerm.toLowerCase())
        );

  // 2️⃣ Sort the filtered doctors
  const sortedDoctors = [...filteredDoctors].sort((a, b) => {
    if (sortOption === "experienceAsc") return a.experience - b.experience;
    if (sortOption === "experienceDesc") return b.experience - a.experience;
    if (sortOption === "feesAsc") return a.fees - b.fees;
    if (sortOption === "feesDesc") return b.fees - a.fees;
    return 0; // no sorting
  });

  return (
    <>
      <Navbar />
      {loading && <Loading />}
      {!loading && (
        <section className="container doctors">
          <h2 className="page-heading">Our Doctors</h2>

          {/* 🔹 Search & Sort Container */}
          <div className="filter-bar">
            <input
              type="text"
              placeholder="Search by specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="sort-dropdown"
            >
              <option value="">Sort by</option>
              <option value="experienceAsc">Experience: Low to High</option>
              <option value="experienceDesc">Experience: High to Low</option>
              <option value="feesAsc">Fees: Low to High</option>
              <option value="feesDesc">Fees: High to Low</option>
            </select>
          </div>

          {sortedDoctors.length > 0 ? (
            <div className="doctors-card-container">
              {sortedDoctors.map((ele) => (
                <DoctorCard ele={ele} key={ele._id} />
              ))}
            </div>
          ) : (
            <Empty />
          )}
        </section>
      )}
      <Footer />
    </>
  );
};

export default Doctors;
