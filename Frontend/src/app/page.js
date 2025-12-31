"use client";

import Home from "../app/home/page";
import { useEffect, useState } from "react";

export default function page() {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`)
      .then((res) => res.json())
      .then((data) => setUsers(data.users))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <Home></Home>
      {users.map((user, index) => (
        <p key={index}>{user}</p>
      ))}
    </div>
  );
}
