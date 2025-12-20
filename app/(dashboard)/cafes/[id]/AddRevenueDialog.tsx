"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Loader2 } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "@/lib/constants";

interface AddRevenueDialogProps {
  cafeId: string;
  onAdded: () => void;
}

export default function AddRevenueDialog({ cafeId, onAdded }: AddRevenueDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    shift: "",
    date: new Date().toISOString().split('T')[0],
    amount: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.shift || !formData.amount) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/revenue`, {
        cafeId,
        shift: formData.shift,
        date: new Date(formData.date),
        amount: parseFloat(formData.amount),
      });

      setFormData({
        shift: "",
        date: new Date().toISOString().split('T')[0],
        amount: "",
      });
      setOpen(false);
      onAdded();
    } catch (err) {
      console.error("Failed to add revenue", err);
      alert("فشل في إضافة الإيرادات");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full gap-2" size="lg" variant="outline">
          <DollarSign className="h-5 w-5" />
          إضافة إيرادات
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>إضافة إيرادات جديدة</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="shift">الشفت *</Label>
            <Select
              value={formData.shift}
              onValueChange={(value) => setFormData({ ...formData, shift: value })}
              required
            >
              <SelectTrigger id="shift">
                <SelectValue placeholder="اختر الشفت" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">صباحي</SelectItem>
                <SelectItem value="evening">مسائي</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">التاريخ *</Label>
            <Input
              id="date"
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">المبلغ (ج.م) *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              required
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                  جاري الإضافة...
                </>
              ) : (
                "إضافة الإيرادات"
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