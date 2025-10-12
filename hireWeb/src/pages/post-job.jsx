import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import z from 'zod'
import { City, State } from 'country-state-city'
import { Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import useFetch from '@/hooks/use-fetch'
import { getCompanies } from '@/api/apiCompanies'
import { addNewJob } from '@/api/apiJobs'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { BarLoader } from 'react-spinners'
import MDEditor from '@uiw/react-md-editor'
import { Button } from '@/components/ui/button'
import AddCompanyDrawer from '@/components/add-company-drawer'

const schema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  location: z.string().min(1, { message: 'Location is required' }),
  company_id: z.string().min(1, { message: 'Select or add a new Company' }),
  requirements: z.string().min(1, { message: 'Requirements are required' })
})


const PostJob = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: { location: "", company_id: "", requirements: "" },
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingCreateJob,
    error: errorCreateJob,
    data: dataCreateJob,
    fn: fnCreateJob,
  } = useFetch(addNewJob);

  const onSubmit = (data) => {
    fnCreateJob({
      ...data,
      recruiter_id: user.id,
      isOpen: true,
    });
  };

  useEffect(() => {
    if (dataCreateJob?.length > 0) navigate("/jobs");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingCreateJob]);

  const {
    loading: loadingCompanies,
    data: companies,
    fn: fnCompanies,
  } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  const selectedState = watch("state");
  const selectedCity = watch("city");
  
  // Update location field when state or city changes
  useEffect(() => {
    if (selectedState && selectedCity) {
      setValue("location", `${selectedCity}, ${selectedState}`);
    } else if (selectedState) {
      setValue("location", selectedState);
    } else {
      setValue("location", "");
    }
  }, [selectedState, selectedCity, setValue]);
  
  const cities = useMemo(() => {
    if (selectedState) {
      const stateCode = State.getStatesOfCountry("IN").find(s => s.name === selectedState)?.isoCode;
      if (stateCode) {
        return City.getCitiesOfState("IN", stateCode);
      }
    }
    // Return empty array if no state is selected (to avoid loading thousands of cities)
    return [];
  }, [selectedState]);

  if (!isLoaded || loadingCompanies) {
    return <BarLoader className="mb-4" width={"100%"} color="#84cdee" />;
  }

  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/jobs" />;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
        Post a Job
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-4 pb-0"
      >
        <Input placeholder="Job Title" {...register("title")} />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        <Textarea placeholder="Job Description" {...register("description")} />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <div className="w-full">
                  <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                </div>
                <SelectContent>
                  <SelectGroup>
                    {State.getStatesOfCountry("IN").map(({ name, isoCode }) => (
                      <SelectItem key={isoCode} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <Select 
                value={field.value} 
                onValueChange={field.onChange}
                disabled={!selectedState}
              >
                <div className="w-full">
                  <SelectTrigger className="w-full">
                  <SelectValue placeholder={selectedState ? "Select City" : "Select State First"} />
                  </SelectTrigger>
                </div>
                <SelectContent>
                  <SelectGroup>
                    {cities.map(({ name }) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
            />
         <div className='flex gap-3'>
           <Controller
            name="company_id"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <div className="w-full">
                  <SelectTrigger className="w-full">
                  <SelectValue placeholder="Company">
                    {field.value
                      ? companies?.find((com) => com.id === Number(field.value))
                          ?.name
                      : "Company"}
                  </SelectValue>
                  </SelectTrigger>
                </div>
                <SelectContent>
                  <SelectGroup>
                    {companies?.map(({ name, id }) => (
                      <SelectItem key={id} value={String(id)}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          <AddCompanyDrawer fetchCompanies={fnCompanies} />
         </div>
        </div>
        {errors.state && (
          <p className='text-red-500'>{errors.state.message}</p>
        )}
        {errors.city && (
          <p className='text-red-500'>{errors.city.message}</p>
        )}
        {errors.location && (
          <p className='text-red-500'>{errors.location.message}</p>
        )}
        {errors.company_id && (
          <p className="text-red-500">{errors.company_id.message}</p>
        )}

        <Controller
          name="requirements"
          control={control}
          render={({ field }) => (
            <MDEditor value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.requirements && (
          <p className="text-red-500">{errors.requirements.message}</p>
        )}
        {errors.errorCreateJob && (
          <p className="text-red-500">{errors?.errorCreateJob?.message}</p>
        )}
        {errorCreateJob?.message && (
          <p className="text-red-500">{errorCreateJob?.message}</p>
        )}
        {loadingCreateJob && <BarLoader width={"100%"} color="#84cdee" />}
        <Button type="submit" variant="blue" size="lg" className="mt-2">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default PostJob