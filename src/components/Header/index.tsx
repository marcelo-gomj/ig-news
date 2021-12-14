import styles from './styles.module.scss';
import { SignInButton } from '../SignInButton'

export function Header(){
    return(
            <header className={styles.headerContainer}>
                <div className={styles.headerContent}>
                    <img src="/images/logo.svg" alt="logo"/>
                    <nav >
                        <a className={styles.active} href="#home">Home</a>
                        <a href="#post">Posts</a>
                    </nav>
                    <SignInButton />
                </div>
            </header>
        )
}


