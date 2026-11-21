import Link from 'next/link';
import styles from '../styles/Portfolio.module.css';

export default function Navbar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.brand}>
          Golden-Joe<span>.dev</span>
        </Link>
        <nav className={styles.navLinks}>
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </div>
    </header>
  );
}