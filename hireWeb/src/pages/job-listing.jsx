import { getCompanies } from '@/api/apiCompanies';
import { getJobs } from '@/api/apiJobs'
import JobCard from '@/components/job-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import useFetch from '@/hooks/use-fetch'
import { useUser } from '@clerk/clerk-react';
import { City, State } from 'country-state-city';

import React from 'react'
import { useEffect, useState, useMemo } from 'react';
import { BarLoader } from 'react-spinners';

const JobListing = () => {

  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [company_id, setCompany_id] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 12; // Show 12 items per page

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

  const {
    fn: fnCompanies,
    data: companies,
  } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) fnCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded])


  useEffect(() => {
    if (isLoaded) {
      fnJobs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, location, company_id, searchQuery]);

  // Reset to first page when filters or results change
  useEffect(() => {
    setPage(1);
  }, [location, company_id, searchQuery]);

  const handlesearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);

    const query = formData.get('search-query');
    if (query) {
      setSearchQuery(query);
    }
  }

  const clearFilters = () => {
    setSearchQuery("");
    setLocation("");
    setSelectedState("");
    setCompany_id("");
    setPage(1);
  }

  // Get cities based on selected state, or show major cities if no state is selected
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

  if (!isLoaded) {
    return <BarLoader className='mb-4' width="100%" color='#84cdee' />
  }

  // Pagination calculations (client-side)
  const totalItems = jobs?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pagedJobs = jobs?.slice(start, end) || [];

  // Build visible page numbers with simple window + ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxButtons = 5; // how many page number buttons to show
    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    const half = Math.floor(maxButtons / 2);
    let startPage = Math.max(1, currentPage - half);
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    return pages;
  };

  const visiblePages = getPageNumbers();

  return (
    <div>
      <h1 className='gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8'>Latest Jobs</h1>

      {/* Add filters here */}
      <form onSubmit={handlesearch} className='h-14 flex w-full gap-2 items-center mb-2'>
        <Input
          type={`text`}
          placeholder='Search Jobs by Title..'
          name='search-query'
          className={`h-full flex-1 px-4 py-4 text-lg `}
        />
        <Button className={`h-full sm:w-28`} type='submit' variant={`blue`} onClick={() => setPage(1)}>
          Search
        </Button>
      </form>

      <div className="flex flex-col sm:flex-row gap-2">
        <Select value={selectedState} onValueChange={(value) => {
          setSelectedState(value);
          setLocation(""); // Reset city when state changes
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by State" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {State.getStatesOfCountry("IN").map(({ name }) => {
                return (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select value={location} onValueChange={(value) => setLocation(value)} disabled={!selectedState}>
          <SelectTrigger>
            <SelectValue placeholder={selectedState ? "Filter by City" : "Select State First"} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {cities.map(({ name }) => {
                return (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select value={company_id} onValueChange={(value) => setCompany_id(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Company" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {companies?.map(({ name, id }) => {
                return (
                  <SelectItem key={name} value={id}>
                    {name}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button onClick={clearFilters} variant="destructive" className="h-10">
          Clear Filters
        </Button>
      </div>

      {loadingJobs && (
        <BarLoader className='mt-4' width="100%" color='#84cdee' />
      )}

      {loadingJobs === false && (
        <>
          <div className='mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {totalItems ? (
              pagedJobs.map((job) => {
                return <JobCard key={job.id} job={job}
                  savedInit={job?.saved?.length > 0}
                />;
              })
            ) : (<div> No jobs found 😥 </div>)}
          </div>

          {totalItems > 0 && totalPages > 1 && (
            <div className='mt-6'>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage((p) => Math.max(1, p - 1));
                      }}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>

                  {/* First page shortcut with ellipsis if needed */}
                  {visiblePages[0] > 1 && (
                    <>
                      <PaginationItem>
                        <PaginationLink href="#" onClick={(e) => { e.preventDefault(); setPage(1); }}>1</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    </>
                  )}

                  {visiblePages.map((pNum) => (
                    <PaginationItem key={pNum}>
                      <PaginationLink
                        href="#"
                        isActive={pNum === currentPage}
                        onClick={(e) => { e.preventDefault(); setPage(pNum); }}
                      >
                        {pNum}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  {/* Last page shortcut with ellipsis if needed */}
                  {visiblePages[visiblePages.length - 1] < totalPages && (
                    <>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#" onClick={(e) => { e.preventDefault(); setPage(totalPages); }}>{totalPages}</PaginationLink>
                      </PaginationItem>
                    </>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage((p) => Math.min(totalPages, p + 1));
                      }}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              <div className="mt-2 text-center text-sm text-muted-foreground">
                Showing {start + 1}-{Math.min(end, totalItems)} of {totalItems}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default JobListing