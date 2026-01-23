import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Search, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Schema Validation
const formSchema = z.object({
    reg_number: z.string().min(1, "Nomor registrasi wajib diisi"),
    birth_date: z.string().min(1, "Tanggal lahir wajib diisi"),
});

type FormValues = z.infer<typeof formSchema>;

type StatusResult = {
    status: string;
    nama: string;
    reg_number: string;
};

export default function CheckStatusForm() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<StatusResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: FormValues) => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch("/api/check-status", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const json = await response.json();

            if (!response.ok) {
                throw new Error(json.message || "Terjadi kesalahan saat mengecek status");
            }

            setResult(json.data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "verified":
            case "approved":
                return (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full font-bold border border-green-200">
                        <CheckCircle className="h-5 w-5" />
                        <span>Terverifikasi / Diterima</span>
                    </div>
                );
            case "rejected":
                return (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-full font-bold border border-red-200">
                        <XCircle className="h-5 w-5" />
                        <span>Ditolak</span>
                    </div>
                );
            default: // pending
                return (
                    <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-full font-bold border border-amber-200">
                        <Clock className="h-5 w-5" />
                        <span>Menunggu Verifikasi</span>
                    </div>
                );
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto">
            <Card className="border-border/50 shadow-xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-serif text-teal-950">Cek Status Pendaftaran</CardTitle>
                    <CardDescription>
                        Masukkan Nomor Registrasi dan Tanggal Lahir untuk melihat status Anda.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="reg_number">Nomor Registrasi</Label>
                            <Input
                                id="reg_number"
                                placeholder="Contoh: REG-2026-XXXX"
                                {...register("reg_number")}
                                className={errors.reg_number ? "border-red-500" : ""}
                            />
                            {errors.reg_number && (
                                <p className="text-red-500 text-xs mt-1">{errors.reg_number.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="birth_date">Tanggal Lahir</Label>
                            <Input
                                id="birth_date"
                                type="date"
                                {...register("birth_date")}
                                className={errors.birth_date ? "border-red-500" : ""}
                            />
                            {errors.birth_date && (
                                <p className="text-red-500 text-xs mt-1">{errors.birth_date.message}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Memeriksa...
                                </>
                            ) : (
                                <>
                                    <Search className="mr-2 h-4 w-4" />
                                    Cek Status
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Result Section */}
                    <div className="mt-8 transition-all duration-300">
                        {error && (
                            <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}

                        {result && (
                            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 animate-in fade-in slide-in-from-top-4">
                                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Hasil Pencarian</h4>

                                <div className="flex flex-col items-center text-center mb-6">
                                    {getStatusBadge(result.status)}
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                        <span className="text-slate-600 text-sm">Nomor Registrasi</span>
                                        <span className="font-mono font-bold text-slate-900">{result.reg_number}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                        <span className="text-slate-600 text-sm">Nama Lengkap</span>
                                        <span className="font-bold text-slate-900">{result.nama}</span>
                                    </div>
                                </div>

                                <p className="text-xs text-slate-400 mt-6 text-center">
                                    *Status dapat berubah sewaktu-waktu. Pantau secara berkala.
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
