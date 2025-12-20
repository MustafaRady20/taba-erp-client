"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AddCafeForm from "./AddCafeForm";
import { BASE_URL } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Coffee, Building2, Loader2, Search, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type Cafe = {
  _id: string;
  name: string;
  branch: {
    _id: string;
    name: string;
  };
  description?: string;
};

export default function CafesPage() {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [filteredCafes, setFilteredCafes] = useState<Cafe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCafes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/cafes`);
      const data = await res.json();
      console.log(data)
      setCafes(data);
      setFilteredCafes(data);
    } catch (err) {
      console.error("Failed to load cafes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCafes();
  }, []);

  // Filter cafes based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCafes(cafes);
    } else {
      const filtered = cafes.filter(
        (cafe) =>
          cafe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cafe.branch?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cafe.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCafes(filtered);
    }
  }, [searchQuery, cafes]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-lg text-muted-foreground">جاري تحميل المقاهي...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                المقاهي
              </h1>
              <p className="text-muted-foreground">
                استعرض وأدر جميع المقاهي في فروعك
              </p>
            </div>
            <AddCafeForm onAdded={fetchCafes} />
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="ابحث عن مقهى أو فرع..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>

        {/* Stats Card */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Coffee className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي المقاهي</p>
                  <p className="text-2xl font-bold text-foreground">{cafes.length}</p>
                </div>
              </div>
              {searchQuery && (
                <Badge variant="secondary">
                  {filteredCafes.length} نتيجة
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        {cafes.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Coffee className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                لا توجد مقاهي حتى الآن
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                ابدأ بإضافة أول مقهى لك
              </p>
              <AddCafeForm onAdded={fetchCafes} />
            </CardContent>
          </Card>
        ) : filteredCafes.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                لا توجد نتائج
              </h3>
              <p className="text-sm text-muted-foreground">
                جرب البحث بكلمات مفتاحية أخرى
              </p>
            </CardContent>
          </Card>
        ) : (
          /* Cafes Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCafes.map((cafe) => (
              <Link
                href={`/cafes/${cafe._id}`}
                key={cafe._id}
                className="group"
              >
                <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Coffee className="h-6 w-6 text-primary" />
                      </div>
                      <ArrowLeft className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors group-hover:-translate-x-1 transform" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {cafe.name}
                    </CardTitle>
                    {cafe.description && (
                      <CardDescription className="line-clamp-2">
                        {cafe.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span>{cafe.branch?.name || "غير محدد"}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}