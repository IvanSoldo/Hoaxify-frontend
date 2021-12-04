import * as apiCalls from "../api/apiCalls";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProfileCard from "../components/ProfileCard";
import Spinner from "../components/Spinner";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../redux/authSlice";
import HoaxFeed from "../components/HoaxFeed";

const UserPage = () => {
  const [userOnPage, setUserOnPage] = useState(undefined);
  const [userNotFound, setUserNotFound] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [inEditMode, setInEditMode] = useState(false);
  const [pendingApiCall, setPendingApiCall] = useState(false);
  const [image, setImage] = useState(undefined);
  const [errors, setErrors] = useState({});
  const { username } = useParams();
  const { user } = useSelector((state) => state.authentication);
  const dispatch = useDispatch();

  useEffect(() => {
    setUserNotFound(false);
    const loadUser = () => {
      if (!username) {
        return;
      }
      setIsLoadingUser(true);
      apiCalls
        .getUser(username)
        .then((response) => {
          setUserOnPage(response.data);
          setIsLoadingUser(false);
        })
        .catch((error) => {
          setUserNotFound(true);
          setIsLoadingUser(false);
        });
    };
    loadUser();
  }, [username]);

  const onClickEdit = () => {
    setErrors({});
    setInEditMode(true);
  };

  const onClickCancel = () => {
    if (userOnPage.displayName !== user.displayName) {
      setUserOnPage({ ...userOnPage, displayName: user.displayName });
    }
    setImage(undefined);
    setInEditMode(false);
  };

  const onClickSave = () => {
    const userUpdate = {
      displayName: userOnPage.displayName,
      image: image && image.split(",")[1],
    };
    setPendingApiCall(true);
    apiCalls
      .updateUser(user.id, userUpdate)
      .then((response) => {
        userUpdate.image = response.data.image;
        dispatch(updateUser(userUpdate));
        setPendingApiCall(false);
        setInEditMode(false);
        setUserOnPage({ ...userOnPage, image: response.data.image });
        setImage(undefined);
      })
      .catch((error) => {
        if (error.response.data.validationErrors) {
          setErrors(error.response.data.validationErrors);
        }
        setPendingApiCall(false);
      });
  };

  const onChangeDisplayName = (event) => {
    setUserOnPage({ ...userOnPage, displayName: event.target.value });
  };

  const onFileSelect = (event) => {
    if (event.target.files.length === 0) {
      return;
    }
    const file = event.target.files[0];
    let reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  let pageContent;
  if (isLoadingUser) {
    pageContent = <Spinner />;
  } else if (userNotFound) {
    pageContent = (
      <div className="alert alert-danger text-center">
        <div className="alert-heading">
          <i className="fas fa-exclamation-triangle fa-3x" />
        </div>
        <h5>User not found</h5>
      </div>
    );
  } else {
    const isEditable = user.username === username;
    pageContent = userOnPage && !userNotFound && (
      <ProfileCard
        user={userOnPage}
        isEditable={isEditable}
        inEditMode={inEditMode}
        onClickEdit={onClickEdit}
        onClickCancel={onClickCancel}
        onClickSave={onClickSave}
        onChangeDisplayName={onChangeDisplayName}
        displayName={userOnPage.displayName}
        pendingUpdateCall={pendingApiCall}
        loadedImage={image}
        onFileSelect={onFileSelect}
        errors={errors}
      />
    );
  }

  return (
    <div className="row">
      <div className="col">{pageContent}</div>
      <div className="col">
        <HoaxFeed user={username} />
      </div>
    </div>
  );
};

export default UserPage;
