import React from 'react'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from './ui/button'
import { Input } from './ui/input';
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import useFetch from '@/hooks/use-fetch';
import { applyToJob } from '@/api/apiApplications';
import { BarLoader } from 'react-spinners';

const schema = z.object({
    experience: z.number().min(0, { message: 'Experience at least must be 0' }).int(),
    skills: z.string().min(1, { message: 'Skills are reqired' }),
    education: z.enum(['Intermediate', 'Graduate', 'Post Graduate'], { message: 'Education is reqired' }),
    resume: z.any().refine((file) =>
        file[0] &&
        (file[0].type === 'application/pdf' ||
            file[0].type === 'application/msword'
        ), { message: 'Only Pdf or Words Document are allowed' }
    ),
})

export const ApplyJobDrawer = ({ job, user, fetchJob, applied = false }) => {
    const [open, setOpen] = React.useState(false);
    const [appliedLocal, setAppliedLocal] = React.useState(Boolean(applied));
    const isApplied = Boolean(applied) || appliedLocal;
    const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
        resolver: zodResolver(schema),
    });

    const {
        loading: loadingApply,
        error: errorApply,
        fn: fnApply,
    } = useFetch(applyToJob);

    const onSubmit = async (data) => {
        if (loadingApply || isApplied) return;
        // Optimistically prevent double apply and close immediately
        setAppliedLocal(true);
        setOpen(false);
        try {
            await fnApply({
                ...data,
                job_id: job.id,
                candidate_id: user.id,
                name: user.fullName,
                status: 'applied',
                resume: data.resume[0],
            });
            // Refresh parent job state so button becomes "Applied"
            await fetchJob?.();
            reset();
        } catch {
            // Rollback local flag if submission failed
            setAppliedLocal(Boolean(applied));
        }
    };

    return (
        <>
            <Drawer open={open} onOpenChange={(v) => !isApplied && setOpen(v)}>
                <DrawerTrigger asChild>
                    <Button
                        variant={job?.isOpen && !isApplied ? 'blue' : 'destructive'}
                        disabled={!job?.isOpen || isApplied}
                        size="lg"
                    >
                        {job?.isOpen ? (isApplied ? 'Applied' : 'Apply') : 'Hiring Closed'}
                    </Button>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>
                            {`Apply for ${job?.title} at ${job?.company?.name}`}
                        </DrawerTitle>
                        <DrawerDescription>Please Fill the Form below.</DrawerDescription>
                    </DrawerHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 p-4 pb-0' >
                        <Input
                            {...register('experience', {
                                valueAsNumber: true
                            }
                            )}
                            type={`number`}
                            placeholder='Year of Experiences'
                            className={`flex-1`}
                        />

                        {errors.experience && (
                            <p className='text-red-500'>{errors.experience.message}</p>
                        )}

                        <Input
                            {...register('skills')}
                            type={`text`}
                            placeholder='Skills (Comma Separated)'
                            className={`flex-1`}
                        />

                        {errors.skills && (
                            <p className='text-red-500'>{errors.skills.message}</p>
                        )}

                        <Controller
                            name='education'
                            control={control}
                            render={({ field }) => (
                                <RadioGroup
                                    onValueChange={field.onChange} {...field}>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Intermediate" id="intermediate" />
                                        <Label htmlFor="intermediate">Intermediate</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Graduate" id="graduate" />
                                        <Label htmlFor="graduate">Graduate</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Post Graduate" id="post-graduate" />
                                        <Label htmlFor="post-graduate">Post Graduate</Label>
                                    </div>
                                </RadioGroup>
                            )}
                        />

                        {errors.education && (
                            <p className='text-red-500'>{errors.education.message}</p>
                        )}

                        <Input
                            type='file'
                            accept='.pdf, .doc, .docx'
                            className={`flex-1 file:text-gray-500`}
                            {...register('resume')}
                        />

                        {errors.resume && (
                            <p className='text-red-500'>{errors.resume.message}</p>
                        )}

                        {errorApply?.message && (
                            <p className='text-red-500'>{errorApply?.message}</p>
                        )}

                        {loadingApply && <BarLoader className='mb-4' width="100%" color='#84cdee' />}

                        <Button type='submit' variant={`blue`} size='lg' disabled={loadingApply}>
                            Apply
                        </Button>
                    </form>

                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
};
