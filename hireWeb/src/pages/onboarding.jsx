import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/clerk-react'
import React from 'react'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarLoader } from 'react-spinners'

const Onboarding = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const handleRoleSelection = async (role) => {
    await user.update({
      unsafeMetadata: { role }
    }).then(() => {
      navigate(role === 'recruiter' ? '/post-job' : '/jobs')
    }).catch((error) => {
      console.error("Error while updating role: ", error);
    });
  };

  useEffect(() => {
    if (user?.unsafeMetadata?.role) {
      navigate(user.unsafeMetadata.role === 'recruiter' ? '/post-job' : '/jobs');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);


  if (!isLoaded) {
    return <BarLoader className='mb-4' width="100%" color='#84cdee' />
  }
  return (
    <div className='flex flex-col items-center justify-center mt-32'>
      <h2 className='gradient-title font-extrabold text-7xl sm:text-8xl tracking-tighter'> I am a...</h2>
      <div className='mt-16 grid grid-cols-2 gap-4 w-full md:px-40'>
        <Button variant={`blue`} className={`h-48 text-2xl`}
          onClick={() => handleRoleSelection("candidate")}
        >Candidate</Button>
        <Button variant={`destructive`} className={`h-48 text-2xl`}
          onClick={() => handleRoleSelection("recruiter")}
        >Recruiter</Button>
      </div>
    </div>

  )
}

export default Onboarding