import React, { Fragment, useEffect, useState } from 'react';
import Header from './Header';

const Inbox = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

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
            console.log(data)
          const emailsArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setEmails(emailsArray);
        } else {
          setEmails([]); // No emails found
        }
      } catch (error) {
        console.error('Error fetching emails:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, [sanitizedEmail]);

  return (
    <Fragment>
        <Header/>
        <div className="container mt-4">
      <h2>Inbox</h2>
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
              <th>Content</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {emails.map((email) => (
              <tr key={email.id}>
                <td>{email.from}</td>
                <td>{email.cc || 'N/A'}</td>
                <td>{email.content}</td>
                <td>{new Date(email.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </Fragment>
    
  );
};

export default Inbox;