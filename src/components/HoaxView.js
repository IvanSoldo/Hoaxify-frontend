import React, { useRef, useState, useEffect } from "react";
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import useClickTracker from "../shared/useClickTracker";
import { useSelector } from "react-redux";
import Input from "./Input";
import ButtonWithProgress from "./ButtonWithProgress";
import * as apiCalls from "../api/apiCalls";

const HoaxView = (props) => {
  const actionArea = useRef();
  const ref = useRef();
  const [inEditMode, setInEditMode] = useState(false);
  const [pendingUpdateCall, setPendingUpdateCall] = useState(false);
  const dropDownVisible = useClickTracker(actionArea);
  const [errors, setErrors] = useState({});
  const [likes, setLikes] = useState([]);
  const { hoax, onClickDelete } = props;
  const { date } = hoax;
  const { username, displayName } = hoax.user;
  const [content, setContent] = useState(hoax.content);
  const relativeDate = format(date);
  const attachmentImageVisible =
    hoax.attachment && hoax.attachment.fileType.startsWith("image");

  const { user } = useSelector((state) => state.authentication);

  const ownedByLoggedInUser = hoax.user.id === user.id;

  let dropDownClass = "p-0 shadow dropdown-menu";
  if (dropDownVisible) {
    dropDownClass += " show";
  }

  const resetState = () => {
    setContent(hoax.content);
    setErrors({});
    setInEditMode(false);
  };

  const onClickEdit = () => {
    setInEditMode(true);
  };

  const onClickCancel = () => {
    resetState();
  };

  const onChangeContent = (event) => {
    setContent(event.target.value);
  };

  const getLikes = () => {
    apiCalls.getLikes(hoax.id).then((response) => {
      setLikes(response.data);
    });
  };

  const handleLike = () => {
    apiCalls.handleLike(hoax.id).then((response) => {
      getLikes();
    });
  };

  const onClickSave = () => {
    const body = {
      content: content,
    };
    setPendingUpdateCall(true);
    apiCalls
      .editHoax(hoax.id, body)
      .then((response) => {
        setPendingUpdateCall(false);
        setInEditMode(false);
        setContent(response.data.content);
      })
      .catch((e) => {
        if (e.response.data && e.response.data.validationErrors) {
          setErrors(e.response.data.validationErrors);
        }
        setPendingUpdateCall(false);
      });
  };

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (inEditMode && ref.current && !ref.current.contains(e.target)) {
        resetState();
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [inEditMode]);

  useEffect(() => {
    getLikes();
  }, []);

  let isLiked = likes.some((e) => e.username === user.username);
  let iconClassName;

  if (isLiked) {
    iconClassName = "fas fa-thumbs-up pr-2";
  } else {
    iconClassName = "far fa-thumbs-up pr-2";
  }

  return (
    <div className="card p-1">
      <div className="d-flex">
        <ProfileImageWithDefault
          className="rounded-circle m-1"
          width="32"
          height="32"
          image={hoax.user.image}
        />
        <div className="flex-fill m-auto pl-2">
          <Link to={`/${username}`} className="list-group-item-action">
            <h6 className="d-inline">
              {displayName}@{username}
            </h6>
          </Link>
          <span className="text-black-50"> - </span>
          <span className="text-black-50">{relativeDate}</span>
          {hoax.edited && <span className="text-black-50"> - (Edited)</span>}
        </div>
        {ownedByLoggedInUser && (
          <div className="dropdown">
            <span
              className="btn btn-sm btn-light dropdown-toggle"
              ref={actionArea}
            />
            <div className={dropDownClass}>
              <button onClick={onClickEdit} className="dropdown-item">
                <i className="far fa-edit text-info"></i>Edit
              </button>
              <button onClick={onClickDelete} className="dropdown-item">
                <i className="far fa-trash-alt text-danger"></i>Delete
              </button>
            </div>
          </div>
        )}
      </div>
      {!inEditMode && <div className="pl-5">{content}</div>}
      <div ref={ref}>
        {inEditMode && ownedByLoggedInUser && (
          <div className="mb-2 text-center">
            <Input
              value={content}
              label="Edit Hoax"
              onChange={onChangeContent}
              hasError={errors.content && true}
              error={errors.content}
            />
          </div>
        )}
        {inEditMode && ownedByLoggedInUser && (
          <div className="text-center">
            <ButtonWithProgress
              className="btn btn-primary"
              onClick={onClickSave}
              text={
                <span>
                  <i className="fas fa-save" /> Save
                </span>
              }
              pendingApiCall={pendingUpdateCall}
              disabled={pendingUpdateCall}
            />
            <button
              className="btn btn-outline-secondary ml-1"
              onClick={onClickCancel}
              disabled={pendingUpdateCall}
            >
              <i className="fas fa-window-close" /> Cancel
            </button>
          </div>
        )}
      </div>
      {attachmentImageVisible && !inEditMode && (
        <div className="pl-5 pt-2">
          <img
            alt="attachment"
            src={`/images/attachments/${hoax.attachment.name}`}
            className="img-fluid"
          />
        </div>
      )}
      <span className="text-black-50 text-right pr-2 pb-1">
        {user.isLoggedIn && (
          <span
            className="text-info"
            onClick={handleLike}
            style={{ cursor: "pointer" }}
          >
            <i className={iconClassName}></i>
          </span>
        )}
        {likes.length} likes
      </span>
    </div>
  );
};

export default HoaxView;
