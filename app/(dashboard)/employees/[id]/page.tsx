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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96 text-center p-8">
          <CardContent>
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-xl font-bold mb-2">الموظف غير موجود</h2>
            <p className="text-muted-foreground mb-4">
              لم يتم العثور على بيانات الموظف
            </p>
            <Button onClick={() => router.back()}>العودة</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 hover:bg-primary/10"
        >
          <ArrowLeft className="w-4 h-4 ml-2" />
          العودة للقائمة
        </Button>

        {/* Header Card */}
        <Card className="overflow-hidden border-2 shadow-lg">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background h-32"></div>
          <CardContent className="relative pt-0 pb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 -mt-16">
              <Avatar
                className="w-32 h-32 border-4 border-background shadow-xl cursor-pointer transition-transform hover:scale-105"
                onClick={() =>
                  employee.profileImage &&
                  openImageModal(employee.profileImage, employee.name)
                }
              >
                {employee.profileImage ? (
                  <AvatarImage
                    src={employee.profileImage}
                    alt={employee.name}
                  />
                ) : (
                  <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                    {employee.name.charAt(0)}
                  </AvatarFallback>
                )}
              </Avatar>

              <div className="flex-1 text-center md:text-right mt-16 md:mt-0 space-y-3">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
                  <h1 className="text-3xl font-bold">{employee.name}</h1>
                  <Badge
                    variant={
                      employee.status === "active" ? "default" : "destructive"
                    }
                    className="px-4 py-1 text-sm"
                  >
                    {employee.status === "active" ? "نشط" : "غير نشط"}
                  </Badge>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    <span>{getRoleLabel(employee.role)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span dir="ltr">{employee.phone}</span>
                  </div>
                  {employee.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{employee.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <IdCard className="w-5 h-5" />
                المعلومات الشخصية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {employee.nationalId && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <IdCard className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      الرقم القومي
                    </p>
                    <p className="font-medium">{employee.nationalId}</p>
                  </div>
                </div>
              )}

              {employee.birthdate && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <Calendar className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      تاريخ الميلاد
                    </p>
                    <p className="font-medium">{employee.birthdate}</p>
                  </div>
                </div>
              )}

              {employee.address && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">العنوان</p>
                    <p className="font-medium">{employee.address}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                <Briefcase className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">نوع الراتب</p>
                  <p className="font-medium">
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
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    تصريح العمل
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  {employee.permitInfo?.startDate &&
                    employee.permitInfo?.endDate && (
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <Calendar className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            صلاحية التصريح
                          </p>
                          <p className="font-medium">
                            من{" "}
                            {formatDateReadable(employee.permitInfo.startDate)}{" "}
                            إلى{" "}
                            {formatDateReadable(employee.permitInfo.endDate)}
                          </p>
                        </div>
                      </div>
                    )}

                  {employee.permitInfo.permitImage && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        صورة التصريح
                      </p>
                      <img
                        src={employee.permitInfo.permitImage}
                        alt="تصريح العمل"
                        className="w-full h-48 object-cover rounded-lg border-2 cursor-pointer hover:opacity-90 transition-opacity shadow-sm"
                        onClick={() =>
                          openImageModal(
                            employee.permitInfo!.permitImage!,
                            "تصريح العمل"
                          )
                        }
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
        </div>

        {/* Relatives Information */}
        {employee.relativesInfo && employee.relativesInfo.length > 0 && (
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                بيانات الأقارب
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-4">
                {employee.relativesInfo.map((relative, idx) => (
                  <div
                    key={idx}
                    className="border-2 border-muted rounded-lg p-4 space-y-2 hover:border-primary/50 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg">{relative.name}</h3>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span dir="ltr">{relative.phone}</span>
                      </p>
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{relative.typeOfRelation}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Documents */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              المستندات
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {employee.nationalIdImage && (
                <div className="group relative">
                  <div
                    className="relative overflow-hidden rounded-lg border-2 border-muted hover:border-primary transition-all cursor-pointer shadow-sm hover:shadow-md"
                    onClick={() =>
                      openImageModal(employee.nationalIdImage!, "الرقم القومي")
                    }
                  >
                    <img
                      src={employee.nationalIdImage}
                      alt="الرقم القومي"
                      className="w-full h-40 object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                  </div>
                  <p className="text-sm font-medium mt-2 text-center">
                    الرقم القومي
                  </p>
                </div>
              )}

              {employee.militaryServiceCertificateImage && (
                <div className="group relative">
                  <div
                    className="relative overflow-hidden rounded-lg border-2 border-muted hover:border-primary transition-all cursor-pointer shadow-sm hover:shadow-md"
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
                      className="w-full h-40 object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                  </div>
                  <p className="text-sm font-medium mt-2 text-center">
                    الخدمة العسكرية
                  </p>
                </div>
              )}

              {employee.permitInfo?.permitImage && (
                <div className="group relative">
                  <div
                    className="relative overflow-hidden rounded-lg border-2 border-muted hover:border-primary transition-all cursor-pointer shadow-sm hover:shadow-md"
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
                      className="w-full h-40 object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                  </div>
                  <p className="text-sm font-medium mt-2 text-center">
                    تصريح العمل
                  </p>
                </div>
              )}
            </div>

            {!employee.nationalIdImage &&
              !employee.militaryServiceCertificateImage &&
              !employee.permitInfo?.permitImage && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>لا توجد مستندات متاحة</p>
                </div>
              )}
          </CardContent>
        </Card>
      </div>

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={closeImageModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-4 flex flex-row items-center justify-between">
            <DialogTitle className="text-xl">
              {selectedImage?.title}
            </DialogTitle>
            {selectedImage && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  downloadImage(selectedImage.url, `${selectedImage.title}.jpg`)
                }
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                تحميل
              </Button>
            )}
          </DialogHeader>
          {selectedImage && (
            <div className="relative px-6 pb-6">
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
