import supabaseClient from "@/utils/supabase";

export async function getJobs(token,{location,compay_id,searchQuery}) {
  const supabase = await supabaseClient(token);

  let query = supabase.from("jobs").select("*,company:companies(name,logo_url),saved:saved_jobs(id)");

  if (location) {
    query = query.eq('location',location);
  }

  if (compay_id) {
    query = query.eq('company_id',compay_id);
  }

  if (searchQuery) {
    query = query.ilike('title',`%${searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error while fetching jobs:", error);
    return null;
  }

  return data;
}
