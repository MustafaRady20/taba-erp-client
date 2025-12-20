"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import CheckIn from "./checkin";
import AttendanceTable from "./attendanceTable";
import { useCurrentUser } from "@/hooks/current-user";
import { BASE_URL } from "@/lib/constants";
import { Input } from "@/components/ui/input";

type AttendanceRecord = {
  employeeId: { _id: string; name: string };
  checkInTime: string;
  checkOutTime: string | null;
  totalHours: number;
};

export default function EmployeeAttendancePage() {
  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState<string>(today);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [message, setMessage] = useState<string>("");

  const { role } = useCurrentUser();

  const fetchAttendance = async (selectedDate: string) => {
    try {
      const endpoint =
        role === "employee"
          ? `${BASE_URL}/attendance/today`
          : `${BASE_URL}/attendance/by-date?date=${selectedDate}`;

      const { data } = await axios.get(endpoint);
      setAttendance(data);
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "");
    }
  };

  useEffect(() => {
    if (role) {
      fetchAttendance(date);
    }
  }, [date, role]);

  if (!role) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {role !== "employee" && (
        <div className="w-full sm:w-1/4">
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      )}

      {role === "employee" ? (
        <CheckIn attendance={attendance || []} />
      ) : (
        <AttendanceTable attendance={attendance || []} />
      )}

      {message && (
        <p className="text-red-500 text-sm">{message}</p>
      )}
    </div>
  );
}
