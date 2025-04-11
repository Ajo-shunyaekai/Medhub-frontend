import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../../../../redux/reducers/userDataSlice";
import { MdOutlineAttachEmail } from "react-icons/md";
import styles from './profile.module.css';
import Main from '../../UI/Main/Main';
import Card from '../../UI/FormCard/FormCard';
import Image from "../../../assets/images/man.png"

import Loader from "../Loader/Loader";

function Profile() {
    const { user } = useSelector((state) => state?.userReducer);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id }   = useParams();

    useEffect(() => {
        const partnerIdSessionStorage = sessionStorage.getItem("partner_id");
        const partnerIdLocalStorage   = localStorage.getItem("partner_id");

        if (!partnerIdSessionStorage && !partnerIdLocalStorage) {
            navigate("/logistics/login");
            return;
        }
        (id || sessionStorage?.getItem("_id")) &&
            dispatch(fetchUserData(id || sessionStorage?.getItem("_id")));
    }, [dispatch, id, sessionStorage?.getItem("_id")]);

  return (
    <Main title='Profile'>
        <Card>
            <div className={styles.profileContainer}>
                <div className={styles.imgSection}>
                    <img
                    src={Image}
                    alt="admin Profile"
                    className={styles.profileImage}
                    />
                </div>
                <div className={styles.contentSection}>
                <span className={styles.mainHead}>{user?.company_name}</span>
                    <div className={styles.contentIconSection}>
                        <div className={styles.iconSection}>
                            <MdOutlineAttachEmail className={styles.icon} />
                            <span className={styles.textSection}>{user?.email}</span>
                        </div>
                    </div>
                </div>
            </div>
      </Card>
    </Main>
  )
}

export default Profile;