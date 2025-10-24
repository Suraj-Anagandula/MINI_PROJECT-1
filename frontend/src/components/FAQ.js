import React, { useState } from "react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I register for the complaint system?",
      answer:
        "To register, click on the 'Register' button at the top right corner. You'll need your student ID, mobile number, and email address. After registration, you'll receive an OTP on your mobile for verification.",
    },
    {
      question: "What types of complaints can I submit?",
      answer:
        "You can submit complaints related to various hostel maintenance issues including electrical problems (fans, lights, sockets), plumbing issues, furniture repairs, internet connectivity, sanitation, and more.",
    },
    {
      question: "How long does it take to resolve a complaint?",
      answer:
        "The resolution time depends on the type and complexity of the issue. On average, complaints are resolved within 2-3 days. Urgent issues are prioritized and may be resolved faster.",
    },
    {
      question: "Can I track the status of my complaint?",
      answer:
        "Yes, you can track the status of your complaint in your dashboard. The system provides real-time updates on whether your complaint is pending, in progress, or resolved.",
    },
    {
      question: "What should I do if I forget my password?",
      answer:
        "Click on the 'Forgot Password' link on the login page. Enter your student ID and registered mobile number to receive an OTP. Use this OTP to reset your password.",
    },
    {
      question: "Can I upload photos with my complaint?",
      answer:
        "Yes, you can upload photos or videos to provide visual evidence of the issue. This helps the maintenance team understand the problem better and resolve it faster.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Frequently Asked Questions</h2>
          <p className="text-muted">
            Find answers to common questions about our complaint system
          </p>
        </div>

        <div className="accordion">
          {faqs.map((faq, index) => (
            <div key={index} className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className={`accordion-button ${
                    openIndex === index ? "" : "collapsed"
                  }`}
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  style={{ color: "black" }} // Force text color to black
                >
                  {faq.question}
                </button>
              </h2>
              <div
                className={`accordion-collapse collapse ${
                  openIndex === index ? "show" : ""
                }`}
              >
                <div className="accordion-body">{faq.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
