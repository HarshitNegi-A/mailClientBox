import React, { Fragment } from 'react';
import Header from './Header';
import useEmails from './useMailApi';

const Sent = () => {
  const userEmail = localStorage.getItem('mailUserId');
  const {
    emails,
    loading,
    selectedEmail,
    deleteEmail,
    setSelectedEmail,
  } = useEmails(userEmail, 'sent');

  return (
    <Fragment>
      <Header />
      <div className="container mt-4">
        <h2>Sent Mails</h2>
        {loading ? (
          <p>Loading emails...</p>
        ) : emails.length === 0 ? (
          <p>No emails sent.</p>
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
                <tr
                  key={email.id}
                  style={{ fontWeight: email.read ? 'normal' : 'bold' }}
                >
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

export default Sent;
