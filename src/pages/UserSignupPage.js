import React, { useState, useEffect } from "react";
import Input from "../components/Input";
import ButtonWithProgress from "../components/ButtonWithProgress";
import { clearState, loginUser, signupUser } from "../redux/authSlice";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";

const UserSignupPage = () => {
  const [form, setForm] = useState({
    displayName: "",
    username: "",
    password: "",
    passwordRepeat: "",
  });

  const { isLoading, isSuccess, errors } = useSelector(
    (state) => state.authentication
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(clearState());
  }, []);

  useEffect(() => {
    if (isSuccess) {
      dispatch(clearState());
      dispatch(loginUser({ username: form.username, password: form.password }));
      navigate("/");
    }
  });

  const onChange = (event) => {
    const { value, name } = event.target;

    setForm((previousForm) => {
      return {
        ...previousForm,
        [name]: value,
      };
    });
  };

  const onClickSignup = () => {
    const user = {
      username: form.username,
      displayName: form.displayName,
      password: form.password,
    };
    dispatch(signupUser(user));
  };

  let passwordRepeatError;
  const { password, passwordRepeat } = form;
  if (password || passwordRepeat) {
    passwordRepeatError =
      password === passwordRepeat ? "" : "Does not match to password";
  }

  return (
    <div className="container">
      <h1 className="text-center">Sign Up</h1>
      <div className="col-12 mb-3">
        <Input
          name="displayName"
          label="Display Name"
          placeholder="Your display name"
          value={form.displayName}
          onChange={onChange}
          hasError={errors?.validationErrors?.displayName}
          error={errors?.validationErrors?.displayName}
        />
      </div>
      <div className="col-12 mb-3">
        <Input
          name="username"
          label="Username"
          placeholder="Your username"
          value={form.username}
          onChange={onChange}
          hasError={errors?.validationErrors?.username}
          error={errors?.validationErrors?.username}
        />
      </div>
      <div className="col-12 mb-3">
        <Input
          name="password"
          label="Password"
          placeholder="Your password"
          value={form.password}
          type="password"
          onChange={onChange}
          hasError={errors?.validationErrors?.password}
          error={errors?.validationErrors?.password}
        />
      </div>
      <div className="col-12 mb-3">
        <Input
          name="passwordRepeat"
          label="Password Repeat"
          placeholder="Repeat your password"
          type="password"
          value={form.passwordRepeat}
          onChange={onChange}
          hasError={passwordRepeatError && true}
          error={passwordRepeatError}
        />
      </div>
      <div className="text-center">
        <ButtonWithProgress
          onClick={onClickSignup}
          disabled={isLoading || passwordRepeatError ? true : false}
          pendingApiCall={isLoading}
          text="Sign Up"
        />
      </div>
    </div>
  );
};

export default UserSignupPage;
