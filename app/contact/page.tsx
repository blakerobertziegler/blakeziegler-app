'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
      } else {
        setError(data.message ?? 'Something went wrong.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-inner">
        <Link href="/" className="work-page-back" style={{ display: 'inline-flex' }}>
          ← Home
        </Link>

        {sent ? (
          <div className="contact-success">
            <div className="mono-label">// MESSAGE SENT</div>
            <h2 className="contact-success-heading">Got it.</h2>
            <p className="contact-success-sub">
              I&apos;ll get back in touch.
            </p>
            <Link href="/" className="not-found-btn" style={{ marginTop: 24 }}>
              ← Back home
            </Link>
          </div>
        ) : (
          <>
            <div>
              <div className="mono-label" style={{ marginBottom: 16 }}>// CONTACT</div>
              <h1 className="contact-heading">Let&apos;s talk.</h1>
              <p className="contact-sub">
                Real projects only. I read everything and respond to most.
              </p>
            </div>

            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="contact-field">
                <label className="contact-label" htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  className="contact-input"
                  placeholder="Your name"
                  value={form.name}
                  onChange={set('name')}
                  disabled={loading}
                  required
                />
              </div>

              <div className="contact-field">
                <label className="contact-label" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  className="contact-input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={set('email')}
                  disabled={loading}
                  required
                />
              </div>

              <div className="contact-field">
                <label className="contact-label" htmlFor="message">Message</label>
                <textarea
                  id="message"
                  className="contact-textarea"
                  placeholder="What's on your mind?"
                  value={form.message}
                  onChange={set('message')}
                  disabled={loading}
                  required
                />
              </div>

              {error && (
                <div className="unlock-error">{error}</div>
              )}

              <button
                type="submit"
                className="contact-submit"
                disabled={loading || !form.name || !form.email || !form.message}
              >
                {loading ? 'Sending…' : 'Send message'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
