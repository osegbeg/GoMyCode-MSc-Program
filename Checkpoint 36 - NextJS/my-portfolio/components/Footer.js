import styles from '../styles/Portfolio.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>© {new Date().getFullYear()} Golden-Joe Osegbe. Built with Next.js.</p>
    </footer>
  );
}