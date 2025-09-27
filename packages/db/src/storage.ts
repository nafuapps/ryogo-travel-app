import { createClient } from "@supabase/supabase-js";
// Create Supabase client
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
// Upload file using standard upload
export async function uploadFile(file: File, filePath: string) {
  const { data, error } = await supabase.storage
    .from("ryogoDocs")
    .upload(filePath, file, {
      upsert: true,
    });
  if (error) {
    throw Error(error.message);
  }
  return data;
}
