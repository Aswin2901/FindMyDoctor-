import React from 'react';
import './MessageGroup.css';

function MessageGroup({ messages, isSender }) {
  console.log('is_sender' , isSender)
  return (
    <div className={`message-group ${isSender ? 'sent' : 'received'}`}>
      {messages.map((message, index) => (
        console.log(message , 'message !!!!!!!!!!!!!!') ,

        <div key={index} className="message-bubble">
          {message}
        </div>
      ))}
    </div>
  );
}

export default MessageGroup;
