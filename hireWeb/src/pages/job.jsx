import { getSingleJob } from '@/api/apiJobs';
import useFetch from '@/hooks/use-fetch';
import { useUser } from '@clerk/clerk-react'
import { Briefcase } from 'lucide-react';
import { DoorClosed } from 'lucide-react';
import { DoorOpen } from 'lucide-react';
import { MapPinIcon } from 'lucide-react';
import React from 'react'
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import MDEditor from '@uiw/react-md-editor';

const JobPage = () => {

  const { isLoaded, user } = useUser();
  const { id } = useParams();

  const {
    loading: loadingjob,
    data: job,
    fn: fnjob,
  } = useFetch(getSingleJob, {
    job_id: id,
  });

  useEffect(() => {
    if (isLoaded) fnjob();
  }, [isLoaded]);

  if (!isLoaded) {
    return <BarLoader className='mb-4' width="100%" color='#84cdee' />
  }

  return (
     <div className="flex flex-col gap-8 mt-5">
      <div className='flex flex-col-reverse gap-6 justify-between items-center md:flex-row'>
        <h1 className='gradient-title font-extrabold pb-3 text-4xl sm:text-6xl'>{job?.title}</h1>
        <img src={job?.company?.logo_url} className='h-12' alt={job?.title} />
      </div>

      <div className='flex justify-between'>
        <div className='flex gap-2'>
          <MapPinIcon />
          {job?.location}
        </div>

        <div className='flex gap-2'>
          <Briefcase /> {job?.applications?.length} Applicants
        </div>

        <div className='flex gap-2'>
          {job?.isOpen ?
            (<><DoorOpen />Open</>)
            :
            (<><DoorClosed />Closed</>)}
        </div>
      </div>

      {/* hiring status */}

      <h2 className='text-2xl font-bold sm:text-3xl'>
        About the Job
      </h2>
      <p className='sm:text-lg'> {job?.description}</p>
      <h2 className='text-2xl font-bold sm:text-3xl'>
        What we are looking for
      </h2>

      <MDEditor.Markdown
      source={job?.requirements} className='bg-transparent sm:text-lg'
      />

      {/* render applications  */}
      
    </div>
  )
}

export default JobPage