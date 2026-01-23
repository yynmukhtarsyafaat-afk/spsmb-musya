import type { APIRoute } from "astro";
import { getSupabaseAdmin } from "@/lib/supabase";
import { z } from "zod";

export const POST: APIRoute = async ({ request, locals }) => {
    try {
        const formData = await request.json();

        // 1. Validate Input
        const schema = z.object({
            reg_number: z.string().min(1, "Nomor registrasi wajib diisi"),
            birth_date: z.string().min(1, "Tanggal lahir wajib diisi"),
        });

        const parseResult = schema.safeParse(formData);

        if (!parseResult.success) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Data tidak valid",
                    errors: parseResult.error.flatten(),
                }),
                { status: 400 }
            );
        }

        const { reg_number, birth_date } = parseResult.data;

        // 2. Query Supabase (using Admin client to bypass RLS)
        // Cloudflare Pages: Env vars are in locals.runtime.env
        const runtime = (locals as any).runtime;
        const serviceKey = runtime?.env?.SUPABASE_SERVICE_ROLE_KEY;

        const supabase = getSupabaseAdmin(serviceKey);

        // Note: We are querying the 'registrations' table. 
        // We assume 'student_data' is a JSONB column containing 'birth_date'.
        // We strictly match reg_number and birth_date for security/privacy.
        const { data, error } = await supabase
            .from("registrations")
            .select("status, student_data, reg_number")
            .eq("reg_number", reg_number)
            .single();

        if (error || !data) {
            // Generic error message to avoid leaking if ID exists but DOB is wrong
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Data pendaftaran tidak ditemukan. Periksa kembali Nomor Registrasi dan Tanggal Lahir Anda.",
                }),
                { status: 404 }
            );
        }

        // 3. Verify Birth Date manually if it's inside JSONB (safer than complex JSONB query syntax sometimes)
        // Adjust key access based on actual JSON structure. 
        // Data disimpan dengan kunci Indonesia: tanggal_lahir, nama_lengkap
        const storedBirthDate = data.student_data?.tanggal_lahir;
        const storedNama = data.student_data?.nama_lengkap || "Calon Peserta Didik"; // Fallback name

        if (storedBirthDate !== birth_date) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Data pendaftaran tidak ditemukan. Periksa kembali Nomor Registrasi dan Tanggal Lahir Anda.",
                }),
                { status: 404 }
            );
        }

        // 4. Return Success
        return new Response(
            JSON.stringify({
                success: true,
                data: {
                    status: data.status,
                    nama: storedNama,
                    reg_number: data.reg_number
                },
            }),
            { status: 200 }
        );

    } catch (error) {
        console.error("Check Status Error:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: `Terjadi kesalahan pada server: ${error instanceof Error ? error.message : String(error)}`,
            }),
            { status: 500 }
        );
    }
};
