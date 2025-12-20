"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Plus, Building2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTheme } from "next-themes";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface Branch {
  _id: string;
  name: string;
}

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { theme } = useTheme();

  const fetchBranches = async () => {
    const res = await axios.get(`${API_URL}/branches`);
    setBranches(res.data);
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const addBranch = async () => {
    if (!name.trim()) return;

    setLoading(true);
    await axios.post(`${API_URL}/branches`, { name });
    setName("");
    await fetchBranches();
    setLoading(false);
  };

  const deleteBranch = async (id: string) => {
    setDeleting(id);
    await axios.delete(`${API_URL}/branches/${id}`);
    await fetchBranches();
    setDeleting(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      addBranch();
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            إدارة الفروع
          </h1>
          <p className="text-muted-foreground">
            أضف وأدر فروع مؤسستك بسهولة
          </p>
        </div>

        {/* Add Branch Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>إضافة فرع جديد</CardTitle>
            <CardDescription>
              أدخل اسم الفرع وانقر على زر الإضافة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="أدخل اسم الفرع"
                className="flex-1"
              />
              <Button
                onClick={addBranch}
                disabled={loading || !name.trim()}
                className="gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    جاري الإضافة...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    إضافة فرع
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Branches List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>جميع الفروع</span>
              <span className="text-sm font-normal text-muted-foreground">
                ({branches.length})
              </span>
            </CardTitle>
            <CardDescription>
              قائمة بجميع الفروع المسجلة في النظام
            </CardDescription>
          </CardHeader>
          <CardContent>
            {branches.length === 0 ? (
              <div className="py-12 text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Building2 className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-foreground font-medium mb-1">
                  لا توجد فروع حتى الآن
                </p>
                <p className="text-sm text-muted-foreground">
                  قم بإضافة أول فرع للبدء
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {branches.map((branch) => (
                  <div
                    key={branch._id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-medium text-foreground">
                        {branch.name}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteBranch(branch._id)}
                      disabled={deleting === branch._id}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      {deleting === branch._id ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin ml-2" />
                          جاري الحذف...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 ml-2" />
                          حذف
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}