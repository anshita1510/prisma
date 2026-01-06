"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Home from "./home/page";
import { isAuthenticated } from "../lib/authGuard";

/** Adjust this interface to match your backend user object */
interface User {
  id: string;
  email: string;
  role: string;
}

/** Adjust this interface to match your API response */
interface UsersResponse {
  users: User[];
}

export default function Page(): JSX.Element {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // 🔐 Auth check
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    // 📡 Fetch users
    const fetchUsers = async (): Promise<void> => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL as string}/api/users`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data: UsersResponse = await res.json();
        setUsers(data.users);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
  }, [router]);

  return (
    <div>
      <Home />

      {users.map((user) => (
        <p key={user.id}>
          {user.email} — {user.role}
        </p>
      ))}
    </div>
  );
}
