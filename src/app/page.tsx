'use client';

import React, { useState } from 'react';
import { Link, Search, AlertCircle } from 'lucide-react';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { VideoResultCard } from '@/components/features/VideoResultCard';
import styles from './page.module.css';

export default function Home() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to extract video details');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Header />
      
      <main className={styles.mainContent}>
        <section className={styles.heroSection}>
          <div className={`animate-fade-in ${styles.heroText}`}>
            <h1 className={styles.title}>
              Download Media from <span className="text-gradient">Anywhere</span>
            </h1>
            <p className={styles.subtitle}>
              The fastest, most premium way to download videos from YouTube, Instagram, and Facebook in high quality.
            </p>
          </div>

          <div className={`animate-fade-in glass-panel ${styles.searchContainer}`}>
            <form onSubmit={handleSubmit} className={styles.searchForm}>
              <div className={styles.inputGroup}>
                <Input
                  type="url"
                  placeholder="Paste video link here (e.g., https://youtube.com/...)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  icon={<Link size={20} />}
                  required
                />
              </div>
              <Button type="submit" isLoading={isLoading} className={styles.submitBtn}>
                {!isLoading && <Search size={20} />}
                Extract
              </Button>
            </form>
          </div>

          {error && (
            <div className={`animate-fade-in glass-panel ${styles.errorContainer}`}>
              <AlertCircle className={styles.errorIcon} />
              <p>{error}</p>
            </div>
          )}

          {result && (
            <div className={styles.resultContainer}>
              <VideoResultCard
                title={result.title}
                thumbnail={result.thumbnail}
                duration={result.duration}
                videoFormats={result.videoFormats}
                audioFormats={result.audioFormats}
                directUrl={result.directUrl}
                originalUrl={url}
              />
            </div>
          )}
        </section>

        <section className={styles.featuresSection}>
          <div className={styles.featureGrid}>
            <div className={`glass-panel ${styles.featureCard}`}>
              <div className={styles.featureIconWrapper}>✨</div>
              <h3>Premium Quality</h3>
              <p>Get the highest possible resolution directly from the source.</p>
            </div>
            <div className={`glass-panel ${styles.featureCard}`}>
              <div className={styles.featureIconWrapper}>⚡</div>
              <h3>Lightning Fast</h3>
              <p>Direct download links generated in seconds without waiting.</p>
            </div>
            <div className={`glass-panel ${styles.featureCard}`}>
              <div className={styles.featureIconWrapper}>🛡️</div>
              <h3>Secure & Private</h3>
              <p>No tracking. Your downloads are private and directly fetched.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
