import { FaGithub } from 'react-icons/fa'
import styles from './styles.module.scss'
import { FiX } from 'react-icons/fi';
import { signIn, useSession, signOut } from 'next-auth/react'
 
export function SignInButton() {
    const {data:session} = useSession();

    return session ? (
        <button 
            type="button"
            className={styles.signInButton}
        >
            <FaGithub color ="#84d361"/>
            Marcelo Gomes
            <FiX 
                color ="#737380" 
                className={styles.closeIcon}
                onClick={() => signOut()}
            />
        </button>
    ) : (
        <button 
            type="button"
            className={styles.signInButton}
            onClick={() => signIn('github')}
        >
            <FaGithub 
                color ="#eba417"
            />
            Sign in with GitHub
        </button> 
    )
}