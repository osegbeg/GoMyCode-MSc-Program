import Head from 'next/head';
import Image from 'next/image';
import Layout from '../components/Layout';
import { profile, experienceAndProjects } from '../data/portfolioData';
import styles from '../styles/Portfolio.module.css';

export async function getServerSideProps() {
  return {
    props: {
      items: experienceAndProjects,
    },
  };
}

export default function Projects({ items }) {
  return (
    <Layout>
      <Head>
        <title>Work & Projects | {profile.name}</title>
      </Head>

      <h1 className={styles.sectionTitle}>Work & Engineering Experience</h1>
      <p className={styles.sectionSubtitle}>
        Mission-critical payment switching, production support, and backend engineering delivery.
      </p>

      <div className={styles.grid}>
        {items.map((item) => (
          <article key={item.id} className={styles.card}>
            <Image
              src={item.image}
              alt={item.role}
              width={400}
              height={200}
              className={styles.projectImg}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Image src={item.logo} alt={item.company} width={28} height={28} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem' }}>{item.company}</strong>
                <small style={{ color: '#94a3b8' }}>
                  {item.location} | {item.period}
                </small>
              </div>
            </div>
            <h3>{item.role}</h3>
            <ul style={{ color: '#cbd5e1', fontSize: '0.92rem', paddingLeft: '1.1rem', lineHeight: 1.6 }}>
              {item.highlights.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <div className={styles.tagRow}>
              {item.tech.map((t) => (
                <span key={t} className={styles.tag}>
                  {t}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </Layout>
  );
}