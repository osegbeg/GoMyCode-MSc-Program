import Head from 'next/head';
import Layout from '../components/Layout';
import { profile, skills, education, certifications } from '../data/portfolioData';
import styles from '../styles/Portfolio.module.css';

export default function About() {
  return (
    <Layout>
      <Head>
        <title>About & Resume | {profile.name}</title>
      </Head>

      <h1 className={styles.sectionTitle}>About & Resume</h1>
      <p className={styles.sectionSubtitle}>
        {profile.role} — {profile.location}
      </p>

      <div className={styles.card} style={{ marginBottom: '2rem' }}>
        <h3>Professional Summary</h3>
        <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>{profile.summary}</p>
      </div>

      <h2 className={styles.sectionTitle} style={{ fontSize: '1.5rem' }}>Key Skills</h2>
      <div className={styles.grid} style={{ marginBottom: '2.5rem' }}>
        {skills.map((group) => (
          <div key={group.category} className={styles.card}>
            <h3>{group.category}</h3>
            <div className={styles.tagRow}>
              {group.items.map((skill) => (
                <span key={skill} className={styles.tag}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h3>Education</h3>
          {education.map((edu) => (
            <div key={edu.program} style={{ marginBottom: '0.75rem' }}>
              <strong>{edu.program}</strong>
              <p style={{ color: '#cbd5e1', margin: '0.2rem 0' }}>{edu.institution}</p>
              <small style={{ color: '#94a3b8' }}>{edu.dates}</small>
            </div>
          ))}
        </div>

        <div className={styles.card}>
          <h3>Professional Certifications</h3>
          <ul style={{ color: '#cbd5e1', paddingLeft: '1.2rem', lineHeight: 1.8 }}>
            {certifications.map((cert) => (
              <li key={cert}>{cert}</li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
}