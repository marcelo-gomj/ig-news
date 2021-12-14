import { FaGithub } from 'react-icons/fa'
import styles from './styles.module.scss'
import { FiX } from 'react-icons/fi'


export function SignInButton() {
    const isLoggedIn = true;
    return isLoggedIn ? (
        <button 
            type="button"
            className={styles.signInButton}
        >
            <FaGithub color ="#84d361"/>
            Marcelo Gomes
            <FiX color ="#737380" className={styles.closeIcon} />
        </button>
    ) : (
        <button 
            type="button"
            className={styles.signInButton}
        >
            <FaGithub color ="#eba417"/>
            Sign in with GitHub
        </button> 
    )
}