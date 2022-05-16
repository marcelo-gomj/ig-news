import { render, screen } from '@testing-library/react';
import { ActiveLink } from '.';

// simulate the router module
jest.mock('next/router', () => {
   return {
      useRouter() {
         return {
            asPath: '/'
         }
      }
   }
})

//add category for test
describe('ActiveLink component', () => {
   it('renders correctly', () => {
      render(

         <ActiveLink
            activeClassName="active"
            href="/"
         >
            <a>Home</a>
         </ActiveLink>
      )
      
      // Analize the component virtual
      expect(screen.getByText('Home')).toBeInTheDocument();
   })

   it('adds active class if the link as currently active', () => {
      render(

         <ActiveLink
            activeClassName="active"
            href="/"
         >
            <a>Home</a>
         </ActiveLink>
      )
      
      // Analize the component virtual
      expect(screen.getByText('Home')).toHaveClass('active');
   })
})