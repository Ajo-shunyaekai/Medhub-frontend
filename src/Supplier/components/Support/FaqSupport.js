import React from 'react'
import Accordion from 'react-bootstrap/Accordion';
import './faqSupport.css'

const FaqSupport = () => {
    return (
        <>
            <div className="support-heading">FAQ</div>
          
            <div className='faq-container'>

                < Accordion >
                    <Accordion.Item eventKey="0" className="faq-cover">
                        <Accordion.Header className="faq-heading"> What is MedHub Global ?</Accordion.Header>
                        <Accordion.Body>
                            MedHub Global is a healthcare procurement platform that automates the procurement process, integrating logistics and providing real-time updates to enhance operational efficiency.
                        </Accordion.Body>
                    </Accordion.Item>



                    <Accordion.Item eventKey="1" className="faq-cover">
                        <Accordion.Header className="faq-heading">How does MedHub Global benefit suppliers ?</Accordion.Header>
                        <Accordion.Body className="faq-content" >
                            Suppliers can expand their market reach by connecting with a global network of verified buyers, including hospitals, private clinics, chemists, and government authorities. The platform also offers features like distress sales for surplus items and invoice factoring for faster payments.
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="2" className="faq-cover">
                        <Accordion.Header className="faq-heading">How does MedHub Global benefit buyers ?</Accordion.Header>
                        <Accordion.Body className="faq-content">
                            Buyers gain access to a global network of vetted distributors and manufacturers, ensuring consistent quality and reliability. The platform's AI-powered insights help in cost management by analyzing pricing trends, and integrated logistics solutions minimize supply chain disruptions.
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="3" className="faq-cover">
                        <Accordion.Header className="faq-heading"> What features does MedHub Global offer ?</Accordion.Header>
                        <Accordion.Body className="faq-content">
                            MedHub Global offers procurement process automation, integrated logistics support, invoice factoring, and a secondary marketplace for distress sales. These features aim to streamline procurement operations and enhance efficiency.
                        </Accordion.Body>
                    </Accordion.Item>

                 
                </ Accordion>
            </div>
        </>
    )
}

export default FaqSupport
