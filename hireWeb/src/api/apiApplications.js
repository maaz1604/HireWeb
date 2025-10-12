import supabaseClient, { supabaseUrl } from "@/utils/supabase";

export async function applyToJob(token,_,jobData) {
  const supabase = await supabaseClient(token);

  const random = Math.floor(Math.random() * 9000);
  const fileName = `resume-${random}-${jobData.candidate_id}`;

  const {error:storageError} = await supabase.storage.from('resumes').upload(fileName,jobData.resume);


  if (storageError) {
    console.error('Error while Uploading Resume',storageError);
    return null;
  }

  const resume = `${supabaseUrl}/storage/v1/object/public/resumes/${fileName}`
  // If the job is already saved, remove it
  const { data, error } = await supabase.from("applications").insert([{
    ...jobData,
    resume
  }]).select();

  if (error) {
    console.error("Error while submitting resume:", error);
    return data;
  }

  return data;
}

export async function updateApplicationStatus(token, { job_id }, status) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("applications")
    .update({ status })
    .eq("job_id", job_id)
    .select();

  if (error || data.length === 0) {
    console.error("Error Updating Application Status:", error);
    return null;
  }

  return data;
}