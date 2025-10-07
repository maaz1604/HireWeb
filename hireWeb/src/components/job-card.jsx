import { useUser } from '@clerk/clerk-react'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Trash2Icon } from 'lucide-react';
import { MapPinIcon } from 'lucide-react';

const JobCard = ({
    //knowing the below parameters are very important or interview
    job,
    isMyjob = false,
    savedInit = false,
    onJobSaved = () => { },
}) => {

    const { user } = useUser();

    return (
        <Card>
            <CardHeader>
                <CardTitle className={`flex justify-between font-bold`}>
                    {job.title}
                    {isMyjob && <Trash2Icon fill='red' size={18} className=' text-red-500 cursor-pointer' />}
                </CardTitle>
            </CardHeader>

            <CardContent>
                <div>
                    {job.company && <img src={job.company.logo_url} className='h-6'/>}
                    <div>
                        <MapPinIcon size={15} /> {job.location}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default JobCard