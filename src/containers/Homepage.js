import axios from "axios";
import { useEffect, useState } from "react";

const Homepage = ({ serverUrl }) => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const abortCont = new AbortController();
    const fetchData = async () => {
      try {
        const response = await axios.get(`${serverUrl}/user`);
        console.log(response.data);
        setIsLoading(false);
        setData(response.data);
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("fetch aborted");
        } else {
          console.log(error.message);
        }
      }
    };
    fetchData({ signal: abortCont.signal });
    return () => {
      abortCont.abort();
    };
  }, []);

  return isLoading ? (
    <div>Loading ...</div>
  ) : (
    <section>
      <h2>Homepage</h2>
      <div>
        <span style={{ fontWeight: "bold" }}>list of users : </span>
        {data.map((user) => {
          return <div key={user._id}>{user.username}</div>;
        })}
      </div>
    </section>
  );
};

export default Homepage;
