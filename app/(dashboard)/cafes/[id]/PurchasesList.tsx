"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "@/lib/constants";

interface Purchase {
  _id: string;
  category: {
    _id: string;
    name: string;
  };
  quantity: number;
  unitPrice: number;
  totalCost: number;
  purchaseDate: string;
}

interface PurchasesListProps {
  cafeId: string;
}

export default function PurchasesList({ cafeId }: PurchasesListProps) {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchases();
  }, [cafeId]);

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/purchases/filter`, {
        params: { cafeId },
      });
      setPurchases(res.data);
    } catch (err) {
      console.error("Failed to fetch purchases", err);
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

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">جاري تحميل المشتريات...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>سجل المشتريات</CardTitle>
      </CardHeader>
      <CardContent>
        {purchases.length === 0 ? (
          <div className="py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">لا توجد مشتريات مسجلة</p>
          </div>
        ) : (
          <div className="space-y-3">
            {purchases.map((purchase) => (
              <div
                key={purchase._id}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold">{purchase.category?.name || "غير محدد"}</p>
                    <Badge variant="secondary" className="text-xs">
                      {purchase.quantity} وحدة
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(purchase.purchaseDate)} • {formatCurrency(purchase.unitPrice)} للوحدة
                  </p>
                </div>
                <div className="text-left">
                  <p className="font-bold text-lg">{formatCurrency(purchase.totalCost)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}