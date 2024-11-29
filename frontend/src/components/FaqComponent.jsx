import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import '../styling/FaqComponent.css';
import api from '../services/api';

const FaqComponent = () => {
  const [faqs, setFaqs] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch FAQs from the backend API
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await api.get('/faqs');
        const faqs = response.data.data;
        setFaqs(faqs);
        setLoading(false);
      } catch (error) {
        setError('Failed to load FAQs. Please try again later.');
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const toggleQuestion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  if (loading) {
    return <div className="faq-loader">Loading FAQs...</div>;
  }

  if (error) {
    return <div className="faq-error">{error}</div>;
  }

  return (
    <div className="faq-container">
      <header className="faq-header">
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common questions about our learning platform</p>
      </header>

      <div className="faq-content">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className={`faq-item ${activeIndex === index ? 'active' : ''}`}
          >
            <button 
              className="faq-question" 
              onClick={() => toggleQuestion(index)}
              aria-expanded={activeIndex === index}
            >
              <span>{faq.question}</span>
              {activeIndex === index ? (
                <ChevronUp className="faq-icon" />
              ) : (
                <ChevronDown className="faq-icon" />
              )}
            </button>
            <div className={`faq-answer ${activeIndex === index ? 'show' : ''}`}>
              {faq.answer}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqComponent;
