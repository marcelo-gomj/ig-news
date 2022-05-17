import { fireEvent, render, screen } from '@testing-library/react';
import { SubscribeButton } from '.';
import { signIn, useSession } from 'next-auth/react';
import { mocked } from 'ts-jest/cli';
import { useRouter } from 'next/router';

jest.mock('next-auth/react');
jest.mock('next/router');

describe('SubscribeButton component', () => {

   it('renders correctly', () => {
      const useSessionMocked = mocked(useSession);

      useSessionMocked.mockReturnValueOnce([null, false]);

      render(
         <SubscribeButton />
      )

      expect(screen.getByText('Subscribe Now')).toBeInTheDocument();
   })

   it('redirects user to sign in when not authenticated', () => {
      const signInMocked = mocked(signIn);
      const useSessionMocked = mocked(useSession);

      useSessionMocked.mockReturnValueOnce([null, false])
      
      render(
         <SubscribeButton />
      )

      const subscribeButton = screen.getByText('Subscribe now');

      fireEvent.click(subscribeButton)

      expect(signInMocked).toHaveBeenCalled();
   })

   it('redirects tp posts when user already has a subscription', () => {
      const useRouterMocked = mocked(useRouter);
      const useSessionMocked = mocked(useSession);
      const pushMocked = jest.fn();

      useSessionMocked.mockReturnValueOnce([
         {
            user: { name: 'Jonh Doe', email: 'jonh.doe@exampe.com' },
            expires: 'fake-expires'
         }, false
      ])

      useRouterMocked.mockReturnValueOnce({
         push: jest.fn()
      } as any)

      render(
         <SubscribeButton />
      )

      const subscribeButton = screen.getByText('subscribe now');

      fireEvent.click(subscribeButton);

      expect(pushMocked).toHaveBeenCalledWith('/posts');
   })
})