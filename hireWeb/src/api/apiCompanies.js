import supabaseClient from "@/utils/supabase";

export async function getCompanies(token) {
  const supabase = await supabaseClient(token);

  // If the job is already saved, remove it
  const { data, error } = await supabase.from("companies").select("*");

  if (error) {
    console.error("Error while fetching companies:", error);
    return data;
  }

  return data;
}
