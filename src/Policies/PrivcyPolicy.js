import React from "react";
import styles from './policy.module.css';

const PrivacyPolicy = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className={styles.modalOverlay}>
        <div className={styles.modalBox}>
            <button className={styles.closeButton} onClick={onClose}>
                &times;
            </button>
            <h1 className={styles.title}>Privacy Policy</h1>
            <p>Welcome to <strong>Medhub Global!</strong> Medhub Global, operated by One Vision Technologies FZ-LLC (Ras Al Khaimah), respects your privacy and is committed to protecting your personal data. This Privacy Policy outlines how we collect, use, store, and protect your information when you interact with our website or platform.</p>

            <h2 className={styles.sectionTitle}>1. Scope of This Policy</h2>
            <p>This Privacy Policy applies to all users of the Medhub Global website, platform, and associated services. By accessing or using our services, you agree to the collection and use of information in accordance with this Policy.</p>

            <h2 className={styles.sectionTitle}>2. Information We Collect</h2>
            <p>We may collect the following categories of information:</p>
            <h3 className={styles.sectionContentTitle}>2.1 Personal Information:</h3>
            <ul>
                <li>Name, email address, phone number, and contact details.</li>
                <li>Business name, registration details, and tax identification numbers.</li>
                <li>Billing and shipping addresses.</li>
            </ul>
            <h3 className={styles.sectionContentTitle}>2.2 Account and Transaction Information:</h3>
            <ul>
                <li>Username, password, and account preferences.</li>
                <li>Details of transactions conducted on the platform.</li>
                <li>Payment information (e.g., credit/debit card details or bank account numbers).</li>
            </ul>
            <h3 className={styles.sectionContentTitle}>2.3 Technical Information:</h3>
            <ul>
                <li>IP address, browser type, operating system, and device type.</li>
                <li>Login data, time zone settings, and browsing behavior on our website.</li>
            </ul>
            <h3 className={styles.sectionContentTitle}>2.4 Usage Data:</h3>
            <ul>
                <li>Pages viewed, links clicked, and time spent on the platform.</li>
                <li>Search queries and interactions with customer support.</li>
            </ul>
            <h3 className={styles.sectionContentTitle}>2.5 Cookies and Tracking Technologies:</h3>
            <p>Information collected through cookies, tracking pixels, and similar technologies to enhance user experience and analyze website usage. (Refer to our Cookie Policy for more details.)</p>

            <h2 className={styles.sectionTitle}>3. How We Use Your Information</h2>
            <p>We use the information collected for the following purposes:</p>
            <h3 className={styles.sectionContentTitle}>3.1 To Provide and Improve Our Services:</h3>
            <ul>
                <li>Process transactions and payments efficiently.</li>
                <li>Facilitate communication between buyers and sellers.</li>
                <li>Enhance platform functionality, security, and user experience.</li>
            </ul>
            <h3 className={styles.sectionContentTitle}>3.2 For Communication:</h3>
            <ul>
                <li>Send account updates, transaction notifications, and responses to inquiries.</li>
                <li>Deliver promotional offers, newsletters, and marketing materials (with user consent).</li>
            </ul>
            <h3 className={styles.sectionContentTitle}>3.3 For Compliance and Legal Obligations:</h3>
            <ul>
                <li>Verify user identity and ensure compliance with applicable laws.</li>
                <li>Prevent fraud, unauthorized access, or illegal activities.</li>
                <li>Meet regulatory and tax reporting requirements.</li>
            </ul>
            <h3 className={styles.sectionContentTitle}>3.4 For Analytics and Personalization:</h3>
            <ul>
                <li>Analyze user behavior to improve website performance and offerings.</li>
                <li>Customize content and recommend products or services based on user preferences.</li>
            </ul>

            <h2 className={styles.sectionTitle}>4. How We Share Your Information</h2>
            <p>We may share your information with third parties in the following circumstances:</p>
            <h3 className={styles.sectionContentTitle}>4.1 Service Providers:</h3>
            <p>Trusted partners who assist with payment processing, logistics, customer support, and analytics. These partners are bound by strict confidentiality agreements.</p>
            <h3 className={styles.sectionContentTitle}>4.2 Legal and Regulatory Requirements:</h3>
            <p>To comply with legal obligations, court orders, or requests from government authorities.</p>
            <h3 className={styles.sectionContentTitle}>4.3 Business Transactions:</h3>
            <p>In the event of a merger, acquisition, or sale of assets, user information may be transferred to the new entity, subject to this Privacy Policy.</p>
            <h3 className={styles.sectionContentTitle}>4.4 Consent-Based Sharing:</h3>
            <p>When you explicitly consent to share your information with specific third parties for marketing or other purposes.</p>

            <h2 className={styles.sectionTitle}>5. Data Retention</h2>
            <p>We retain personal information only as long as necessary to fulfill the purposes outlined in this Policy or as required by law. Upon request, we will delete or anonymize your data unless retention is legally required.</p>

            <h2 className={styles.sectionTitle}>6. Data Security</h2>
            <p>We implement robust technical and organizational measures to protect your information from unauthorized access, loss, or misuse. These measures include:</p>
            <ul>
                <li>Encryption of sensitive data during transmission and storage.</li>
                <li>Regular security audits and vulnerability assessments.</li>
                <li>Controlled access to data based on the principle of least privilege.</li>
            </ul>
            <p>However, no system is entirely secure, and we cannot guarantee absolute data security.</p>

            <h2 className={styles.sectionTitle}>7. Your Rights</h2>
            <p>As a user, you have the following rights regarding your personal data:</p>
            <h3 className={styles.sectionContentTitle}>7.1 Access and Correction:</h3>
            <ul>
                <li>Request access to the information we hold about you.</li>
                <li>Update or correct inaccuracies in your personal data.</li>
            </ul>
            <h3 className={styles.sectionContentTitle}>7.2 Deletion:</h3>
            <p>Request deletion of your data, subject to legal retention requirements.</p>
            <h3 className={styles.sectionContentTitle}>7.3 Restriction of Processing:</h3>
            <p>Restrict the use of your data under certain conditions (e.g., pending a dispute over accuracy).</p>
            <h3 className={styles.sectionContentTitle}>7.4 Data Portability:</h3>
            <p>Request a copy of your data in a structured, machine-readable format.</p>
            <h3 className={styles.sectionContentTitle}>7.5 Opt-Out:</h3>
            <p>Opt-out of marketing communications by following the instructions in our emails or contacting us directly.</p>
            <p>To exercise any of these rights, please contact us at <a href="mailto:connect@medhub.global">connect@medhub.global</a>.</p>

            <h2 className={styles.sectionTitle}>8. Cookies and Tracking Technologies</h2>
            <p>We use cookies to:</p>
            <ul>
                <li>Enhance website performance and usability.</li>
                <li>Analyze user behavior for improvement.</li>
                <li>Deliver personalized content and advertisements.</li>
            </ul>
            <p>You can manage cookie preferences through your browser settings. Disabling cookies may affect your experience on our platform. For more details, refer to our Cookie Policy.</p>

            <h2 className={styles.sectionTitle}>9. Third-Party Links</h2>
            <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. Users are encouraged to review the privacy policies of third-party websites before providing any information.</p>

            <h2 className={styles.sectionTitle}>10. International Data Transfers</h2>
            <p>As a global platform, your data may be transferred to or stored in countries outside your jurisdiction. We ensure that such transfers comply with applicable data protection laws and implement safeguards to protect your data.</p>

            <h2 className={styles.sectionTitle}>11. Updates to This Policy</h2>
            <p>We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. Users will be notified of significant changes through email or a notice on our website. Continued use of our services signifies acceptance of the updated Policy.</p>

            <h2 className={styles.sectionTitle}>12. Governing Law</h2>
            <p>This Privacy Policy is governed by the laws of the United Arab Emirates. Any disputes arising from this Policy will be resolved under the jurisdiction of the courts of the Ras Al Khaimah Economic Zone (RAKEZ).</p>

            <h2 className={styles.sectionTitle}>13. Contact Us</h2>
            <p>If you have questions or concerns about this Privacy Policy or how your information is handled, please contact us at:</p>
            <address>
                One Vision Technologies FZ-LLC<br />
                RAKEZ Free Zone, Ras Al Khaimah, United Arab Emirates<br />
                Email: <a href="mailto:connect@medhub.global">connect@medhub.global</a>
            </address>

            <p>By using Medhub Global, you acknowledge that you have read, understood, and agreed to this Privacy Policy. If you do not agree, please discontinue use of the platform.</p>
        </div>
        </div>
    );
};

export default PrivacyPolicy;
