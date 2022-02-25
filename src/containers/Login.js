import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

const Login = ({ serverUrl, setConnected, userToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    if (userToken) {
      navigate(-1);
    }
  }, [userToken]);

  const body = { email, password };

  const handleSubmit = async () => {
    if (email && password) {
      try {
        const response = await axios.post(`${serverUrl}/login`, body);
        setConnected(response.data.token, response.data._id);
      } catch (error) {
        console.log(error.message);
        if (
          error.message === "Request failed with status code 401" ||
          error.message === "Request failed with status code 400"
        ) {
          setError("wrong email / password");
        }
      }
    } else {
      alert("fill in your username and password please");
    }
  };

  return (
    <section className="contain-log">
      <h2>Log in</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setError("");
          handleSubmit();
        }}
      >
        <input
          value={email}
          placeholder="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          type="email"
        />
        <input
          value={password}
          placeholder="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          type="password"
        />
        <div style={{ color: "red" }}>{error}</div>
        <input type="submit" className="btn" value="send" />
        <div
          className="btn"
          onClick={() => {
            navigate("/signup");
          }}
        >
          Not a member yet? Click here !
        </div>
      </form>
    </section>
  );
};

export default Login;
