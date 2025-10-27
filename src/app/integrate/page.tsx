'use client'

import React from 'react';
import { Copy, ChevronRight, Clock, Webhook } from 'lucide-react';
import Navbar from '../components/Navbar'

export default function APIKeyDashboard() {
  const apiKey = "sk-EXAMPLEDUMMYKEY1234567890abcdefABCDEF";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#e4e6eb', color: '#0f0f0f', fontFamily: 'sans-serif' }}>
        <Navbar />
      <main style={{ maxWidth: '48rem', margin: '0 auto', padding: '2.5rem 1rem' }}>
        <section style={{ backgroundColor: '#e5f7fd', padding: '1.5rem', borderRadius: '1rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <span style={{ backgroundColor: '#fde047', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 600 }}>API</span>
            <p style={{ marginTop: '0.75rem', fontSize: '0.875rem' }}>
              Integrate with our documentation services using the{' '}
              <span style={{ backgroundColor: '#fde047', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 600 }}>API</span>
            </p>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Simple to use, secure, and reliable</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', justifyContent: 'center', marginTop: '1.5rem' }}>
            <input
              readOnly
              value={apiKey}
              style={{ flex: 1, padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', backgroundColor: 'white', fontSize: '0.875rem', width: '100%', maxWidth: '600px' }}
            />
            <button
              onClick={copyToClipboard}
              style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', backgroundColor: 'white' }}
            >
              <Copy size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', marginTop: '1.25rem' }}>
            <button style={{ padding: '0.5rem 1rem', backgroundColor: '#151d28', color: 'white', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
              MANAGE ACTIVE KEYS
            </button>
            <button style={{ padding: '0.5rem 1rem', backgroundColor: '#151d28', color: 'white', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
              GENERATE NEW KEY
            </button>
            <button style={{ padding: '0.5rem 1rem', backgroundColor: '#151d28', color: 'white', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
              GENERATION HISTORY
            </button>
          </div>
        </section>

        <section style={{ backgroundColor: '#ffeaea', padding: '1.5rem', borderRadius: '1rem', marginTop: '1.5rem', borderTop: '1px solid #d1d5db' }}>
          <div style={{ padding: '1rem 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #d1d5db', cursor: 'pointer' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ backgroundColor: '#fde047', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 600 }}>API</span>
                <span style={{ fontWeight: 600 }}>Documentation</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                Comprehensive guides and <span style={{ backgroundColor: '#fde047', padding: '0.125rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 600 }}>API</span> reference
              </p>
            </div>
            <ChevronRight size={20} color="#9ca3af" />
          </div>

          <div style={{ padding: '1rem 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #d1d5db', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <Clock size={20} style={{ marginTop: '0.25rem' }} />
              <div>
                <span style={{ fontWeight: 600 }}>Rate Limits</span>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Up to 100 requests per minute</p>
              </div>
            </div>
            <ChevronRight size={20} color="#9ca3af" />
          </div>

          <div style={{ padding: '1rem 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <Webhook size={20} style={{ marginTop: '0.25rem' }} />
              <div>
                <span style={{ fontWeight: 600 }}>Webhooks</span>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Receive real-time notifications for events</p>
              </div>
            </div>
            <ChevronRight size={20} color="#9ca3af" />
          </div>
        </section>
      </main>
    </div>
  );
}
