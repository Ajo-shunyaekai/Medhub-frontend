import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './policy.module.css';
import PrivacyPolicyModal from "./PrivcyPolicy"
 
const TermsAndConditions = ({showTnC, setShowTnC, isChecked, setIsChecked}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    console.log("setIsChecked", setIsChecked);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const [accepted, setAccepted] = useState(false); // Track acceptance of terms
    const navigate = useNavigate(); // Navigation hook
 
    const handleAccept = () => {
        console.log("here", setIsChecked);
        // setIsChecked(true); // Mark terms as accepted
        // setShowTnC(false)
        if (setIsChecked) {
            setIsChecked(true);
        } else {
            console.warn("setIsChecked is not defined");
        }
        setShowTnC(false)
    };
 
    const handleCancel = () => {
        console.log('Cancelled'); // Handle cancel action if necessary
    };
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Terms and Conditions</h1>
            <p>Welcome to MedHub Global, a brand of One Vision Technologies FZ-LLC (Ras Al Khaimah)!</p>
            <p>
                These terms and conditions ("Terms") govern your access to and use of our platform
                ("Platform"), including all features, functionalities, and services offered through MedHub
                Global. By signing up, accessing, or using the Platform, you agree to comply with and be
                bound by these Terms. If you do not agree to these Terms, please do not use the Platform.
            </p>
 
            {/* Sections */}
            <h2 className={styles.sectionTitle}>1. Definitions</h2>
            <ul className={styles.list}>
                <li>
                    <strong>Platform:</strong> The Platform refers to the MedHub Global online marketplace,
                    encompassing the website, mobile applications, and any related services offered by One
                    Vision Technologies.
                </li>
                <li>
                    <strong>User:</strong> A User is any individual or legal entity that accesses or utilizes
                    the Platform.
                </li>
                <li>
                    <strong>Content:</strong> Content includes all data, text, images, videos, and other
                    materials provided by the Platform or Users, whether created, uploaded, or shared.
                </li>
                <li>
                    <strong>Services:</strong> Services refer to the tools, features, and functionalities
                    offered through the Platform, such as listing products, buying, selling, and
                    communicating between parties.
                </li>
                <li>
                    <strong>One Vision Technologies:</strong> This refers to One Vision Technologies FZ-LLC,
                    the entity managing and operating the MedHub Global Platform, registered in the RAKEZ
                    Free Zone, Ras Al Khaimah, United Arab Emirates.
                </li>
            </ul>
 
            {/* Continue similarly for other sections */}
            <h2 className={styles.sectionTitle}>2. Eligibility</h2>
            <p>
                <strong>Minimum Requirements:</strong> Users must be at least 18 years of age and have the
                legal capacity to enter into binding agreements. By registering, you confirm that you meet
                these criteria.
            </p>
            <p>
                <strong>Purpose of Use:</strong> The Platform is designed exclusively for businesses and
                individuals engaged in healthcare procurement. Any other use, including unauthorized
                commercial use, is prohibited.
            </p>
            <p>
                <strong>Accuracy of Information:</strong> All information provided during registration or
                use of the Platform must be accurate, complete, and up-to-date. Providing false, misleading,
                or incomplete information constitutes a breach of these Terms and may result in legal
                action, including penalties and account suspension.
            </p>
            {/* Third Section */}
            <h2 className={styles.sectionTitle}>3. Account Registration</h2>
            <p>
                <strong>Account Creation: </strong> Users must create an account to access specific features of the Platform. This involves providing personal and business information, including contact details and a valid email address.
            </p>
            <p>
                <strong>Responsibility for Credentials:</strong> Users are responsible for maintaining the confidentiality of their account credentials. Any unauthorized access resulting from a failure to safeguard login details is the User’s responsibility.
 
            </p>
            <p>
                <strong>Account Verification: </strong>One Vision Technologies reserves the right to verify account details and suspend or terminate accounts if irregularities are detected, including but not limited to false or outdated information.
 
            </p>
            <p>
                <strong>Updating Details:</strong>Users are required to keep their contact and payment information accurate and current at all times. Failure to comply may result in restricted access or account deactivation.
 
            </p>
            <p>
                <strong>Accountability for Content: </strong>Users are solely responsible for the legality, accuracy, and appropriateness of the content they upload, share, or distribute on the Platform. Violations may result in suspension, termination, or legal action.
 
            </p>
            {/* Fourth Section */}
 
            <h2 className={styles.sectionTitle}>4. Prohibited Activities</h2>
            <p>
                <strong>Illegal, Counterfeit, or Restricted Goods:</strong>  Users are strictly prohibited from engaging in the trade of goods or services that are illegal, counterfeit, or otherwise restricted by applicable laws. This includes, but is not limited to, unlicensed pharmaceuticals, falsified medical devices, and other products deemed unlawful or harmful by regulatory authorities.
 
            </p>
            <p>
                <strong>Misleading or Fraudulent Transactions:</strong> Any attempt to mislead other users through fraudulent transactions is strictly prohibited. This includes falsifying information about the nature, quality, or origin of goods and services offered on the Platform.
 
 
            </p>
            <p>
                <strong>Harmful or Malicious Software:</strong>Users are not allowed to upload, share, or distribute software or files that contain viruses, malware, or other harmful code intended to disrupt the Platform’s operations or compromise user data.
 
            </p>
            <p>
                <strong>Misrepresentation and Impersonation:</strong> Users must accurately represent their identity, affiliation, and intentions on the Platform. Impersonating another person, company, or entity for deceitful purposes is a violation of these Terms and may result in immediate account termination and legal action.
 
            </p>
 
            {/* Fifth Section */}
 
            <h2 className={styles.sectionTitle}>5. Transactions and Fees</h2>
            <p>
                <strong>Intermediary Role:</strong> The Platform acts as an intermediary to facilitate transactions between buyers and sellers. One Vision Technologies is not a party to these transactions and does not assume liability for the accuracy, quality, or legality of products or services exchanged.
 
            </p>
            <p>
                <strong>Direct Transactions:</strong> Buyers and sellers interact directly to finalize terms and conditions. One Vision Technologies does not guarantee fulfillment or enforce contractual obligations between parties.
 
 
            </p>
            <p>
                <strong>Platform Fees:</strong>Some features or services on the Platform may incur fees, which will be clearly communicated in advance. Users agree to these fees upon using the respective services.
 
            </p>
            <p>
                <strong>Tax Compliance:</strong>Users are responsible for understanding and fulfilling their tax obligations related to transactions conducted on the Platform, as per their jurisdictional requirements.
 
 
            </p>
 
            {/* Sixth Section */}
 
            <h2 className={styles.sectionTitle}>6. Feedback and Dispute Mechanism</h2>
            <p>
                <strong>Feedback Integrity:</strong> Users are encouraged to provide honest and constructive feedback. False, defamatory, or misleading reviews are strictly prohibited and may lead to account action.
 
            </p>
            <p>
                <strong>Dispute Resolution:</strong>  For disputes arising from buyer-seller interactions, One Vision Technologies may provide limited mediation services. However, the company does not guarantee resolution and is not liable for outcomes.
 
 
            </p>
            <p>
                <strong>Amicable Resolution:</strong>Users are encouraged to resolve disputes directly and amicably before seeking external remedies.
 
            </p>
 
            {/* seventh Section */}
 
            <h2 className={styles.sectionTitle}>7. Feedback and Dispute Mechanism</h2>
            <p>
                <strong>Consent to Data Use:</strong> By using the Platform, Users consent to the collection, storage, and processing of their personal and transactional data as described in our Privacy Policy.
 
            </p>
            <p>
                <strong>Data Purposes:</strong> The data collected through the Platform is used for the following purposes:
 
 
            </p>
            <p>
                <strong>Improving Platform Functionality and User Experience:</strong> Data insights help us enhance Platform navigation, speed, and usability, ensuring users enjoy seamless access to features and tools.
 
 
            </p>
            <p>
                <strong>Processing Transactions and Payments:</strong>Your information is used to facilitate secure and efficient payment transactions, ensuring prompt confirmation and delivery of goods and services.
 
 
            </p>
            <p>
                <strong>Fraud Detection and Security Measures: </strong> Data is analyzed to identify suspicious activities, prevent fraud, and protect the Platform and its users from malicious actions.
 
 
            </p>
            <p>
                <strong>Regulatory Compliance and Reporting:</strong> Information may be used to meet legal obligations, such as tax reporting, licensing, and compliance with local or international regulations.
 
 
            </p>
            <p>
                <strong>Marketing Communications and Promotions:</strong>With your consent, we may use your data to inform you about offers, updates, and promotions tailored to your interests. You may opt out of marketing communications at any time.
 
            </p>
 
            <p>
                <strong>Third-Party Sharing:</strong> Data may be shared with trusted service providers for operational purposes, such as payment processing or analytics, subject to confidentiality agreements.
 
 
 
            </p>
            <p>
                <strong>Data Deletion: </strong>Users may request data deletion at any time by contacting connect@medhub.global. Data will be deleted unless retention is required by law.
 
            </p>
            {/* Eight Section */}
 
            <h2 className={styles.sectionTitle}>8. Force Majeure</h2>
            <p>
                One Vision Technologies will not be held liable for delays or service disruptions caused by events beyond its reasonable control, including but not limited to natural disasters, pandemics, cyberattacks, and governmental restrictions.
 
            </p>
            {/* Nine Section */}
 
            <h2 className={styles.sectionTitle}>9. Indemnification</h2>
            <p>
                <strong>User Responsibility:</strong> Users agree to indemnify and hold One Vision Technologies harmless from any claims, damages, or losses arising from:
 
            </p>
            <p>
                <strong>Breaches of These Terms: </strong>Any violations of these Terms by Users, whether intentional or unintentional, that result in damages to One Vision Technologies or other parties.
            </p>
            <p>
                <strong>Violations of Applicable Laws:</strong> Any legal non-compliance or regulatory breaches committed by Users during their interaction with the Platform.
 
 
            </p>
            <p>
                <strong>Disputes Involving Third Parties:</strong>Claims, disputes, or liabilities involving third-party transactions or interactions initiated through the Platform.
 
 
            </p>
            <p>
                <strong>Legal Costs:</strong>Users shall also cover any legal fees incurred by One Vision Technologies in defending such claims.
 
 
            </p>
 
            {/* Ten Section */}
 
            <h2 className={styles.sectionTitle}>10. Accessibility and Non-Discrimination</h2>
            <p>
                One Vision Technologies is committed to ensuring accessibility for all Users, including individuals with disabilities. Accessibility concerns can be addressed by contacting connect@medhub.global.
 
            </p>
            {/* Eleven Section */}
 
            <h2 className={styles.sectionTitle}>11. Third-Party Integrations</h2>
            <p>
                <strong>Service Use:</strong>The Platform incorporates third-party services (e.g., logistics providers, payment processors). While these integrations enhance functionality, One Vision Technologies does not guarantee their reliability.
 
            </p>
            <p>
                <strong>Third-Party Terms: </strong> Interactions with these services are governed by their respective terms and conditions, which Users must adhere to.
            </p>
 
            {/* 12 Section */}
 
            <h2 className={styles.sectionTitle}>12. Governing Law and Dispute Resolution</h2>
            <p>
                <strong>Jurisdiction: </strong>These Terms are governed by the laws of the UAE.
 
            </p>
            <p>
                <strong>Dispute Resolution:</strong> Disputes will be resolved through mediation. If unresolved, they will fall under the jurisdiction of the courts of the Ras Al Khaimah Economic Zone (RAKEZ).
 
            </p>
 
            {/* 13 Section */}
 
            <h2 className={styles.sectionTitle}>13. Contact Information</h2>
            <p>
                <strong>One Vision Technologies FZ-LLC</strong>These Terms are governed by the laws of the UAE.
                <p>RAKEZ Free Zone, Ras Al Khaimah, United Arab Emirates</p>
            </p>
            <p>
                <strong>Email:</strong>connect@medhub.global
            </p>
            <p>
                By signing up or using the Platform, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.
 
            </p>
            <div className={styles.privacypolicy}>
                <div className={styles.termscondition} onClick={openModal}>Privacy Policy</div>
                <PrivacyPolicyModal isOpen={isModalOpen} onClose={closeModal} />
            </div>
            <div className="signup-form-cont-button">
                {!accepted && (
                        <button
                            type="button"
                            className="signup-form-button-submit"
                            onClick={handleAccept}
                        >
                            Accept
                        </button>
                )}
            </div>
        </div>
    );
};
 
export default TermsAndConditions;