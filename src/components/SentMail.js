import React, { Fragment, useEffect, useState } from 'react';
import Header from './Header';

const SentMail = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState(null);

  const userEmail=localStorage.getItem('mailUserId')
  const sanitizedEmail = userEmail.replace(/[@.]/g, '_');

  useEffect(() => {
    const fetchSentEmails = async () => {
      try {
        const response = await fetch(
          `https://mail-client-box-8c893-default-rtdb.firebaseio.com/emails/sent/${sanitizedEmail}.json`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch sent emails');
        }

        const data = await response.json();
        if (data) {
          const emailsArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));

          setEmails(emailsArray);
        } else {
          setEmails([]); 
        }
      } catch (error) {
        console.error('Error fetching sent emails:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSentEmails();
  }, [sanitizedEmail]);

  const deleteEmail = async (emailId) => {
    try {
      const response = await fetch(
        `https://mail-client-box-8c893-default-rtdb.firebaseio.com/emails/sent/${sanitizedEmail}/${emailId}.json`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete email');
      }

      // Update the state locally
      setEmails((prevEmails) => prevEmails.filter((email) => email.id !== emailId));
      alert('Email deleted successfully!');
    } catch (error) {
      console.error('Error deleting email:', error);
      alert('Failed to delete email.');
    }
  };

  return (
    <Fragment>
        <Header/>
    <div className="container mt-4">
      <h2>Sent Mail</h2>
      {loading ? (
        <p>Loading sent emails...</p>
      ) : emails.length === 0 ? (
        <p>No sent emails found.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>To</th>
              <th>CC</th>
              <th>Content (Preview)</th>
              <th>Timestamp</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {emails.map((email) => (
              <tr key={email.id}>
                <td>{email.to}</td>
                <td>{email.cc || 'N/A'}</td>
                <td>{email.content.slice(0, 50)}...</td>
                <td>{new Date(email.timestamp).toLocaleString()}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setSelectedEmail(email)}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-danger btn-sm ms-2"
                    onClick={() => deleteEmail(email.id)}
                  >
                    Delete
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
                <p><strong>To:</strong> {selectedEmail.to}</p>
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

export default SentMail;
