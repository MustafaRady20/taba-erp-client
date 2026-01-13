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
import axios from "axios";
import { BASE_URL } from "@/lib/constants";
import { Plus, UserPlus } from "lucide-react";

interface AddEmployeeFormProps {
  onAdded: () => void;
}

export default function AddEmployeeForm({ onAdded }: AddEmployeeFormProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    role: "employee",
    type: "fixed" as "fixed" | "variable",
    fixedSalary: 0,
    birthdate: "",
    nationalId: "",
    address: "",
    status: "active",
    permitStartDate: "",
    permitEndDate: "",
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

      // Append basic form data
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "")
          data.append(key, value as string);
      });

      // Append images
      Object.entries(images).forEach(([key, file]) => {
        if (file) {
          data.append(key, file);
        }
      });

      await axios.post(`${BASE_URL}/employees`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Reset form
      setOpen(false);
      setFormData({
        name: "",
        phone: "",
        email: "",
        role: "employee",
        type: "fixed",
        fixedSalary: 0,
        birthdate: "",
        nationalId: "",
        address: "",
        status: "active",
        permitStartDate: "",
        permitEndDate: "",
      });
      setImages({});
      onAdded();
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white shadow-lg">
          <UserPlus className="w-4 h-4 ml-2" />
          إضافة موظف
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg">
              <UserPlus className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            إضافة موظف جديد
          </DialogTitle>
        </DialogHeader>

        <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
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
                  placeholder="أدخل الاسم"
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
                  placeholder="أدخل رقم الهاتف"
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
                  placeholder="أدخل البريد الإلكتروني"
                  type="email"
                  value={formData.email}
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
                  value={formData.birthdate}
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
                  placeholder="أدخل الرقم القومي"
                  value={formData.nationalId}
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
                  placeholder="أدخل العنوان"
                  value={formData.address}
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
                    setFormData({ ...formData, role: e.target.value })
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
                  نوع الراتب <span className="text-red-500">*</span>
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
                    placeholder="أدخل الراتب الثابت"
                    value={formData.fixedSalary}
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

              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">
                  الحالة
                </Label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full p-2 border rounded-md bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="active">نشط</option>
                  <option value="inActive">غير نشط</option>
                </select>
              </div>
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
                  value={formData.permitStartDate}
                  onChange={(e) =>
                    setFormData({ ...formData, permitStartDate: e.target.value })
                  }
                  className="bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">
                  تاريخ نهاية التصريح
                </Label>
                <Input
                  type="date"
                  value={formData.permitEndDate}
                  onChange={(e) =>
                    setFormData({ ...formData, permitEndDate: e.target.value })
                  }
                  className="bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
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
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white border-b-2 border-amber-200 dark:border-amber-800 pb-2">
              الصور والمستندات
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">
                  الصورة الشخصية
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

              <div className="space-y-2 md:col-span-2">
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
              className="flex-1 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                  جاري الإضافة...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة الموظف
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}