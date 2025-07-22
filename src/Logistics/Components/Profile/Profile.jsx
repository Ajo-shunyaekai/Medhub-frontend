import React, { useEffect, useState } from "react";
import styles from "./profile.module.css";
import { MdOutlineAttachEmail } from "react-icons/md";
import { RiHonourLine } from "react-icons/ri";
import { LuPhoneCall } from "react-icons/lu";
import { FaRegAddressCard } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../../../redux/reducers/userDataSlice"; 
import Loader from "../SharedComponents/Loader/Loader";
import {
  renderFiles2,
} from "../../../utils/helper";

const Profile = () => {

   const { user } = useSelector((state) => state?.userReducer);  
  /*   const user =  {
        "registeredAddress": {
            "company_reg_address": "476, Udyog Vihar, Gurgaon",
            "locality": "Phase V, test",
            "land_mark": null,
            "city": "Gurgaon",
            "state": "Haryana",
            "country": "India",
            "pincode": "122016",
            "type": "Registered"
        },
        "_id": "664ae224e07969304eb37bac",
        "supplier_id": "SUP-88363ef1b2c6a",
        "supplier_name": "PureMed Pharmaceuticals",
        "supplier_image": [
            "https://medhubglobal.s3.ap-south-1.amazonaws.com/testing/1747638122927-supplier_image-Driver-1747638122864.png"
        ],
        "supplier_address": "476, Udyog Vihar, Gurgaon",
        "description": "PureMed Pharmaceuticals supplies high-quality pharmaceutical products, including generic and branded medications.",
        "license_no": "456345234",
        "country_of_origin": "India",
        "contact_person_name": "Shubham Dubey",
        "designation": "Market General Manager",
        "payment_terms": "Credit, COD",
        "tags": "Abilify, Acanya",
        "estimated_delivery_time": "10 Days",
        "contact_person_email": "puremedpharma@gmail.com",
        "supplier_email": "puremedpharma@gmail.com",
        "contact_person_country_code": "+91",
        "contact_person_mobile_no": "9744630909",
        "supplier_country_code": "+91",
        "supplier_mobile": "6694611789",
        "account_status": 1,
        "profile_status": 1,
        "supplier_type": "Manufacturer",
        "tax_no": "9867342",
        "country_of_operation": [
            "India"
        ],
        "registration_no": "6712312378",
        "vat_reg_no": "453231",
        "certificate_image": [
            "certificate_image-1721202330235.pdf"
        ],
        "license_image": [
            "license_image-1721202330059.pdf"
        ],
        "tax_image": [
            "tax_image-1721202330093.pdf"
        ],
        "license_expiry_date": "31-12-2027",
        "bank_details": "Barclays ,3323323332323, Bar2233",
        "otpCount": 3,
        "categories": [
            "Pharmaceuticals",
            "Alternative Medicines",
            "Dental Products",
            "Diagnostic and Monitoring Devices",
            "Disinfection and Hygiene Supplies",
            "Emergency and First Aid Supplies",
            "Eye Care Supplies",
            "Healthcare IT Solutions",
            "Home Healthcare Products",
            "Hospital and Clinic Supplies",
            "Laboratory Supplies",
            "Medical Consumables and Disposables",
            "Medical Equipment and Devices",
            "Nutrition and Dietary Products",
            "Orthopedic Supplies",
            "Skin, Hair and Cosmetic Supplies",
            "Vital Health and Wellness"
        ],
        "certificateFileNDate": [
            {
                "file": "certificate_image-1721202330235.pdf",
                "date": "",
                "_id": "684679867ddb8feb098a5012"
            }
        ],
        "medical_certificate": [],
        "subscriptionEmail": "",
        "subscriptionsHistory": [],
        "test_account": 0,
        "otpExpiry": "2025-07-16T07:53:09.657Z",
        "last_login": "2025-07-17T10:10:07.502Z",
        "login_history": [
            {
                "date": "2025-04-04T07:24:07.913Z",
                "_id": "67ef891782181f3afd25c938"
            },
            {
                "date": "2025-04-04T07:24:29.865Z",
                "_id": "67ef892d82181f3afd25c950"
            },
            {
                "date": "2025-04-07T04:21:04.981Z",
                "_id": "67f352b0a7e039bf042fc8fa"
            },
        ],
        "account_accepted_date": "31-12-2024",
        "sales_person_name": "Shivanshi Tripathi",
        "activity_code": "786513",
        "lastLogin": "2025-04-21T07:17:30.579Z",
        "otp": 145484,
        "websiteAddress": "puremed.pharma.com",
        "otpLimitReachedAt": null,
        "annualTurnover": 450,
        "yrFounded": 1990    
    }  */
    const dispatch = useDispatch();
    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const documentsArray = [
    { headings: "Certificate", keyword: "certificate_image" },
    { headings: "Trade License", keyword: "license_image" },


    {
        headings: "Medical Practitioner",
        keyword: "medical_certificate",
    },
    ];

    useEffect(() => {
    const fetchData = async () => {
        if (id ) {
          setLoading(true);
          await dispatch(fetchUserData(id)); 
          setLoading(false);
        }
    };
    fetchData();

    }, [dispatch, id]); 


    if (loading) return <Loader />;

    if (!user) return null; 

    return (
    <div className={styles.container}>
      <div className={styles.profileHeadSection}>
        <div className={styles.MainHeading}>Profile</div>
        <Link
          to={`/logistic/edit-profile/${user?._id || localStorage?.getItem("_id")
            }`}
        >
          <div className={styles.EditButtonSection}>
            <span className={styles.editButton}>Edit</span>
          </div>
        </Link>
      </div>
      <div className={styles.profileContainer}>
        <div className={styles.imgSection}>
          {user?.supplier_image?.[0] && (
            <img
              src={
                user?.supplier_image?.[0]?.startsWith("http")
                  ? user?.supplier_image?.[0]
                  : `${process.env.REACT_APP_SERVER_URL}uploads/supplier/supplier_image_files/${user?.supplier_image?.[0]}`
              }
              alt="supplier Profile"
              className={styles.profileImage}
            />
          )}
        </div>
        {/* )} */}
        <div className={styles.contentSection}>
          {(user?.company_name ) && (
            <div className={styles.companyNameSection}>
              <span className={styles.mainHead}>
                {user?.company_name}{" "}
               {/*  {user?.supplier_type && `(${user?.supplier_type})`} */}
              </span>
            </div>
          )}
          <div className={styles.contentIconSection}>
            <div className={styles.addressSection}>
             {user?.contact_person && (
                <div className={styles.iconSection}>
                  <RiHonourLine className={styles.icon} />
                  <span className={styles.textSection}>
                    <a
                      href={user?.websiteAddress}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.textLink}
                    >
                      {user?.contact_person}
                    </a>
                  </span>
                </div>
              )} 
              {user?.email && (
                <div className={styles.iconSection}>
                  <MdOutlineAttachEmail className={styles.icon} />
                  <span className={styles.textSection}>
                    {user?.email}
                  </span>
                </div>
              )}
              {(user?.phone) && (
                <div className={styles.iconSection}>
                  <LuPhoneCall className={styles.icon} />
                  <span className={styles.textSection}>
                    {user?.phone}
                  </span>
                </div>
              )}
            </div>
            {(user?.address?.street ||
              user?.address?.city ||
              user?.address?.state ||
              user?.address?.country ||
              user?.address?.zip_code 
              ) && (
                <div className={styles.addressSection}>
                  <div className={styles.iconSection}>
                    <FaRegAddressCard className={styles.icon} />
                    <div className={styles.addressContainers}>
                      {(user?.address?.street) && (
                          <span className={styles.textSection}>
                            {user?.address?.street}
                          </span>
                        )}
                      {(user?.address?.city ||
                        user?.address?.state ||
                        user?.address?.country) && (
                          <span className={styles.textSection}>
                            {user?.address?.city}{", "}
                            {user?.address?.state}{", "}
                            {user?.address?.country}
                          </span>
                        )}
                      {user?.address?.zip_code && (
                        <span className={styles.textSection}>
                          {user?.address?.zip_code}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    {/*   {(user?.registration_no ||
        user?.vat_reg_no ||
        user?.categories ||
        user?.sales_person_name ||
        user?.license_no ||
        user?.country_of_operation ||
        user?.country_of_origin ||
        user?.tags ||
        user?.yrFounded ||
        user?.annualTurnover ||
        user?.license_expiry_date) && (
          <div className={styles.companySection}>
            <div className={styles.companyContainerSection}>
              <div className={styles.companyMainHeading}>Company Details</div>
              <div className={styles.companyDetailsSection}>
                <div className={styles.companyInnerContainer}>
                  {user?.registration_no && (
                    <div className={styles.companyDetails}>
                      <div className={styles.companyHead}>
                        Company Registration No.
                      </div>
                      <div className={styles.companyText}>
                        {user?.registration_no}
                      </div>
                    </div>
                  )}
                  {user?.vat_reg_no && (
                    <div className={styles.companyDetails}>
                      <div className={styles.companyHead}>
                        GST/VAT Registration No.
                      </div>
                      <div className={styles.companyText}>{user?.vat_reg_no}</div>
                    </div>
                  )}

                  {user?.sales_person_name && (
                    <div className={styles.companyDetails}>
                      <div className={styles.companyHead}>
                        Medhub Global Sales Representative
                      </div>
                      <div className={styles.companyText}>
                        {user?.sales_person_name}
                      </div>
                    </div>
                  )}
                 
                  {user?.categories && (
                    <div className={styles.companyDetails}>
                      <div className={styles.companyHead}>
                        Company License No.
                      </div>
                      <div className={styles.companyText}>{user?.license_no}</div>
                    </div>
                  )}

                    {user?.yrFounded && (
                    <div className={styles.companyDetails}>
                      <div className={styles.companyHead}>
                        Year Company Founded
                      </div>
                      <div className={styles.companyText}>{user?.yrFounded}</div>
                    </div>
                  )}
                  {user?.categories && user.categories.length > 0 && (
                    <div className={styles.companyDetails}>
                      <div className={styles.companyHead}>Trading Categories</div>
                      <div className={styles.companyText}>
                        {user.categories.join(' , ')}
                      </div>
                    </div>
                  )}
                </div>
                <div className={styles.companyInnerContainer}>
                {/* {user?.yrFounded && (
                    <div className={styles.companyDetails}>
                      <div className={styles.companyHead}>
                      Year Company Founded
                      </div>
                      <div className={styles.companyText}>
                        {user?.yrFounded}
                      </div>
                    </div>
                  )}
                  {user?.annualTurnover && (
                    <div className={styles.companyDetails}>
                      <div className={styles.companyHead}>
                        Annual Turnover
                      </div>
                      <div className={styles.companyText}>
                        {user?.annualTurnover} USD
                      </div>
                    </div>
                  )} */}
           {/*      {user?.activity_code && (
                    <div className={styles.companyDetails}>
                      <div className={styles.companyHead}>
                        Business/Trade Activity Code
                      </div>
                      <div className={styles.companyText}>
                        {user?.activity_code}
                      </div>
                    </div>
                  )}
                   {user?.tags && (
                    <div className={styles.companyDetails}>
                      <div className={styles.companyHead}>Tags</div>
                      <div className={styles.companyText}>{user?.tags}</div>
                    </div>
                  )}
                  {user?.country_of_origin && (
                    <div className={styles.companyDetails}>
                      <div className={styles.companyHead}>Country of Origin</div>
                      <div className={styles.companyText}>
                        {user?.country_of_origin}
                      </div>
                    </div>
                  )}
                 
               
                  {user?.license_expiry_date && (
                    <div className={styles.companyDetails}>
                      <div className={styles.companyHead}>
                        License Expiry/ Renewal Date
                      </div>
                      <div className={styles.companyText}>
                        {user?.license_expiry_date}
                      </div>
                    </div>
                  )}
                  {user?.annualTurnover && (
                    <div className={styles.companyDetails}>
                      <div className={styles.companyHead}>
                        Annual Turnover
                      </div>
                      <div className={styles.companyText}>
                        {user?.annualTurnover} USD
                      </div>
                    </div>
                  )}
                    {user?.country_of_operation && (
                    <div className={styles.companyDetails}>
                      <div className={styles.companyHead}>
                        Country of Operation
                      </div>
                      <div className={styles.companyText}>
                        {user?.country_of_operation}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )} */}
     {/*  {(user?.description || user?.activity_code) && (
        <div className={styles.textareaContainer}>
          {user?.description && (
            <div className={styles.textareaSeaction}>
              <div className={styles.textareaHead}>About Company</div>
              <span className={styles.textareaContent}>
                {user?.description}
              </span>
            </div>
          )}

        </div>
      )} */}
    {/*   {(user?.contact_person_name ||
        user?.contact_person_country_code ||
        user?.contact_person_mobile_no ||
        user?.designation ||
        user?.bank_details) && (
          <div className={styles.companySection}>
            <div className={styles.companyContainerContactSection}>
              <div className={styles.companyMainHeading}>Contact Details</div>
              {user?.contact_person_name && (
                <div className={styles.companyDetails}>
                  <div className={styles.companyHead}>Contact Name</div>
                  <div className={styles.companyText}>
                    {user?.contact_person_name}
                  </div>
                </div>
              )}
              {(user?.contact_person_country_code ||
                user?.contact_person_mobile_no) && (
                  <div className={styles.companyDetails}>
                    <div className={styles.companyHead}>Mobile No.</div>
                    <div className={styles.companyText}>
                      {user?.contact_person_country_code}{" "}
                      {user?.contact_person_mobile_no}
                    </div>
                  </div>
                )}
              {user?.designation && (
                <div className={styles.companyDetails}>
                  <div className={styles.companyHead}>Designation</div>
                  <div className={styles.companyText}>{user?.designation}</div>
                </div>
              )}
            </div>
            {user?.bank_details && (
              <div className={styles.companyContainerContactSection}>
                <div className={styles.textareaHead}>Bank Details</div>
                <div className={styles.textareaContent}>
                  {user.bank_details.split(',').slice(0, 2).map((line, index) => (
                    <div key={index} style={{ display: 'block' }}>
                      {line.trim()}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )} */}
      {/* style the documents section */}
      {/* <div className={styles.documentContainer}>
        <div className={styles.documentMainHeading}>Documents</div>
        <div className={styles.documentSection}>
          {documentsArray?.map(
            (ele, index) =>
              user?.[ele?.keyword]?.length > 0 && (
                <div key={index} className={styles.documentInnerSection}>
                  <div className={styles.documentDocName}>{ele?.headings}</div>
                  <div className={styles.documentDocContent}>
                    {renderFiles2(user?.[ele?.keyword], ele?.headings, styles, user?.certificateFileNDate)}
                  </div>
                </div>
              )
          )}
        </div>
      </div> */}
    </div>
    )
}

export default Profile