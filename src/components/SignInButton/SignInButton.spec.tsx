import { render, screen } from '@testing-library/react';
import { SignInButton } from '.';
import { useSession } from 'next-auth/react';
import { mocked } from 'ts-jest/cli';
import '@testing-library/jest-dom'

jest.mock('next-auth/react');

describe('SignInButton component', () => {
   it('renders correctly when user is not aithenticated', () => {
      const useSessionMocked = mocked(useSession);
      useSessionMocked.mockedReturnValueOnce([null, false]);
      
      render(
         <SignInButton />
      )

      expect(screen.getByText('Sign in with Github')).toBeInTheDocument();
   })

   it('renders correctly when user is aithenticated', () => {
      const useSessionMocked = mocked(useSession);
      useSessionMocked.mockedReturnValueOnce([{
         user: {
            name: 'Jonh Doe', email: 'jonh.doe@example.com'},
            expires: 'fake-expires'}, false
      ]);
      
      render(
         <SignInButton />
      )

      expect(screen.getByText('Sign in with Github')).toBeInTheDocument();
   })

})