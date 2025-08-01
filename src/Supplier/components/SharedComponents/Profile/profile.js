import React, { useEffect, useState } from "react";
import styles from "./profile.module.css";
import { MdOutlineAttachEmail } from "react-icons/md";
import { RiHonourLine } from "react-icons/ri";
import { LuPhoneCall } from "react-icons/lu";
import { FaRegAddressCard } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../../../../redux/reducers/userDataSlice";
import Loader from "../Loader/Loader";
import {
  renderFiles2,
} from "../../../../utils/helper";
import RenderFiles from '../../../../Buyer/components/Buy/Details/RenderFiles'

const Profile = () => {
  const { user } = useSelector((state) => state?.userReducer);
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
      if (id || localStorage?.getItem("_id")) {
        setLoading(true);
        await dispatch(fetchUserData(id || localStorage?.getItem("_id")));
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
          to={`/supplier/edit-profile/${user?._id || localStorage?.getItem("_id")
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
          {(user?.supplier_name || user?.supplier_type) && (
            <div className={styles.companyNameSection}>
              <span className={styles.mainHead}>
                {user?.supplier_name}{" "}
                {user?.supplier_type && `(${user?.supplier_type})`}
              </span>
            </div>
          )}
          <div className={styles.contentIconSection}>
            <div className={styles.addressSection}>
              {user?.websiteAddress && (
                <div className={styles.iconSection}>
                  <RiHonourLine className={styles.icon} />
                  <span className={styles.textSection}>
                    <a
                      href={user?.websiteAddress}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.textLink}
                    >
                      {user?.websiteAddress}
                    </a>
                  </span>
                </div>
              )}
              {user?.contact_person_email && (
                <div className={styles.iconSection}>
                  <MdOutlineAttachEmail className={styles.icon} />
                  <span className={styles.textSection}>
                    {user?.contact_person_email}
                  </span>
                </div>
              )}
              {(user?.supplier_country_code || user?.supplier_mobile) && (
                <div className={styles.iconSection}>
                  <LuPhoneCall className={styles.icon} />
                  <span className={styles.textSection}>
                    {user?.supplier_country_code} {user?.supplier_mobile}
                  </span>
                </div>
              )}
            </div>
            {(user?.registeredAddress?.company_reg_address ||
              user?.supplier_address ||
              user?.registeredAddress?.locality ||
              user?.registeredAddress?.land_mark ||
              user?.registeredAddress?.city ||
              user?.registeredAddress?.state ||
              user?.registeredAddress?.country ||
              user?.registeredAddress?.pincode) && (
                <div className={styles.addressSection}>
                  <div className={styles.iconSection}>
                    <FaRegAddressCard className={styles.icon} />
                    <div className={styles.addressContainers}>
                      {(user?.registeredAddress?.company_reg_address ||
                        user?.supplier_address) && (
                          <span className={styles.textSection}>
                            {user?.registeredAddress?.company_reg_address ||
                              user?.supplier_address}
                          </span>
                        )}
                      {(user?.registeredAddress?.locality ||
                        user?.registeredAddress?.land_mark) && (
                          <span className={styles.textSection}>
                            {user?.registeredAddress?.locality}{" "}
                            {user?.registeredAddress?.land_mark}
                          </span>
                        )}
                      {(user?.registeredAddress?.city ||
                        user?.registeredAddress?.state ||
                        user?.registeredAddress?.country) && (
                          <span className={styles.textSection}>
                            {user?.registeredAddress?.city}{" "}
                            {user?.registeredAddress?.state}{" "}
                            {user?.registeredAddress?.country}
                          </span>
                        )}
                      {user?.registeredAddress?.pincode && (
                        <span className={styles.textSection}>
                          {user?.registeredAddress?.pincode}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
      {(user?.registration_no ||
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
                 {user?.activity_code && (
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
        )}
      {(user?.description || user?.activity_code) && (
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
      )}
      {(user?.contact_person_name ||
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
        )}
      {/* style the documents section */}
      <div className={styles.documentContainer}>
        <div className={styles.documentMainHeading}>Documents</div>
        <div className={styles.documentSection}>
          {documentsArray?.map(
            (ele, index) =>
              user?.[ele?.keyword]?.length > 0 && (
                <div className={styles.documentInnerSection}>
                  <div className={styles.documentDocName}>{ele?.headings}</div>
                  <div className={styles.documentDocContent}>
                    {/* {renderFiles2(user?.[ele?.keyword], ele?.headings, styles, user?.certificateFileNDate)} */}
                    <RenderFiles files={user?.[ele?.keyword]} />
                      {ele?.headings === "Certificate" &&
                        user?.certificateFileNDate?.[index]?.date && (
                          <p>{user?.certificateFileNDate?.[index]?.date}</p>
                      )}
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;