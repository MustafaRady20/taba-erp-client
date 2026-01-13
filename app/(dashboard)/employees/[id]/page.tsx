"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { BASE_URL } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  IdCard,
  Briefcase,
  Users,
  FileText,
  X,
  ArrowLeft,
  Download,
  CheckCircle2,
  XCircle,
  Wallet,
  Clock,
  Image as ImageIcon,
} from "lucide-react";
import { formatDateReadable } from "@/lib/utils";

interface Employee {
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
  status: "active" | "inActive";
  firstLogin: boolean;
  permitInfo?: {
    startDate?: string;
    endDate?: string;
    permitImage?: string;
  };
  relativesInfo?: {
    name: string;
    phone: string;
    typeOfRelation: string;
  }[];
  nationalIdImage?: string;
  militaryServiceCertificateImage?: string;
  profileImage?: string;
}

export default function EmployeeProfile() {
  const { id } = useParams();
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
  } | null>(null);

  useEffect(() => {
    if (!id) return;

    axios
      .get(`${BASE_URL}/employees/${id}`)
      .then((res) => setEmployee(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const openImageModal = (url: string, title: string) => {
    setSelectedImage({ url, title });
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename || "image.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  const getRoleLabel = (role: string) => {
    const roles: { [key: string]: string } = {
      employee: "موظف",
      manager: "مدير",
      supervisor: "مشرف",
    };
    return roles[role] || role;
  };

  const getRoleColor = (role: string) => {
    const colors: { [key: string]: string } = {
      employee: "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30",
      manager: "bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/30",
      supervisor: "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30",
    };
    return colors[role] || colors.employee;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-emerald-200 dark:border-emerald-800 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-emerald-600 dark:border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <Card className="w-96 text-center p-8 border-2 border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900">
          <CardContent>
            <div className="w-20 h-20 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">الموظف غير موجود</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              لم يتم العثور على بيانات الموظف
            </p>
            <Button 
              onClick={() => router.back()}
              className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700"
            >
              <ArrowLeft className="w-4 h-4 ml-2" />
              العودة
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-900 dark:text-white transition-all hover:translate-x-1"
        >
          <ArrowLeft className="w-4 h-4 ml-2" />
          العودة للقائمة
        </Button>

        {/* Header Card with Cover */}
        <Card className="overflow-hidden border-2 border-slate-200 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900">
          <div className="relative h-40 bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 dark:from-emerald-700 dark:via-cyan-700 dark:to-blue-700">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
          </div>
          <CardContent className="relative pt-0 pb-8 px-6">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 -mt-20">
              {/* Avatar */}
              <div className="relative group">
                <Avatar
                  className="w-40 h-40 border-4 border-white dark:border-slate-900 shadow-2xl cursor-pointer transition-all duration-300 group-hover:scale-105 ring-4 ring-emerald-500/20 dark:ring-emerald-400/20"
                  onClick={() =>
                    employee.profileImage &&
                    openImageModal(employee.profileImage, employee.name)
                  }
                >
                  {employee.profileImage ? (
                    <AvatarImage
                      src={employee.profileImage}
                      alt={employee.name}
                      className="object-cover"
                    />
                  ) : (
                    <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-emerald-600 to-cyan-600 text-white">
                      {employee.name.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none"></div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center lg:text-right mt-20 lg:mt-6 space-y-4 w-full">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-3 lg:gap-4">
                  <h1 className="text-4xl font-bold text-slate-900 dark:text-white bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text">
                    {employee.name}
                  </h1>
                  <div className="flex gap-2 flex-wrap justify-center lg:justify-start">
                    <Badge
                      className={`px-4 py-1.5 text-sm font-semibold border-2 ${
                        employee.status === "active"
                          ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30"
                          : "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 border-red-300 dark:border-red-500/30"
                      }`}
                    >
                      {employee.status === "active" ? (
                        <CheckCircle2 className="w-4 h-4 ml-1 inline" />
                      ) : (
                        <XCircle className="w-4 h-4 ml-1 inline" />
                      )}
                      {employee.status === "active" ? "نشط" : "غير نشط"}
                    </Badge>
                    <Badge className={`px-4 py-1.5 text-sm font-semibold border-2 ${getRoleColor(employee.role)}`}>
                      <Briefcase className="w-4 h-4 ml-1 inline" />
                      {getRoleLabel(employee.role)}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center lg:justify-start gap-4 lg:gap-6 text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full">
                    <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-medium" dir="ltr">{employee.phone}</span>
                  </div>
                  {employee.email && (
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full">
                      <Mail className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                      <span className="font-medium">{employee.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card className="shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 group">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-b border-slate-200 dark:border-slate-700">
              <CardTitle className="flex items-center gap-3 text-slate-900 dark:text-white">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg">
                  <IdCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                المعلومات الشخصية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
              {employee.nationalId && (
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/50 hover:from-slate-100 hover:to-slate-50 dark:hover:from-slate-700 dark:hover:to-slate-800 transition-all border border-slate-200 dark:border-slate-700">
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm">
                    <IdCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                      الرقم القومي
                    </p>
                    <p className="font-bold text-lg text-slate-900 dark:text-white">{employee.nationalId}</p>
                  </div>
                </div>
              )}

              {employee.birthdate && (
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/50 hover:from-slate-100 hover:to-slate-50 dark:hover:from-slate-700 dark:hover:to-slate-800 transition-all border border-slate-200 dark:border-slate-700">
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm">
                    <Calendar className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                      تاريخ الميلاد
                    </p>
                    <p className="font-bold text-lg text-slate-900 dark:text-white">{employee.birthdate}</p>
                  </div>
                </div>
              )}

              {employee.address && (
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/50 hover:from-slate-100 hover:to-slate-50 dark:hover:from-slate-700 dark:hover:to-slate-800 transition-all border border-slate-200 dark:border-slate-700">
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm">
                    <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                      العنوان
                    </p>
                    <p className="font-bold text-lg text-slate-900 dark:text-white">{employee.address}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 border-2 border-emerald-200 dark:border-emerald-700/30">
                <div className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm">
                  <Wallet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide mb-1">
                    نوع الراتب
                  </p>
                  <p className="font-bold text-xl text-emerald-800 dark:text-emerald-200">
                    {employee.type === "fixed"
                      ? `ثابت - ${employee.fixedSalary?.toLocaleString()} جنيه`
                      : "متغير"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Permit Information */}
          {employee.permitInfo &&
            (employee.permitInfo.startDate ||
              employee.permitInfo.endDate ||
              employee.permitInfo.permitImage) && (
              <Card className="shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-b border-slate-200 dark:border-slate-700">
                  <CardTitle className="flex items-center gap-3 text-slate-900 dark:text-white">
                    <div className="p-2 bg-purple-100 dark:bg-purple-500/20 rounded-lg">
                      <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    تصريح العمل
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  {employee.permitInfo?.startDate &&
                    employee.permitInfo?.endDate && (
                      <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-700/30">
                        <div className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm">
                          <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wide mb-2">
                            صلاحية التصريح
                          </p>
                          <div className="space-y-1">
                            <p className="font-bold text-sm text-purple-800 dark:text-purple-200">
                              من: {formatDateReadable(employee.permitInfo.startDate)}
                            </p>
                            <p className="font-bold text-sm text-purple-800 dark:text-purple-200">
                              إلى: {formatDateReadable(employee.permitInfo.endDate)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                  {employee.permitInfo.permitImage && (
                    <div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        صورة التصريح
                      </p>
                      <div className="relative group overflow-hidden rounded-xl border-2 border-slate-200 dark:border-slate-700">
                        <img
                          src={employee.permitInfo.permitImage}
                          alt="تصريح العمل"
                          className="w-full h-64 object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                          onClick={() =>
                            openImageModal(
                              employee.permitInfo!.permitImage!,
                              "تصريح العمل"
                            )
                          }
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                          <p className="text-white font-semibold">اضغط للتكبير</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
        </div>

        {/* Relatives Information */}
        {employee.relativesInfo && employee.relativesInfo.length > 0 && (
          <Card className="shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-b border-slate-200 dark:border-slate-700">
              <CardTitle className="flex items-center gap-3 text-slate-900 dark:text-white">
                <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                بيانات الأقارب ({employee.relativesInfo.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {employee.relativesInfo.map((relative, idx) => (
                  <div
                    key={idx}
                    className="border-2 border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-3 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">{relative.name}</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
                        <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="font-medium" dir="ltr">{relative.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
                        <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="font-medium">{relative.typeOfRelation}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Documents */}
        <Card className="shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-b border-slate-200 dark:border-slate-700">
            <CardTitle className="flex items-center gap-3 text-slate-900 dark:text-white">
              <div className="p-2 bg-amber-100 dark:bg-amber-500/20 rounded-lg">
                <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              المستندات والوثائق
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {employee.nationalIdImage && (
                <div className="group relative">
                  <div
                    className="relative overflow-hidden rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all cursor-pointer shadow-md hover:shadow-xl"
                    onClick={() =>
                      openImageModal(employee.nationalIdImage!, "الرقم القومي")
                    }
                  >
                    <img
                      src={employee.nationalIdImage}
                      alt="الرقم القومي"
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-white font-bold text-sm">اضغط للتكبير</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm font-bold mt-2 text-center text-slate-900 dark:text-white">
                    الرقم القومي
                  </p>
                </div>
              )}

              {employee.militaryServiceCertificateImage && (
                <div className="group relative">
                  <div
                    className="relative overflow-hidden rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer shadow-md hover:shadow-xl"
                    onClick={() =>
                      openImageModal(
                        employee.militaryServiceCertificateImage!,
                        "شهادة الخدمة العسكرية"
                      )
                    }
                  >
                    <img
                      src={employee.militaryServiceCertificateImage}
                      alt="الخدمة العسكرية"
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-white font-bold text-sm">اضغط للتكبير</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm font-bold mt-2 text-center text-slate-900 dark:text-white">
                    الخدمة العسكرية
                  </p>
                </div>
              )}

              {employee.permitInfo?.permitImage && (
                <div className="group relative">
                  <div
                    className="relative overflow-hidden rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-600 transition-all cursor-pointer shadow-md hover:shadow-xl"
                    onClick={() =>
                      openImageModal(
                        employee.permitInfo!.permitImage!,
                        "تصريح العمل"
                      )
                    }
                  >
                    <img
                      src={employee.permitInfo.permitImage}
                      alt="تصريح العمل"
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-white font-bold text-sm">اضغط للتكبير</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm font-bold mt-2 text-center text-slate-900 dark:text-white">
                    تصريح العمل
                  </p>
                </div>
              )}
            </div>

            {!employee.nationalIdImage &&
              !employee.militaryServiceCertificateImage &&
              !employee.permitInfo?.permitImage && (
                <div className="text-center py-12 bg-slate-50 dark:bg-slate-800 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700">
                  <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">لا توجد مستندات متاحة</p>
                </div>
              )}
          </CardContent>
        </Card>
      </div>

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={closeImageModal}>
        <DialogContent className="max-w-5xl max-h-[95vh] p-0 overflow-hidden bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800">
          <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg">
                  <ImageIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                {selectedImage?.title}
              </DialogTitle>
              {selectedImage && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    downloadImage(selectedImage.url, `${selectedImage.title}.jpg`)
                  }
                  className="flex items-center gap-2 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                >
                  <Download className="w-4 h-4" />
                  تحميل
                </Button>
              )}
            </div>
          </DialogHeader>
          {selectedImage && (
            <div className="relative px-6 pb-6 bg-slate-50 dark:bg-slate-900">
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="w-full h-auto max-h-[75vh] object-contain rounded-xl shadow-2xl"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}