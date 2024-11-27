import React, { useState, useEffect } from 'react';
import '../styling/FaqComponent.css';

const FaqComponent = () => {
  const [faqs, setFaqs] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  // Fetch FAQs from the backend API
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await fetch('http://localhost:3000/webdev-learning/api/faqs');
        const data = await response.json();

        if (data.success) {
          setFaqs(data.data);
        } else {
          console.error('Failed to fetch FAQs');
        }
      } catch (error) {
        console.error('An error occurred while fetching FAQs:', error);
      }
    };

    fetchFaqs();
  }, []);

  console.log(faqs)

  const toggleQuestion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h2>Frequently asked questions</h2>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <div className="faq-question" onClick={() => toggleQuestion(index)}>
              {faq.question}
              <span className="faq-toggle">{activeIndex === index ? '-' : '+'}</span>
            </div>
            {activeIndex === index && <div className="faq-answer">{faq.answer}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqComponent;
