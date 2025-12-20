"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { BASE_URL } from "@/lib/constants";

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

export default function EditEmployeeForm({
  employee,
  onUpdated,
}: {
  employee: Employee;
  onUpdated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Employee>(employee);
  const [images, setImages] = useState<{
    profileImage?: File;
    nationalIdImage?: File;
    militaryServiceCertificateImage?: File;
    permitImage?: File;
  }>({});

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const data = new FormData();

    // Append only changed fields
    Object.entries(formData).forEach(([key, value]) => {
      // @ts-ignore
      if (value !== undefined && value !== employee[key as keyof Employee]) {
        data.append(key, value as string);
      }
    });

    // Append updated images
    Object.entries(images).forEach(([key, file]) => {
      if (file) data.append(key, file);
    });

    await axios.patch(`${BASE_URL}/employees/${employee._id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setOpen(false);
    onUpdated();
  } catch (error) {
    console.error(error);
  }
};


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          تعديل
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle>تعديل بيانات الموظف</DialogTitle>
        </DialogHeader>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4" onSubmit={handleSubmit}>
          {/* Profile Image */}
          <div className="flex flex-col items-center md:col-span-2">
            <Avatar className="w-32 h-32">
              {formData.profileImage ? (
                <AvatarImage src={formData.profileImage} alt={formData.name} />
              ) : (
                <AvatarFallback>{formData.name.charAt(0)}</AvatarFallback>
              )}
            </Avatar>
            <Input
              type="file"
              accept="image/*"
              className="mt-2"
              onChange={(e) => setImages({ ...images, profileImage: e.target.files?.[0] })}
            />
          </div>

          {/* Basic Info */}
          <div className="flex flex-col">
            <Label>الاسم</Label>
            <Input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="flex flex-col">
            <Label>رقم الهاتف</Label>
            <Input
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="flex flex-col">
            <Label>البريد الإلكتروني</Label>
            <Input
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="flex flex-col">
            <Label>تاريخ الميلاد</Label>
            <Input
              type="date"
              value={formData.birthdate || ""}
              onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
            />
          </div>

          <div className="flex flex-col">
            <Label>الرقم القومي</Label>
            <Input
              value={formData.nationalId}
              onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
            />
          </div>

          <div className="flex flex-col">
            <Label>العنوان</Label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          {/* Role */}
          <div className="flex flex-col">
            <Label>الدور الوظيفي</Label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
              className="w-full p-2 border rounded-md"
            >
              <option value="employee">موظف</option>
              <option value="manager">مدير</option>
              <option value="supervisor">مشرف</option>
            </select>
          </div>

          {/* Status */}
          <div className="flex flex-col">
            <Label>الحالة</Label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full p-2 border rounded-md"
            >
              <option value="active">نشط</option>
              <option value="inActive">غير نشط</option>
            </select>
          </div>

          {/* Salary Type */}
          <div className="flex flex-col">
            <Label>نوع الراتب</Label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value as "fixed" | "variable" })
              }
              className="w-full p-2 border rounded-md"
            >
              <option value="fixed">ثابت</option>
              <option value="variable">متغير</option>
            </select>
          </div>

          {formData.type === "fixed" && (
            <div className="flex flex-col">
              <Label>الراتب الثابت</Label>
              <Input
                type="number"
                value={formData.fixedSalary || 0}
                onChange={(e) =>
                  setFormData({ ...formData, fixedSalary: parseFloat(e.target.value) })
                }
              />
            </div>
          )}

          {/* Permit Image */}
          <div className="flex flex-col">
            <Label>تصريح العمل - الصورة</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImages({ ...images, permitImage: e.target.files?.[0] })}
            />
          </div>

          {/* National ID Image */}
          <div className="flex flex-col">
            <Label>صورة الرقم القومي</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImages({ ...images, nationalIdImage: e.target.files?.[0] })}
            />
          </div>

          {/* Military Service */}
          <div className="flex flex-col">
            <Label>صورة شهادة الخدمة العسكرية</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImages({ ...images, militaryServiceCertificateImage: e.target.files?.[0] })
              }
            />
          </div>

          <div className="col-span-1 md:col-span-2 mt-4">
            <Button type="submit" className="w-full">
              تحديث
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
