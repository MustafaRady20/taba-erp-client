"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Loader2, Plus } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "@/lib/constants";

interface Category {
  _id: string;
  name: string;
}

interface AddPurchaseDialogProps {
  cafeId: string;
  branchId: string;
  onAdded: () => void;
}

export default function AddPurchaseDialog({ cafeId, branchId, onAdded }: AddPurchaseDialogProps) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    quantity: "",
    unitPrice: "",
    purchaseDate: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await axios.get(`${BASE_URL}/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category || !formData.quantity || !formData.unitPrice) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setLoading(true);
    try {
      const totalCost = parseFloat(formData.quantity) * parseFloat(formData.unitPrice);
      
      await axios.post(`${BASE_URL}/purchases`, {
        cafeId,
        branchId,
        category: formData.category,
        quantity: parseFloat(formData.quantity),
        unitPrice: parseFloat(formData.unitPrice),
        totalCost,
        purchaseDate: new Date(formData.purchaseDate),
      });

      setFormData({
        category: "",
        quantity: "",
        unitPrice: "",
        purchaseDate: new Date().toISOString().split('T')[0],
      });
      setOpen(false);
      onAdded();
    } catch (err) {
      console.error("Failed to add purchase", err);
      alert("فشل في إضافة المشترى");
    } finally {
      setLoading(false);
    }
  };

  const totalCost = formData.quantity && formData.unitPrice 
    ? (parseFloat(formData.quantity) * parseFloat(formData.unitPrice)).toFixed(2)
    : "0.00";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full gap-2" size="lg">
          <ShoppingCart className="h-5 w-5" />
          إضافة مشترى
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>إضافة مشترى جديد</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="category">التصنيف *</Label>
            {loadingCategories ? (
              <div className="flex items-center justify-center p-3 border rounded-md">
                <Loader2 className="h-4 w-4 animate-spin ml-2" />
                <span className="text-sm text-muted-foreground">جاري التحميل...</span>
              </div>
            ) : (
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                required
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="اختر التصنيف" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">الكمية *</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unitPrice">سعر الوحدة *</Label>
              <Input
                id="unitPrice"
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0.00"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchaseDate">تاريخ الشراء *</Label>
            <Input
              id="purchaseDate"
              type="date"
              required
              value={formData.purchaseDate}
              onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
            />
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">إجمالي التكلفة:</span>
              <span className="text-lg font-bold">{totalCost} ج.م</span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                  جاري الإضافة...
                </>
              ) : (
                "إضافة المشترى"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              إلغاء
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}