import ProfileImageWithDefault from "./ProfileImageWithDefault";
import * as apiCalls from "../api/apiCalls";
import ButtonWithProgress from "./ButtonWithProgress";
import Input from "./Input";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";

const HoaxSubmit = () => {
  const ref = useRef();
  const { user } = useSelector((state) => state.authentication);
  const [focused, setFocused] = useState(false);
  const [content, setContent] = useState(undefined);
  const [pendingApiCall, setPendingApiCall] = useState(false);
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(undefined);
  const [image, setImage] = useState(undefined);
  const [attachment, setAttachment] = useState(undefined);

  const onChangeContent = (event) => {
    setContent(event.target.value);
    setErrors({});
  };

  const onFileSelect = (event) => {
    if (event.target.files.length === 0) {
      return;
    }
    const fileToSet = event.target.files[0];
    let reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setFile(fileToSet);
    };
    reader.readAsDataURL(fileToSet);
  };

  const uploadFile = () => {
    const body = new FormData();
    body.append("file", file);
    apiCalls.postHoaxFile(body).then((response) => {
      setAttachment(response.data);
    });
  };

  useEffect(() => {
    if (file !== undefined) {
      setFile(undefined);
      uploadFile();
    }
  });

  const onFocus = () => {
    setFocused(true);
  };

  const resetState = () => {
    setFocused(false);
    setContent("");
    setErrors({});
    setImage(undefined);
    setFile(undefined);
  };

  const onClickCancel = () => {
    resetState();
  };

  const onClickHoaxify = () => {
    const body = {
      content: content,
      attachment: attachment,
    };
    setPendingApiCall(true);
    apiCalls
      .postHoax(body)
      .then((response) => {
        setFocused(false);
        setContent("");
        setPendingApiCall(false);
        setFile(undefined);
        setImage(undefined);
        setAttachment(undefined);
      })
      .catch((e) => {
        if (e.response.data && e.response.data.validationErrors) {
          setErrors(e.response.data.validationErrors);
        }
        setPendingApiCall(false);
      });
  };
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (focused && ref.current && !ref.current.contains(e.target)) {
        resetState();
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [focused]);

  let textAreaClassName = "form-control w-100";
  if (errors.content) {
    textAreaClassName += " is-invalid";
  }

  return (
    <div className="card d-flex flex-row p-1">
      <ProfileImageWithDefault
        className="rounded-circle m-1"
        width="32"
        height="32"
        image={user.image}
      />
      <div className="flex-fill">
        <textarea
          className={textAreaClassName}
          rows={focused ? 3 : 1}
          onFocus={onFocus}
          value={content}
          onChange={onChangeContent}
        />
        {errors.content && (
          <span className="invalid-feedback">{errors.content}</span>
        )}
        <div ref={ref}>
          {focused && (
            <div>
              <div className="pt-1">
                <Input type="file" onChange={onFileSelect} />
                {image && (
                  <img
                    className="mt-1 img-thumbnail"
                    src={image}
                    alt="upload"
                    width="128"
                    height="64"
                  />
                )}
              </div>
              <div className="text-right mt-1">
                <ButtonWithProgress
                  className="btn btn-success"
                  disabled={pendingApiCall}
                  onClick={onClickHoaxify}
                  pendingApiCall={pendingApiCall}
                  text="Hoaxify"
                />
                <button
                  className="btn btn-light ml-1"
                  onClick={onClickCancel}
                  disabled={pendingApiCall}
                >
                  <i className="fas fa-times"></i> Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HoaxSubmit;
