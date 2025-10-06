import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { SignedIn, SignedOut, SignIn, SignInButton, UserButton } from '@clerk/clerk-react'
import { PenBox } from 'lucide-react'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import { BriefcaseBusiness } from 'lucide-react'
import { Heart } from 'lucide-react'

export const Header = () => {
  const [showSignIn, setshowSignIn] = useState(false);

  const [search,setSearch] = useSearchParams();

  useEffect(() => {
    if (search.get('sign-in')) {
      setshowSignIn(true);
    }
  }, [search])
  

  const handleOverLayClick = (e) => {
    if (e.target === e.currentTarget) {
      setshowSignIn(false);
      setSearch({});
    }
  }
  return (
    <>
      <nav className='py-4 flex justify-between items-center'>
        <Link>
          <img src="/logo2.png" alt="logo image" className='h-20' />
        </Link>

        <div className='flex gap-8'>
          <SignedOut>
            <Button variant={"outline"} onClick={() => setshowSignIn(true)}>Login</Button>
          </SignedOut>
          <SignedIn>
            {/* add a condition here  */}
            <Button variant={'destructive'} className={`rounded-full`}>
              <PenBox size={20} className='mr-2' />
              Post a job
            </Button>
            <Link to={'/post-job'}></Link>
            <UserButton 
              appearance={{
                elements:{
                  avatarBox: {
                    width: '40px',
                    height: '40px'
                  }
                }
              }} 
            >
            <UserButton.MenuItems>
              <UserButton.Link
              label='My Jobs'
              labelIcon={<BriefcaseBusiness size={15}/>}
              href='/my-jobs' />
              <UserButton.Link
              label='Saved Jobs'
              labelIcon={<Heart size={15}/>}
              href='/saved-job' />
            </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>

      </nav>

      {showSignIn && <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'
        onClick={handleOverLayClick}>
        <SignIn
          signUpForceRedirectUrl='/onboarding'
          fallbackRedirectUrl='/onboarding'
        />
      </div>}
    </>
  )
}
