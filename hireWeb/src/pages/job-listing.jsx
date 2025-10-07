import { getJobs } from '@/api/apiJobs'
import JobCard from '@/components/job-card';
import useFetch from '@/hooks/use-fetch'
import { useUser } from '@clerk/clerk-react';
import React from 'react'
import { useEffect, useState } from 'react';
import { BarLoader } from 'react-spinners';

const JobListing = () => {

  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");

  const { isLoaded } = useUser();

  const {
    loading: loadingJobs,
    data: jobs,
    fn: fnJobs,
  } = useFetch(getJobs, {
    location,
    company_id,
    searchQuery,
  });


  console.log(jobs);

  useEffect(() => {
    if (isLoaded) {
      fnJobs();
    }
  }, [isLoaded, location, company_id, searchQuery]);

  if (!isLoaded) {
    return <BarLoader className='mb-4' width="100%" color='#84cdee' />
  }

  return (
    <div>
      <h1 className='gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8'>Latest Jobs</h1>

      {/* Add filters here */}

      {loadingJobs && (
        <BarLoader className='mt-4' width="100%" color='#84cdee' />
      )}

      {loadingJobs === false && (
        <div>
          {jobs?.length ? (
            jobs.map((job) => {
              return <JobCard key={job.id} job={job} />
            })
          ) : (<div> No jobs found 😥 </div>)}
        </div>
      )}
    </div>
  )
}

export default JobListing