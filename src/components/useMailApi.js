import { useState, useEffect } from 'react';

const BASE_URL = 'https://mail-client-box-8c893-default-rtdb.firebaseio.com/emails';

const useEmails = (userEmail, emailType = 'received') => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedEmail, setSelectedEmail] = useState(null);

  const sanitizedEmail = userEmail.replace(/[@.]/g, '_');

  const fetchEmails = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/${emailType}/${sanitizedEmail}.json`
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
        setUnreadCount(emailsArray.filter((email) => email.unread).length);
      } else {
        setEmails([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (emailId) => {
    const email = emails.find((email) => email.id === emailId);
    if (!email.read) {
      try {
        const response = await fetch(
          `${BASE_URL}/${emailType}/${sanitizedEmail}/${emailId}.json`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ read: true }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to mark email as read');
        }

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

  const deleteEmail = async (emailId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/${emailType}/${sanitizedEmail}/${emailId}.json`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        throw new Error('Failed to delete email');
      }

      setEmails((prevEmails) => prevEmails.filter((email) => email.id !== emailId));
      const deletedEmail = emails.find((email) => email.id === emailId);
      if (!deletedEmail.read) {
        setUnreadCount((prevCount) => prevCount - 1);
      }

      alert('Email deleted successfully!');
    } catch (error) {
      console.error('Error deleting email:', error);
      alert('Failed to delete email.');
    }
  };

  useEffect(() => {
    fetchEmails();
    const intervalId = setInterval(fetchEmails, 2000);

    return () => clearInterval(intervalId);
  }, [sanitizedEmail, emailType]); 

  return {
    emails,
    unreadCount,
    loading,
    selectedEmail,
    fetchEmails,
    markAsRead,
    deleteEmail,
    setSelectedEmail, 
  };
};

export default useEmails;
