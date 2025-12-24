"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, Activity, Coffee, ShoppingCart, Calendar, TrendingDown, Globe, PieChart } from "lucide-react";
import { BASE_URL } from "@/lib/constants";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`${BASE_URL}/dashboard`)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error(err));
  }, []);

  if (!data)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700 font-semibold">جاري التحميل...</p>
        </div>
      </div>
    );

  const getActivityColor = (index: number) => {
    const colors = [
      "from-emerald-400 to-emerald-600",
      "from-teal-400 to-teal-600",
      "from-cyan-400 to-cyan-600",
      "from-blue-400 to-blue-600",
      "from-indigo-400 to-indigo-600"
    ];
    return colors[index % colors.length];
  };

  const getMedalEmoji = (index: number) => {
    const medals = ["🥇", "🥈", "🥉"];
    return medals[index] || "🏅";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-2">
            📊 لوحة التحكم
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">نظرة شاملة على الأداء المالي</p>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue */}
          <Card className="bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-800 border-0 shadow-xl transform hover:scale-[1.02] transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-10 h-10 text-white" />
                <p className="text-white/80 text-sm">إجمالي الإيرادات</p>
              </div>
              <p className="text-4xl font-extrabold text-white">
                {data.summary?.totalRevenue.toLocaleString("ar-EG")}
              </p>
              <p className="text-white/70 text-sm mt-1">ج.م</p>
            </CardContent>
          </Card>

          {/* Net Profit */}
          <Card className="bg-gradient-to-br from-green-600 to-emerald-600 dark:from-green-700 dark:to-emerald-800 border-0 shadow-xl transform hover:scale-[1.02] transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-10 h-10 text-white" />
                <p className="text-white/80 text-sm">صافي الربح</p>
              </div>
              <p className="text-4xl font-extrabold text-white">
                {data.summary.netProfit.toLocaleString("ar-EG")}
              </p>
              <p className="text-white/70 text-sm mt-1">هامش: {data.summary.profitMargin}</p>
            </CardContent>
          </Card>

          {/* Total Purchases */}
          <Card className="bg-gradient-to-br from-orange-600 to-red-600 dark:from-orange-700 dark:to-red-800 border-0 shadow-xl transform hover:scale-[1.02] transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <ShoppingCart className="w-10 h-10 text-white" />
                <p className="text-white/80 text-sm">إجمالي المشتريات</p>
              </div>
              <p className="text-4xl font-extrabold text-white">
                {data.summary.totalPurchaseCost.toLocaleString("ar-EG")}
              </p>
              <p className="text-white/70 text-sm mt-1">ج.م</p>
            </CardContent>
          </Card>

          {/* Revenue Growth */}
          <Card className="bg-gradient-to-br from-pink-600 to-purple-600 dark:from-pink-700 dark:to-purple-800 border-0 shadow-xl transform hover:scale-[1.02] transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-10 h-10 text-white" />
                <p className="text-white/80 text-sm">نمو الإيرادات</p>
              </div>
              <p className="text-4xl font-extrabold text-white">
                {data.summary.revenueGrowth}
              </p>
              <p className="text-white/70 text-sm mt-1">مقارنة بالشهر السابق</p>
            </CardContent>
          </Card>
        </div>

        {/* Employee & Activity Revenue */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue by Activity */}
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <div className="flex items-center gap-3">
                <div className="bg-green-500 dark:bg-green-600 p-2 rounded-lg">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  الإيرادات حسب النشاط
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {data.employeeInsights.activityRevenue.map((act: any, index: number) => (
                  <div key={act.activity} className="group">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-semibold text-gray-700 dark:text-gray-200 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                        {act.activity}
                      </span>
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">
                        {act.total.toLocaleString("ar-EG")} ج.م
                      </span>
                    </div>
                    <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`absolute h-full bg-gradient-to-r ${getActivityColor(index)} rounded-full transition-all duration-1000 ease-out`}
                        style={{
                          width: `${(act.total / data.employeeInsights.totalEmployeeRevenue) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {((act.total / data.employeeInsights.totalEmployeeRevenue) * 100).toFixed(1)}% من الإجمالي
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Employees */}
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-500 dark:bg-yellow-600 p-2 rounded-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  أعلى 3 موظفين
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {data.employeeInsights.topEmployees.map((e: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl hover:from-yellow-50 hover:to-orange-50 dark:hover:from-yellow-900/30 dark:hover:to-orange-900/30 transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{getMedalEmoji(i)}</span>
                      <div>
                        <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{e.name}</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600 dark:from-yellow-400 dark:to-orange-400">
                        {e.totalRevenue.toLocaleString("ar-EG")}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">ج.م</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cafe Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Cafe Revenue by Shift */}
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20">
              <div className="flex items-center gap-3">
                <div className="bg-amber-500 dark:bg-amber-600 p-2 rounded-lg">
                  <Coffee className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  إيرادات المقهى حسب الوردية
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-4">
                <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                  {data.cafeInsights.totalCafeRevenue.toLocaleString("ar-EG")} ج.م
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">إجمالي إيرادات المقهى</p>
              </div>
              <div className="space-y-4">
                {data.cafeInsights.revenueByShift.map((shift: any, index: number) => (
                  <div key={shift.shift} className="group">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                        وردية {shift.shift === 'morning' ? 'الصباح' : shift.shift === 'evening' ? 'المساء' : shift.shift}
                      </span>
                      <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                        {shift.total.toLocaleString("ar-EG")} ج.م
                      </span>
                    </div>
                    <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`absolute h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-1000 ease-out`}
                        style={{
                          width: `${(shift.total / data.cafeInsights.totalCafeRevenue) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Revenue by Cafe */}
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500 dark:bg-blue-600 p-2 rounded-lg">
                  <Coffee className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  الإيرادات حسب المقهى
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {data.cafeInsights.revenueByCafe.map((cafe: any, index: number) => (
                  <div key={cafe.cafe} className="group">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                        {cafe.cafe}
                      </span>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {cafe.total.toLocaleString("ar-EG")} ج.م
                      </span>
                    </div>
                    <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`absolute h-full bg-gradient-to-r ${getActivityColor(index)} rounded-full transition-all duration-1000 ease-out`}
                        style={{
                          width: `${(cafe.total / data.cafeInsights.totalCafeRevenue) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Purchase Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Purchases by Category */}
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20">
              <div className="flex items-center gap-3">
                <div className="bg-red-500 dark:bg-red-600 p-2 rounded-lg">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  المشتريات حسب الفئة
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-4">
                <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                  {data.purchaseInsights.totalPurchaseCost.toLocaleString("ar-EG")} ج.م
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {data.purchaseInsights.totalPurchases} عملية شراء
                </p>
              </div>
              <div className="space-y-4">
                {data.purchaseInsights.purchasesByCategory.map((cat: any, index: number) => (
                  <div key={cat.category} className="group">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                        {cat.category}
                      </span>
                      <span className="text-lg font-bold text-red-600 dark:text-red-400">
                        {cat.total.toLocaleString("ar-EG")} ج.م
                      </span>
                    </div>
                    <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`absolute h-full bg-gradient-to-r from-red-400 to-orange-500 rounded-full transition-all duration-1000 ease-out`}
                        style={{
                          width: `${(cat.total / data.purchaseInsights.totalPurchaseCost) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Purchases by Cafe */}
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
              <div className="flex items-center gap-3">
                <div className="bg-purple-500 dark:bg-purple-600 p-2 rounded-lg">
                  <PieChart className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  المشتريات حسب المقهى
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {data.purchaseInsights.purchasesByCafe.map((cafe: any, index: number) => (
                  <div key={cafe.cafe} className="group">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                        {cafe.cafe}
                      </span>
                      <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {cafe.total.toLocaleString("ar-EG")} ج.م
                      </span>
                    </div>
                    <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`absolute h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full transition-all duration-1000 ease-out`}
                        style={{
                          width: `${(cafe.total / data.purchaseInsights.totalPurchaseCost) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

       
        {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-500 dark:bg-indigo-600 p-2 rounded-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  إحصائيات الحجوزات
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                    {data.reservationInsights.totalReservations}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">إجمالي الحجوزات</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                    {data.reservationInsights.totalGuests}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">إجمالي الضيوف</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                    {data.reservationInsights.averageAge}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">متوسط العمر</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300 lg:col-span-2">
            <CardHeader className="border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-teal-50 to-green-50 dark:from-teal-900/20 dark:to-green-900/20">
              <div className="flex items-center gap-3">
                <div className="bg-teal-500 dark:bg-teal-600 p-2 rounded-lg">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  أكثر 5 دول حجزاً
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {data.reservationInsights.topCountries.map((country: any, index: number) => (
                  <div key={country.country} className="group">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                        {country.country}
                      </span>
                      <span className="text-lg font-bold text-teal-600 dark:text-teal-400">
                        {country.count} حجز
                      </span>
                    </div>
                    <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`absolute h-full bg-gradient-to-r from-teal-400 to-green-500 rounded-full transition-all duration-1000 ease-out`}
                        style={{
                          width: `${(country.count / data.reservationInsights.totalReservations) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div> */}

        {/* {data.reservationInsights.reservationsByGender.length > 0 && (
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300 mb-8">
            <CardHeader className="border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20">
              <div className="flex items-center gap-3">
                <div className="bg-pink-500 dark:bg-pink-600 p-2 rounded-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  توزيع الحجوزات حسب الجنس
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.reservationInsights.reservationsByGender.map((gender: any, index: number) => (
                  <div key={gender.gender} className="p-4 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{gender.gender}</p>
                    <p className="text-3xl font-bold text-pink-600 dark:text-pink-400">{gender.count}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {((gender.count / data.reservationInsights.totalReservations) * 100).toFixed(1)}%
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )} */}
      </div>
    </div>
  );
}