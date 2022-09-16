import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "bootstrap";

const pageSize = 5;

const Home = () => {
  const [users, setUser] = useState([]);
  const [paginatedUsers, setPaginatedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState([1]);

  useEffect(() => {
    loadUsers();
  }, [users]);

  useEffect(() => {
    getAllPaginatedUser();
  }, [currentPage]);

  const getAllPaginatedUser = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = currentPage * pageSize;
    const paginatedUsers = users.slice(startIndex, endIndex);
    setPaginatedUsers(paginatedUsers);
  }

  const loadUsers = async () => {
    const result = await axios.get("http://localhost:3003/users");
    setUser(result.data);
    getAllPaginatedUser();
    setTotalPage(getTotalPages(result.data.length));
  };

  const getTotalPages = (count) => {
    const total = Math.ceil((count / pageSize));
    
    const totalPages = []
    
    for(let i=0;i<total;i++){
      totalPages[i] = i+1;
    }

    return totalPages;
  }

  const deleteUser = async (id) => {
    await axios.delete(`http://localhost:3003/users/${id}`);
    await loadUsers();
    setCurrentPage(1);
  };

  const pagination = pageNo => setCurrentPage(pageNo);

  return (
    <div className="container">
      <div className="py-4">
        <h1>Books Record</h1>
        <table className="table border shadow">
          <thead className="thead-dark">
            <tr>
              <th scope="col">S. No. </th>
              <th scope="col">Book Name</th>
              {/* <th scope="col">Class</th> */}
              <th scope="col">Issue Date</th>
              <th scope="col">Book Code</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user, index) => (
              <tr key={user.id}>
                <th scope="row">{index + 1}</th>
                <td>{user.name}</td>
                {/*     <td>{user.sclass}</td> */}
                <td>{user.date}</td>
                <td>{user.code}</td>
                <td>
                  <Link className="btn btn-primary mx-2" to={`/users/${user.id}`}>
                    View
                  </Link>
                  <Link
                    className="btn btn-outline-primary mx-2"
                    to={`/users/edit/${user.id}`}
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteUser(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <nav className="d-flex justify-content-center">
          <ul className="pagination">
            {
              totalPage.map((page) => (
                <li
                  className={
                    page === currentPage ? "page-item active" : "page-item"
                  }
                  key={page}
                >
                  <p className="page-link" onClick={() => pagination(page)}>
                    {page}
                  </p>
                </li>
              ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Home;
