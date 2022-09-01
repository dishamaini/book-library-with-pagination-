import React, { useState, useEffect } from "react";
import axios from "axios";
import _ from "lodash";
import { Link } from "react-router-dom";

const pageSize = 5;
const Home = () => {
  const [users, setUser] = useState([]);
  const [paginatedUsers, setPaginatedUsers] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    //axios.get("http://localhost:3003/users").then((res) => {
    //console.log(res.data);
    //setUser(res.data);
    //setPaginatedUsers(_(res.data).slice(0).take(pageSize).value());
    //})
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const result = await axios.get("http://localhost:3003/users");
    setUser(result.data.reverse());
    setPaginatedUsers(_(result.data.reverse).slice(0).take(pageSize).value());
  };

  const deleteUser = async (id) => {
    await axios.delete(`http://localhost:3003/users/${id}`);
    loadUsers();
  };

  const pageCount = users ? Math.ceil(users.length / pageSize) : 0;
  if (pageCount === 1) return null;
  const pages = _.range(1, pageCount + 1);

  const pagination = (pageNo) => {
    setCurrentPage(pageNo);
    const startIndex = (pageNo - 1) * pageSize;
    const paginatedUsers = _(users).slice(startIndex).take(pageSize).value();
    setPaginatedUsers(paginatedUsers);
  };

  return (
    <div className="container">
      <div className="py-4">
        <h1>Books Record</h1>
        <table class="table border shadow">
          <thead class="thead-dark">
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
              <tr>
                <th scope="row">{index + 1}</th>
                <td>{user.name}</td>
                {/*     <td>{user.sclass}</td> */}
                <td>{user.date}</td>
                <td>{user.code}</td>
                <td>
                  <Link class="btn btn-primary mr-2" to={`/users/${user.id}`}>
                    View
                  </Link>
                  <Link
                    class="btn btn-outline-primary mr-2"
                    to={`/users/edit/${user.id}`}
                  >
                    Edit
                  </Link>
                  <Link
                    class="btn btn-danger"
                    onClick={() => deleteUser(user.id)}
                  >
                    Delete
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <nav className="d-flex justify-content-center">
          <ul className="pagination">
            {pages.map((page) => (
              <li
                className={
                  page === currentPage ? "page-item active" : "page-item"
                }
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
