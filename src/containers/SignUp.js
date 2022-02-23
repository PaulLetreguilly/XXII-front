import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

const SignUp = ({ serverUrl, setConnected, userToken }) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (userToken) {
      navigate(-1);
    }
  }, [userToken]);

  const body = { name, surname, username, email, password };

  const handleSubmit = async () => {
    if (name && surname && email && password && confirmPassword && username) {
      if (password === confirmPassword) {
        try {
          const response = await axios.post(`${serverUrl}/signup`, body);
          console.log(response.data);
          setConnected(response.data.token);
        } catch (error) {
          if (error.name === "AbortError") {
            console.log("fetch aborted");
          } else {
            console.log(error.message);
          }
        }
      } else {
        setError("Type in the same password twice, please");
      }
    } else {
      alert("Fill in all the fields please");
    }
  };

  return (
    <section>
      <h2>SignUp</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setError("");
          handleSubmit();
        }}
      >
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          type="text"
          placeholder="name"
        />
        <input
          value={surname}
          onChange={(e) => {
            setSurname(e.target.value);
          }}
          type="text"
          placeholder="surname"
        />
        <input
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          type="text"
          placeholder="username"
        />
        <input
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          type="email"
          placeholder="email"
        />
        <input
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          type="password"
          placeholder="password"
        />
        <input
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
          }}
          type="password"
          placeholder="confirm password"
        />
        <div style={{ color: "red" }}>{error}</div>
        <input type="submit" value="send" />
      </form>
    </section>
  );
};

export default SignUp;
