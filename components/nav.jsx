"use client"

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { signIn, signOut, useSession, getProviders }
  from 'next-auth/react'
import { useTheme } from 'next-themes';
import { FiSun, FiMoon } from 'react-icons/fi';

const Nav = () => {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [providers, setProviders] = useState(null);

  const [toggleDropDown, setToggleDropDown] = useState(false);

  useEffect(() => {
    setMounted(true);
    const setUpProviders = async () => {
      const response = await getProviders();

      setProviders(response);
    }

    setUpProviders();
  }, [])

  return (
    <nav className="flex-between w-full mb-16 pt-3">
      <Link href="/" className="flex-gap-2
        flex-center">
        <Image
          src="/assets/images/logo.svg"
          alt="PromptShare Logo"
          width={30}
          height={30}
          className='object-contain'
        />
        <p className="logo_text">PromptShare</p>
      </Link>



      {/* Desktop Navigation */}
      <div className="sm:flex hidden">
        {mounted && (
          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-gray-200 dark:border-gray-700 flex justify-center items-center mr-5 transition-all hover:scale-105"
          >
            {theme === 'dark' ? <FiSun className="text-xl text-yellow-400" /> : <FiMoon className="text-xl text-gray-700" />}
          </button>
        )}

        {session?.user ? (
          <div className="flex gap-3 md:gap-5">
            <Link href="create-prompt" className='black_btn'>
              Create Post
            </Link>

            <button type="button" onClick={signOut} className="outline_btn">
              sign out
            </button>
            <Link href='/profile'>
              <Image
                src={session?.user.image}
                width={37}
                height={37}
                className="rounded-full"
                alt="profile"
              />
            </Link>
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type="button"
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  className='black_btn'
                >
                  Sign In / Sign Up
                </button>
              ))
            }
          </>
        )}
      </div>

      {/* Mobile Navigation  */}

      <div className="sm:hidden flex relative">
        {mounted && (
          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-gray-200 dark:border-gray-700 flex justify-center items-center mr-5 transition-all hover:scale-105"
          >
            {theme === 'dark' ? <FiSun className="text-xl text-yellow-400" /> : <FiMoon className="text-xl text-gray-700" />}
          </button>
        )}
        {session?.user ? (
          <div className="flex">
            <Image
              src={session?.user.image}
              width={37}
              height={37}
              className="rounded-full"
              alt="profile"
              onClick={() => setToggleDropDown((prev) => !prev)}
            />

            {toggleDropDown && (
              <div className="dropdown">
                <Link
                  href="/profile"
                  className="dropdown_link"
                  onClick={() => setToggleDropDown(false)}
                >
                  My Profile
                </Link>

                <Link
                  href="/create-prompt"
                  className="dropdown_link"
                  onClick={() => setToggleDropDown(false)}
                >
                  Create Prompt
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setToggleDropDown(false);
                    signOut();
                  }}
                  className="mt-5 w-full black_btn"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type="button"
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  className='black_btn'
                >
                  Sign In / Sign Up
                </button>
              ))
            }
          </>
        )}
      </div>
    </nav>
  )
}

export default Nav