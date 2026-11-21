import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '../components/Layout';
import { profile } from '../data/portfolioData';
import styles from '../styles/Portfolio.module.css';

export async function getServerSideProps() {
  return {
    props: {
      profile,
      renderedAt: new Date().toUTCString(),
    },
  };
}

export default function Home({ profile, renderedAt }) {
  return (
    <Layout>
      <Head>
        <title>{profile.name} | Portfolio</title>
      </Head>

      <section className={styles.hero}>
        <div className={styles.heroText}>
          <span className={styles.badge}>Available for Software & IDT Roles</span>
          <h1 className={styles.heroTitle}>Hi, I&apos;m {profile.name}</h1>
          <p className={styles.heroSubtitle}>{profile.summary}</p>
          <div className={styles.ctaGroup}>
            <Link href="/projects" className={styles.primaryBtn}>
              View My Projects
            </Link>
            <Link href="/contact" className={styles.secondaryBtn}>
              Get In Touch
            </Link>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '1.5rem' }}>
            Server-side rendered on: {renderedAt}
          </p>
        </div>

        <div className={styles.avatarWrapper}>
          <Image
            src={profile.avatar}
            alt={profile.name}
            width={240}
            height={240}
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
      </section>
    </Layout>
  );
}