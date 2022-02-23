import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const Profile = ({ serverUrl, userToken }) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState();
  const [updating, setUpdating] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!userToken) {
      navigate("/login");
    }
  }, [userToken]);

  const body = {};

  if (name) {
    body.name = name;
  }
  if (username) {
    body.username = username;
  }
  if (surname) {
    body.surname = surname;
  }
  if (email) {
    body.email = email;
  }
  if (password) {
    body.password = password;
  }

  useEffect(() => {
    const abortCont = new AbortController();
    const fetchUserData = async () => {
      const userData = await axios.get(`${serverUrl}/user`, {
        headers: { Authorization: "Bearer " + userToken },
      });
      setData(userData.data);
    };
    fetchUserData({ signal: abortCont.signal });
    return () => {
      abortCont.abort();
    };
  }, [userToken]);

  const handleSubmit = async () => {
    if (password && password !== confirmPassword) {
      setError("Type in the same password twice");
    } else if (password && !confirmPassword) {
      setError("Confirm your password, please");
    } else {
      try {
        const update = await axios.post(`${serverUrl}/user/update`, body, {
          headers: {
            Authorization: "Bearer " + userToken,
          },
        });
        setData(update.data);
        setUpdating(false);
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("fetch aborted");
        } else {
          console.log(error.message);
        }
      }
    }
  };

  return (
    <section>
      <h2>My profile</h2>
      <div>
        <div>name : {data?.name}</div>
        <div>surname : {data?.surname}</div>
        <div>username : {data?.username}</div>
        <div>email : {data?.email}</div>
        {/* <div>{data?.password}</div> */}
      </div>
      <div
        style={{ color: "blue", margin: "20px 0" }}
        onClick={() => {
          setUpdating(!updating);
        }}
      >
        update my profile
      </div>
      <form
        style={{ display: updating ? "flex" : "none" }}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          placeholder="name"
          onChange={(e) => {
            setName(e.target.value);
          }}
          value={name}
          type="text"
        />
        <input
          placeholder="surname"
          onChange={(e) => {
            setSurname(e.target.value);
          }}
          value={surname}
          type="text"
        />
        <input
          placeholder="username"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          value={username}
          type="text"
        />
        <input
          placeholder="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          value={email}
          type="email"
        />
        <input
          placeholder="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          value={password}
          type="password"
        />
        <input
          placeholder="confirm password"
          onChange={(e) => {
            setConfirmPassword(e.target.value);
          }}
          value={confirmPassword}
          type="password"
        />
        <input value="update" type="submit" />
      </form>
    </section>
  );
};

export default Profile;
