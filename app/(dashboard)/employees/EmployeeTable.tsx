"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import EditEmployeeForm from "./EditEmployeeForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import axios from "axios";
import { BASE_URL } from "@/lib/constants";
import { Trash2 } from "lucide-react";

export type Employee = {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  role: "employee" | "manager" | "supervisor";
  type: "fixed" | "variable";
  fixedSalary?: number;
  birthdate?: string;
  nationalId?: string;
  address?: string;
  status?: "active" | "inActive";
  profileImage?: string;
  nationalIdImage?: string;
  militaryServiceCertificateImage?: string;
  permitInfo?: { startDate?: string; endDate?: string; permitImage?: string };
};

interface EmployeesTableProps {
  employees: Employee[];
  onRefresh: () => void;
}

export default function EmployeesTable({ employees, onRefresh }: EmployeesTableProps) {
  const [search, setSearch] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setFilteredEmployees(
      employees.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search, employees]);

  const formatPhoneForWhatsApp = (phone: string) => phone.replace(/[^0-9]/g, "");

  const handleDelete = async () => {
    if (!selectedEmployee) return;
    setDeleting(true);
    try {
      await axios.delete(`${BASE_URL}/employees/${selectedEmployee._id}`);
      onRefresh();
      setSelectedEmployee(null);
    } catch (error) {
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <Input
        placeholder="ابحث عن موظف..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-1/3"
      />

      <Table className="min-w-full border">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center w-[15%]">الاسم</TableHead>
            <TableHead className="text-center w-[15%]">رقم الهاتف</TableHead>
            <TableHead className="text-center w-[20%]">البريد الإلكتروني</TableHead>
            <TableHead className="text-center w-[10%]">الدور</TableHead>
            <TableHead className="text-center w-[15%]">تعديل</TableHead>
            <TableHead className="text-center w-[10%]">حذف</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredEmployees.map((employee) => (
            <TableRow key={employee._id}>
              <TableCell className="text-center truncate">
                <Link href={`/employees/${employee._id}`} className="text-blue-600 hover:underline">
                  {employee.name}
                </Link>
              </TableCell>

              <TableCell className="text-center truncate">
                <a
                  href={`https://wa.me/${formatPhoneForWhatsApp(employee.phone)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:underline"
                >
                  {employee.phone}
                </a>
              </TableCell>

              <TableCell className="text-center truncate">{employee.email || "-"}</TableCell>

              <TableCell className="text-center truncate">
                {employee.role === "employee" ? "موظف" : employee.role === "manager" ? "مدير" : "مشرف"}
              </TableCell>

              <TableCell className="text-center">
                <EditEmployeeForm employee={employee} onUpdated={onRefresh} />
              </TableCell>

              <TableCell className="text-center">
                <Button
                  variant="ghost"
                  className="text-red-600 p-1"
                  onClick={() => setSelectedEmployee(employee)}
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Confirmation Dialog */}
      <Dialog open={!!selectedEmployee} onOpenChange={() => setSelectedEmployee(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
          </DialogHeader>
          <p className="my-2">
            هل أنت متأكد أنك تريد حذف الموظف{" "}
            <span className="font-bold">{selectedEmployee?.name}</span>؟
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setSelectedEmployee(null)}>
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "جاري الحذف..." : "حذف"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
