import { getByText, render } from '@testing-library/react';
import { ActiveLink } from '.';

jest.mock('next/router', () => {
    return {
        useRouter () {
            return {
                asPath: '/'
            }
        }
    }
})

test('active link renders correctly', () => {
    const { debug, getByText } = render(
        
        <ActiveLink 
            activeClassName="active" 
            href="/"        
        >
            <a>Home</a>
        </ActiveLink>
    )

   expect(getByText('Home')).toBeInTheDocument();
})