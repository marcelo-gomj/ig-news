import { cloneElement, ReactElement } from 'react';
import Link, { LinkProps } from 'next/Link';
import { useRouter } from 'next/router';

interface ActiveLink extends LinkProps{
    children : ReactElement,
    activeClassName : string,
}

export function ActiveLink({children, activeClassName, ...rest}: ActiveLink){
    const { asPath } = useRouter();
    
    const className = asPath === rest.href ? activeClassName : '';
    
    return (
        <Link {...rest}>
            {cloneElement(children, {
                className,
            })}
        </Link>
    )
}