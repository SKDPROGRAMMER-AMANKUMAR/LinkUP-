import React, { useState, useEffect } from 'react';
import client, { databases, DATABASE_ID, COLLECTION_ID } from '../appwrite/appwrite';
import { ID, Query, Role, Permission } from 'appwrite';
import { FiTrash2 } from 'react-icons/fi';
import Header from '../components/Header';
import { useAuth } from '../utils/AuthContext';

const Room = () => {
  const {user} = useAuth()
  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState('');

  useEffect(() => {
    getMessages();

    const unsubscribe = client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`, response => {
      console.log('Real-time event:', response);

      if (response.events.includes("databases.*.collections.*.documents.*.create")) {
        setMessages((prevState) => [...prevState, response.payload]);
      }
      if (response.events.includes("databases.*.collections.*.documents.*.delete")) {
        setMessages((prevState) =>
          prevState.filter((message) => message.$id !== response.payload.$id)
        );
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const getMessages = async () => {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.orderDesc('createdAt'),
      Query.limit(20), // Limit the number of messages to display
    ]);
    setMessages(response.documents);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      user_id: user.$id,
      username:user.name,
      body: messageBody,
    };

    let permission = [
        Permission.write(Role.user(user.$id)),
      ];
    

    await databases.createDocument(DATABASE_ID,
       COLLECTION_ID, 
       ID.unique(), 
       payload,
       permission);
    setMessageBody('');
  };

  const deleteMessage = async (message_id) => {
    await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, message_id);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header Component */}
      <Header />

      {/* Chat Room Content */}
      <div className="flex flex-col items-center px-4">
        {/* Chat Room Messages */}
        <div className="w-full max-w-3xl bg-gray-800 rounded-lg shadow-md p-6 mt-6">
          <h1 className="text-2xl font-semibold mb-6 text-center border-b pb-4 border-gray-700">
            LinkUP
          </h1>
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={message.$id}
                className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`relative max-w-sm p-4 rounded-lg shadow-lg ${
                    index % 2 === 0 ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white'
                  }`}
                >
                  <p className="font-bold">{message?.username ? (
                    <span>{message.username}</span>
                  ):(
                    <span>Anonymous user</span>
                  )}</p>
                  <p className="mt-2">{message.body}</p>
                  <span className="block text-xs text-gray-300 italic mt-2 text-right">
                    {new Date(message.$createdAt).toLocaleString()}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteMessage(message.$id)}
                    className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition"
                  >
                    {message.$permissions.includes(`delete(\"user:${user.$id}"\)`) && (
                    <FiTrash2 size={18} />
                    )}
                  </button>
                  <div
                    className={`absolute w-4 h-4 ${
                      index % 2 === 0 ? 'bg-blue-500' : 'bg-gray-700'
                    } rotate-45 ${index % 2 === 0 ? '-left-2 bottom-2' : '-right-2 bottom-2'}`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Input Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-3xl bg-gray-800 rounded-lg shadow-md p-4 flex flex-col items-center gap-4 mt-4"
        >
          <textarea
            required
            maxLength="1234"
            placeholder="Type your message..."
            value={messageBody}
            onChange={(e) => setMessageBody(e.target.value)}
            className="w-full bg-gray-900 text-white rounded-lg p-4 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-28"
          ></textarea>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Room;
