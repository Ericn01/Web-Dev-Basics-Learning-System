import React, { useState } from 'react';
import { Send, ArrowRight, ArrowLeft } from 'lucide-react';
import './HttpDemo.css';
import api from '../services/api';

const HttpDemo = () => {
  const [getResponse, setGetResponse] = useState(null);
  const [postData, setPostData] = useState('');
  const [postResponse, setPostResponse] = useState(null);
  const [loading, setLoading] = useState({ get: false, post: false });
  const [error, setError] = useState({ get: null, post: null });
  const [activeTab, setActiveTab] = useState('get');

  const handleGetRequest = async () => {
    setLoading(prev => ({ ...prev, get: true }));
    setError(prev => ({ ...prev, get: null }));
    
    try {
      const response = await api.get('/http-demo');
      setGetResponse(response.data);
    } catch (err) {
      setError(prev => ({ 
        ...prev, 
        get: 'Failed to make GET request. Please try again.' 
      }));
    } finally {
      setLoading(prev => ({ ...prev, get: false }));
    }
  };

  const handlePostRequest = async () => {
    setLoading(prev => ({ ...prev, post: true }));
    setError(prev => ({ ...prev, post: null }));
    
    try {
      const response = await api.post('/http-demo', { data: postData });
      setPostResponse(response.data);
    } catch (err) {
      setError(prev => ({ 
        ...prev, 
        post: 'Failed to make POST request. Please try again.' 
      }));
    } finally {
      setLoading(prev => ({ ...prev, post: false }));
    }
  };

  return (
    <div className="http-demo-container">
      <header className="http-demo-header">
        <h1>HTTP Methods Demo</h1>
        <p>Learn about HTTP GET and POST requests through interactive examples</p>
      </header>

      <div className="demo-tabs">
        <button 
          className={`tab-button ${activeTab === 'get' ? 'active' : ''}`}
          onClick={() => setActiveTab('get')}
        >
          GET Request
        </button>
        <button 
          className={`tab-button ${activeTab === 'post' ? 'active' : ''}`}
          onClick={() => setActiveTab('post')}
        >
          POST Request
        </button>
      </div>

      <div className="demo-content">
        {activeTab === 'get' ? (
          <div className="get-demo">
            <div className="demo-explanation">
              <h2>GET Request</h2>
              <p>
                GET requests are used to retrieve data from a server. They are:
              </p>
              <ul>
                <li>Read-only operations</li>
                <li>Data is sent through URL parameters</li>
                <li>Results can be cached</li>
                <li>Should not modify server data</li>
              </ul>
            </div>

            <div className="demo-interaction">
              <div className="request-preview">
                <h3>Request URL:</h3>
                <code>GET /webdev-learning/api/http-demo</code>
              </div>

              <button 
                className="send-button"
                onClick={handleGetRequest}
                disabled={loading.get}
              >
                <Send className="button-icon" />
                Send GET Request
              </button>

              {loading.get && <div className="loading">Sending request...</div>}
              {error.get && <div className="error-message">{error.get}</div>}

              {getResponse && (
                <div className="response-section">
                  <h3>Server Response:</h3>
                  <div className="response-data">
                    <pre>{JSON.stringify(getResponse, null, 2)}</pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="post-demo">
            <div className="demo-explanation">
              <h2>POST Request</h2>
              <p>
                POST requests are used to send data to a server. They are:
              </p>
              <ul>
                <li>Used to create or update resources</li>
                <li>Data is sent in the request body</li>
                <li>Not cached by default</li>
                <li>Can modify server data</li>
              </ul>
            </div>

            <div className="demo-interaction">
              <div className="request-preview">
                <h3>Request Details:</h3>
                <code>POST /webdev-learning/api/http-demo</code>
                
                <div className="post-input">
                  <h4>Request Body:</h4>
                  <textarea
                    value={postData}
                    onChange={(e) => setPostData(e.target.value)}
                    placeholder="Enter some data to send..."
                  />
                </div>
              </div>

              <button 
                className="send-button"
                onClick={handlePostRequest}
                disabled={loading.post}
              >
                <Send className="button-icon" />
                Send POST Request
              </button>

              {loading.post && <div className="loading">Sending request...</div>}
              {error.post && <div className="error-message">{error.post}</div>}

              {postResponse && (
                <div className="response-section">
                  <h3>Server Response:</h3>
                  <div className="response-data">
                    <pre>{JSON.stringify(postResponse, null, 2)}</pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HttpDemo;