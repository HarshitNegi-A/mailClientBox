import React, { Fragment, useEffect, useState } from 'react';
import Header from './Header';

const Inbox = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedEmail, setSelectedEmail] = useState(null);

  // Replace "@" and "." in email for Firebase key compatibility
  const userEmail=localStorage.getItem('mailUserId')
  const sanitizedEmail = userEmail.replace(/[@.]/g, '_');

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await fetch(
          `https://mail-client-box-8c893-default-rtdb.firebaseio.com/emails/received/${sanitizedEmail}.json`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch emails');
        }

        const data = await response.json();
        if (data) {
          const emailsArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));

          setEmails(emailsArray);
          setUnreadCount(emailsArray.filter((email) => !email.read).length);
        } else {
          setEmails([]); // No emails found
          setUnreadCount(0);
        }
      } catch (error) {
        console.error('Error fetching emails:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, [sanitizedEmail]);

  const markAsRead = async (emailId) => {
    const email = emails.find((email) => email.id === emailId);
    if (!email.read) {
      try {
        // Update the email's "read" status in Firebase
        const response = await fetch(
          `https://mail-client-box-8c893-default-rtdb.firebaseio.com/emails/received/${sanitizedEmail}/${emailId}.json`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ read: true }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to mark email as read');
        }

        // Update the state locally
        setEmails((prevEmails) =>
          prevEmails.map((e) =>
            e.id === emailId ? { ...e, read: true } : e
          )
        );
        setUnreadCount((prevCount) => prevCount - 1);
      } catch (error) {
        console.error('Error marking email as read:', error);
      }
    }
    setSelectedEmail(email);
  };

  return (
    <Fragment>
        <Header/>
    <div className="container mt-4">
      <h2>Inbox</h2>
      <p>Total Unread Messages: {unreadCount}</p>
      {loading ? (
        <p>Loading emails...</p>
      ) : emails.length === 0 ? (
        <p>No emails received.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>From</th>
              <th>CC</th>
              <th>Content (Preview)</th>
              <th>Timestamp</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {emails.map((email) => (
              <tr key={email.id} style={{ fontWeight: email.read ? 'normal' : 'bold' }}>
                <td>{email.from}</td>
                <td>{email.cc || 'N/A'}</td>
                <td>{email.content.slice(0, 50)}...</td>
                <td>{new Date(email.timestamp).toLocaleString()}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => markAsRead(email.id)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedEmail && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Email Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedEmail(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p><strong>From:</strong> {selectedEmail.from}</p>
                <p><strong>CC:</strong> {selectedEmail.cc || 'N/A'}</p>
                <p><strong>Timestamp:</strong> {new Date(selectedEmail.timestamp).toLocaleString()}</p>
                <p><strong>Content:</strong></p>
                <p>{selectedEmail.content}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedEmail(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </Fragment>
  );
};

export default Inbox;
