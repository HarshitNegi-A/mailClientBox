import React, { Fragment, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Header from './Header';

const ComposeMail = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const from = localStorage.getItem("mailUserId"); // Allow dynamic "From" email

  const handleSubmit = async () => {
    if (!from || !to) {
      alert('Sender ("From") and Receiver ("To") email addresses are required.');
      return;
    }

    // Extract plain text from the EditorState
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const plainTextContent = rawContentState.blocks
      .map((block) => block.text)
      .join('\n');

    const mailData = {
      to,
      cc,
      content: plainTextContent,
      from,
      timestamp: Date.now(),
    };

    try {
      // Store email in the "sent" box
      const sanitizedFrom = from.replace(/[@.]/g, '_');
  const sanitizedTo = to.replace(/[@.]/g, '_');
      await fetch(
        `https://mail-client-box-8c893-default-rtdb.firebaseio.com/emails/sent/${sanitizedFrom}.json`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mailData),
        }
      );

      // Store email in the "received" box
      await fetch(
        `https://mail-client-box-8c893-default-rtdb.firebaseio.com/emails/received/${sanitizedTo}.json`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mailData),
        }
      );

      alert('Email sent successfully!');
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email.');
    }
  };

  return (
    <Fragment>
      <Header/>
      <div className="container border p-4">
      <h3>Compose Mail</h3>

      {/* From Field */}
      <div className="mb-3">
        <label htmlFor="from" className="form-label">
          From:
        </label>
        <input
          type="email"
          className="form-control"
          id="from"
          value={from}
          
        />
      </div>

      {/* To Field */}
      <div className="mb-3">
        <label htmlFor="to" className="form-label">
          To:
        </label>
        <input
          type="email"
          className="form-control"
          id="to"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="Recipient email address"
        />
      </div>

      {/* CC Field */}
      <div className="mb-3">
        <label htmlFor="cc" className="form-label">
          CC:
        </label>
        <input
          type="email"
          className="form-control"
          id="cc"
          value={cc}
          onChange={(e) => setCc(e.target.value)}
          placeholder="CC email address"
        />
      </div>

      {/* Editor */}
      <div className="mb-3">
        <Editor
          editorState={editorState}
          onEditorStateChange={setEditorState}
          toolbarClassName="toolbar-class"
          wrapperClassName="wrapper-class"
          editorClassName="editor-class"
        />
      </div>

      {/* Submit Button */}
      <button onClick={handleSubmit} className="btn btn-primary">
        Send Mail
      </button>
    </div>
    </Fragment>
    
  );
};

export default ComposeMail;
