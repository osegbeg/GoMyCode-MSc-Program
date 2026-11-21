import { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import { profile } from '../data/portfolioData';
import styles from '../styles/Portfolio.module.css';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <Layout>
      <Head>
        <title>Contact | {profile.name}</title>
      </Head>

      <h1 className={styles.sectionTitle}>Contact</h1>
      <p className={styles.sectionSubtitle}>
        Email: <a href={`mailto:${profile.email}`} style={{ color: '#38bdf8' }}>{profile.email}</a> | Mobile: {profile.mobile}
      </p>

      {submitted ? (
        <div className={styles.card}>
          <h3>Message Sent!</h3>
          <p style={{ color: '#cbd5e1' }}>
            Thank you, {formData.name}. Your message has been received—you can also reach me directly at{' '}
            <strong>{profile.email}</strong> or <strong>{profile.mobile}</strong>.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Name"
            required
            className={styles.input}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            required
            className={styles.input}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <textarea
            rows={5}
            placeholder="Message"
            required
            className={styles.textarea}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
          <button type="submit" className={styles.primaryBtn}>
            Send Message
          </button>
        </form>
      )}
    </Layout>
  );
}