"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, DollarSign } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "@/lib/constants";

interface Revenue {
  _id: string;
  shift: string;
  date: string;
  amount: number;
}

interface RevenueListProps {
  cafeId: string;
}

export default function RevenueList({ cafeId }: RevenueListProps) {
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRevenues();
  }, [cafeId]);

  const fetchRevenues = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/revenue`);
      // Filter by cafeId on frontend since there's no filter endpoint
      const filtered = res.data.filter((r: any) => r.cafeId._id === cafeId);
      setRevenues(filtered);
    } catch (err) {
      console.error("Failed to fetch revenues", err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ar-EG", {
      style: "currency",
      currency: "EGP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  const getShiftLabel = (shift: string) => {
    return shift === "morning" ? "صباحي" : "مسائي";
  };

  const getShiftVariant = (shift: string) => {
    return shift === "morning" ? "default" : "secondary";
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">جاري تحميل الإيرادات...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>سجل الإيرادات</CardTitle>
      </CardHeader>
      <CardContent>
        {revenues.length === 0 ? (
          <div className="py-12 text-center">
            <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">لا توجد إيرادات مسجلة</p>
          </div>
        ) : (
          <div className="space-y-3">
            {revenues.map((revenue) => (
              <div
                key={revenue._id}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={getShiftVariant(revenue.shift)}>
                      {getShiftLabel(revenue.shift)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(revenue.date)}
                  </p>
                </div>
                <div className="text-left">
                  <p className="font-bold text-lg text-green-600 dark:text-green-400">
                    {formatCurrency(revenue.amount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}