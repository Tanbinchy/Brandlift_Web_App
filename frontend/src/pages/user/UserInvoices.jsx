import { useEffect, useState } from 'react';
import { FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { userApi } from '../../utils/api';

const formatCurrency = amount => `BDT ${Number(amount || 0).toLocaleString()}`;

export default function UserInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userApi.get('/bookings/my')
      .then(response => {
        const withInvoice = (response.data.data || []).filter(booking => booking.invoice?.amount);
        setInvoices(withInvoice);
      })
      .finally(() => setLoading(false));
  }, []);

  const total = invoices.reduce((sum, invoice) => sum + (invoice.invoice?.amount || 0), 0);
  const paid = invoices.filter(invoice => invoice.invoice?.isPaid).reduce((sum, invoice) => sum + (invoice.invoice?.amount || 0), 0);
  const unpaid = total - paid;

  return (
    <div>
      <div className="user-page-header">
        <div>
          <h2 className="user-page-title">Invoices & Payments</h2>
          <p className="user-page-subtitle">Review billed services and payment status.</p>
        </div>
      </div>

      {invoices.length > 0 && (
        <div className="user-grid-3" style={{ marginBottom: '28px' }}>
          {[
            { label: 'Total Billed', value: total, color: 'var(--brand-gold)' },
            { label: 'Paid', value: paid, color: '#16a34a' },
            { label: 'Outstanding', value: unpaid, color: unpaid > 0 ? '#dc2626' : '#16a34a' },
          ].map(summary => (
            <div key={summary.label} className="user-card" style={{ padding: '18px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--brand-gray)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>{summary.label}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: summary.color }}>{formatCurrency(summary.value)}</div>
            </div>
          ))}
        </div>
      )}

      {loading ? <div className="loading-center"><div className="spinner" /></div> : invoices.length === 0 ? (
        <div className="user-empty">
          <FileText size={40} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
          <h3>No invoices yet</h3>
          <p>Invoices will appear here once admin assigns payment details to your bookings.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {invoices.map(booking => (
            <div key={booking._id} className="user-card" style={{ borderColor: booking.invoice.isPaid ? 'rgba(22,163,74,0.2)' : 'rgba(220,38,38,0.2)', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: booking.invoice.isPaid ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: booking.invoice.isPaid ? '#16a34a' : '#dc2626', flexShrink: 0 }}>
                {booking.invoice.isPaid ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, color: 'var(--brand-dark)' }}>Invoice #{booking.invoice.invoiceNo || 'N/A'}</span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '2px 8px', borderRadius: '10px', background: booking.invoice.isPaid ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)', color: booking.invoice.isPaid ? '#16a34a' : '#dc2626', border: `1px solid ${booking.invoice.isPaid ? 'rgba(22,163,74,0.3)' : 'rgba(220,38,38,0.3)'}` }}>
                    {booking.invoice.isPaid ? 'PAID' : 'UNPAID'}
                  </span>
                </div>
                <div style={{ color: 'var(--brand-gray)', fontSize: '0.83rem' }}>
                  Service: {booking.serviceName} - Booked: {new Date(booking.date).toLocaleDateString()}
                </div>
                {booking.invoice.isPaid && booking.invoice.paidAt && (
                  <div style={{ color: '#16a34a', fontSize: '0.78rem', marginTop: '2px' }}>
                    Paid on {new Date(booking.invoice.paidAt).toLocaleDateString()}
                  </div>
                )}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: booking.invoice.isPaid ? '#16a34a' : '#dc2626' }}>
                {formatCurrency(booking.invoice.amount)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
