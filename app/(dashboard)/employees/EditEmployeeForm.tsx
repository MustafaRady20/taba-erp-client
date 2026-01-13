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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { BASE_URL } from "@/lib/constants";
import { Pencil, Save } from "lucide-react";

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
  permitInfo?: { 
    startDate?: string; 
    endDate?: string; 
    permitImage?: string;
  };
  permitStartDate?: string;
  permitEndDate?: string;
};

export default function EditEmployeeForm({
  employee,
  onUpdated,
}: {
  employee: Employee;
  onUpdated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<Employee>({
    ...employee,
    // Initialize with permitInfo dates if they exist, otherwise use direct fields
    permitStartDate: employee.permitStartDate || employee.permitInfo?.startDate || "",
    permitEndDate: employee.permitEndDate || employee.permitInfo?.endDate || "",
  });

  const [images, setImages] = useState<{
    profileImage?: File;
    nationalIdImage?: File;
    militaryServiceCertificateImage?: File;
    permitImage?: File;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();

      // Append only changed basic fields
      Object.entries(formData).forEach(([key, value]) => {
        // Skip permitInfo as we're using permitStartDate and permitEndDate directly
        if (key === 'permitInfo') return;
        
        // @ts-ignore
        if (value !== undefined && value !== null && value !== "" && value !== employee[key as keyof Employee]) {
          data.append(key, value as string);
        }
      });

      // Append updated images
      Object.entries(images).forEach(([key, file]) => {
        if (file) {
          data.append(key, file);
        }
      });

      await axios.patch(`${BASE_URL}/employees/${employee._id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      setOpen(false);
      onUpdated();
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <Pencil className="h-4 w-4 ml-2" />
          تعديل
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg">
              <Pencil className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            تعديل بيانات الموظف
          </DialogTitle>
        </DialogHeader>

        <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
          {/* Profile Image */}
          <div className="flex flex-col items-center space-y-4 pb-6 border-b border-slate-200 dark:border-slate-700">
            <Avatar className="w-32 h-32 border-4 border-slate-200 dark:border-slate-700 shadow-lg">
              {formData.profileImage ? (
                <AvatarImage src={formData.profileImage} alt={formData.name} />
              ) : (
                <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                  {formData.name.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="w-full max-w-sm">
              <Label className="text-slate-700 dark:text-slate-300 mb-2 block text-center">
                تحديث الصورة الشخصية
              </Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setImages({ ...images, profileImage: e.target.files?.[0] })
                }
                className="bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Basic Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white border-b-2 border-emerald-200 dark:border-emerald-800 pb-2">
              المعلومات الأساسية
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">
                  الاسم <span className="text-red-500">*</span>
                </Label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">
                  رقم الهاتف <span className="text-red-500">*</span>
                </Label>
                <Input
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">
                  البريد الإلكتروني
                </Label>
                <Input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">
                  تاريخ الميلاد
                </Label>
                <Input
                  type="date"
                  value={formData.birthdate || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, birthdate: e.target.value })
                  }
                  className="bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">
                  الرقم القومي
                </Label>
                <Input
                  value={formData.nationalId || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, nationalId: e.target.value })
                  }
                  className="bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">
                  العنوان
                </Label>
                <Input
                  value={formData.address || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Employment Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white border-b-2 border-blue-200 dark:border-blue-800 pb-2">
              معلومات التوظيف
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">
                  الدور الوظيفي
                </Label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value as any })
                  }
                  className="w-full p-2 border rounded-md bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="employee">موظف</option>
                  <option value="manager">مدير</option>
                  <option value="supervisor">مشرف</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">
                  الحالة
                </Label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as any })
                  }
                  className="w-full p-2 border rounded-md bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="active">نشط</option>
                  <option value="inActive">غير نشط</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">
                  نوع الراتب
                </Label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as "fixed" | "variable",
                    })
                  }
                  className="w-full p-2 border rounded-md bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="fixed">ثابت</option>
                  <option value="variable">متغير</option>
                </select>
              </div>

              {formData.type === "fixed" && (
                <div className="space-y-2">
                  <Label className="text-slate-700 dark:text-slate-300">
                    الراتب الثابت
                  </Label>
                  <Input
                    type="number"
                    value={formData.fixedSalary || 0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fixedSalary: parseFloat(e.target.value),
                      })
                    }
                    className="bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Permit Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white border-b-2 border-purple-200 dark:border-purple-800 pb-2">
              معلومات تصريح العمل
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">
                  تاريخ بداية التصريح
                </Label>
                <Input
                  type="date"
                  value={formData.permitStartDate || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, permitStartDate: e.target.value })
                  }
                  className="bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
                {(employee.permitStartDate || employee.permitInfo?.startDate) && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    التاريخ الحالي: {new Date(employee.permitStartDate || employee.permitInfo?.startDate || "").toLocaleDateString('ar-EG')}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">
                  تاريخ نهاية التصريح
                </Label>
                <Input
                  type="date"
                  value={formData.permitEndDate || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, permitEndDate: e.target.value })
                  }
                  className="bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
                {(employee.permitEndDate || employee.permitInfo?.endDate) && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    التاريخ الحالي: {new Date(employee.permitEndDate || employee.permitInfo?.endDate || "").toLocaleDateString('ar-EG')}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="text-slate-700 dark:text-slate-300">
                  صورة التصريح
                </Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setImages({ ...images, permitImage: e.target.files?.[0] })
                  }
                  className="bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
                {employee.permitInfo?.permitImage && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    يوجد صورة حالية
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white border-b-2 border-amber-200 dark:border-amber-800 pb-2">
              المستندات
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">
                  صورة الرقم القومي
                </Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setImages({ ...images, nationalIdImage: e.target.files?.[0] })
                  }
                  className="bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">
                  صورة شهادة الخدمة العسكرية
                </Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setImages({
                      ...images,
                      militaryServiceCertificateImage: e.target.files?.[0],
                    })
                  }
                  className="bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              إلغاء
            </Button>
            <Button 
              type="submit" 
              disabled={submitting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                  جاري التحديث...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 ml-2" />
                  تحديث البيانات
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}