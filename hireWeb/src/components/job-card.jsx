import { useUser } from '@clerk/clerk-react'
import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Trash2Icon } from 'lucide-react';
import { MapPinIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Heart } from 'lucide-react';
import useFetch from '@/hooks/use-fetch';
// eslint-disable-next-line no-unused-vars
import { deleteJob, getJobs, saveJob } from '@/api/apiJobs';
import { useState } from 'react';
import { useEffect } from 'react';
import { BarLoader } from 'react-spinners';

const JobCard = ({
    //knowing the below parameters are very important or interview
    job,
    isMyjob = false,
    savedInit = false,
    onJobSaved = () => { },
    onJobAction = () => { },
}) => {

    const [saved, setSaved] = useState(savedInit);

    const {
        fn: fnSavedJobs,
        data: savedjobs,
        loading: loadingSavedJobs
    } = useFetch(saveJob, {
        alreadySaved:saved,
    });

    const { user } = useUser();

    const handleSavedJobs = async () => {
        await fnSavedJobs({
            user_id: user.id,
            job_id: job.id
        });
        onJobSaved();
    };

    const {loading:loadingDeleteJob,fn:fnDeleteJob} = useFetch(deleteJob,{
        job_id:job.id
    });

    const handleDeleteJob = async() => {
        await fnDeleteJob();
        onJobAction();
    }

    useEffect(() => {
        if (savedjobs !== undefined) {
            setSaved(savedjobs?.length > 0)
        }
    }, [savedjobs]);

    return (
        <Card className={`flex flex-col`}>
            {loadingDeleteJob && (
                <BarLoader className='mt-4' width={'100%'} color='#84cdeeu' />
            )}
            <CardHeader>
                <CardTitle className={`flex justify-between font-bold`}>
                    {job.title}
                    {isMyjob && <Trash2Icon onClick={handleDeleteJob} fill='red' size={18} className=' text-red-500 cursor-pointer' />}
                </CardTitle>
            </CardHeader>

            <CardContent className={`flex flex-col gap-4 flex-1`}>
                <div className='flex justify-between'>
                    {job.company && <img src={job.company.logo_url} className='h-6' />}
                    <div className='flex gap-2 items-center'>
                        <MapPinIcon size={15} /> {job.location}
                    </div>
                </div>
                <hr />
                {job.description.substring(0, job.description.indexOf('.'))}
            </CardContent>

            <CardFooter className={`flex gap-2`}>
                <Link to={`/job/${job.id}`} className='flex-1'>
                    <Button variant={`secondary`} className={`w-full`}>
                        More Details
                    </Button>
                </Link>

                {!isMyjob && (
                    <Button
                        variant={`outline`}
                        className={`w-15`}
                        onClick={handleSavedJobs}
                        disable={loadingSavedJobs}
                    >
                        {
                            saved ? (
                                <Heart size={20} stroke='red' fill='red' />
                            ) : (
                                <Heart size={20} />
                            )
                        }
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}

export default JobCard