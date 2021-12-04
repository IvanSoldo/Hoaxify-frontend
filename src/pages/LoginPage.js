import React, { useState, useEffect } from "react";
import Input from "../components/Input";
import ButtonWithProgress from "../components/ButtonWithProgress";
import { useDispatch, useSelector } from "react-redux";
import { clearState, loginUser } from "../redux/authSlice";
import { useNavigate } from "react-router";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { isLoading, isSuccess, isError, errors } = useSelector(
    (state) => state.authentication
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onClickLogin = () => {
    const body = {
      username,
      password,
    };
    dispatch(loginUser(body));
  };

  useEffect(() => {
    dispatch(clearState());
  }, []);

  useEffect(() => {
    if (isSuccess) {
      dispatch(clearState());
      navigate("/");
    }
  });

  let disableSubmit = false;
  if (username === "") {
    disableSubmit = true;
  }
  if (password === "") {
    disableSubmit = true;
  }

  return (
    <div className="container">
      <h1 className="text-center">Login</h1>
      <div className="col-12 mb-3">
        <Input
          label="Username"
          placeholder="Your username"
          value={username}
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        />
      </div>
      <div className="col-12 mb-3">
        <Input
          label="Password"
          placeholder="Your password"
          type="password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
      </div>
      {isError && (
        <div className="col-12 mb-3">
          <div className="alert alert-danger">{errors?.message}</div>
        </div>
      )}
      <div className="text-center">
        <ButtonWithProgress
          onClick={onClickLogin}
          disabled={disableSubmit || isLoading}
          text="Login"
          pendingApiCall={isLoading}
        />
      </div>
    </div>
  );
};

export default LoginPage;
