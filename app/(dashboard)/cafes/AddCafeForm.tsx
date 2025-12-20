"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "@/lib/constants";

interface Branch {
  _id: string;
  name: string;
}

interface AddCafeFormProps {
  onAdded: () => void;
}

export default function AddCafeForm({ onAdded }: AddCafeFormProps) {
  const [open, setOpen] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [formData, setFormData] = useState({ 
    name: "", 
    branch: "", 
    description: "" 
  });
  const [loading, setLoading] = useState(false);

  // Fetch branches when dialog opens
  useEffect(() => {
    if (open) {
      fetchBranches();
    }
  }, [open]);

  const fetchBranches = async () => {
    setLoadingBranches(true);
    try {
      const res = await axios.get(`${BASE_URL}/branches`);
      setBranches(res.data);
    } catch (err) {
      console.error("Failed to fetch branches", err);
      alert("فشل في تحميل الفروع");
    } finally {
      setLoadingBranches(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.branch) {
      alert("يرجى اختيار الفرع");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/cafes`, {
        name: formData.name,
        branch: formData.branch,
        description: formData.description || undefined,
      });
      setFormData({ name: "", branch: "", description: "" });
      setOpen(false);
      onAdded();
    } catch (err) {
      console.error("Failed to add cafe", err);
      alert("فشل في إضافة المقهى");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          إضافة مقهى جديد
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>إضافة مقهى جديد</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="name">اسم المقهى *</Label>
            <Input
              id="name"
              required
              placeholder="أدخل اسم المقهى"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="branch">الفرع *</Label>
            {loadingBranches ? (
              <div className="flex items-center justify-center p-3 border rounded-md">
                <Loader2 className="h-4 w-4 animate-spin ml-2" />
                <span className="text-sm text-muted-foreground">جاري تحميل الفروع...</span>
              </div>
            ) : branches.length === 0 ? (
              <div className="p-3 border rounded-md bg-muted">
                <p className="text-sm text-muted-foreground text-center">
                  لا توجد فروع متاحة. يرجى إضافة فرع أولاً.
                </p>
              </div>
            ) : (
              <Select
                value={formData.branch}
                onValueChange={(value) => setFormData({ ...formData, branch: value })}
                required
              >
                <SelectTrigger id="branch">
                  <SelectValue placeholder="اختر الفرع" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch._id} value={branch._id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">الوصف (اختياري)</Label>
            <Input
              id="description"
              placeholder="أدخل وصف المقهى"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button 
              type="submit" 
              disabled={loading || branches.length === 0}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                  جاري الإضافة...
                </>
              ) : (
                "إضافة المقهى"
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