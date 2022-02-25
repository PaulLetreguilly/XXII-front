import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import VideoPlayer from "../components/VideoPlayer";
import { useLocation } from "react-router";

const Homepage = ({ serverUrl, userToken, userId }) => {
  const [dataUsers, setDataUsers] = useState();
  const [dataVideos, setDataVideos] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const abortCont = new AbortController();
    const fetchData = async () => {
      try {
        const userList = await axios.get(`${serverUrl}/users`);
        setDataUsers(userList.data);

        const videoList = await axios.get(`${serverUrl}/videos`);
        setDataVideos(videoList.data);

        setIsLoading(false);
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
  }, [refresh]);

  return isLoading ? (
    <div>Loading ...</div>
  ) : (
    <section className="container home">
      <div className="switch">
        <span
          className={`btn ${users ? null : "blue"}`}
          onClick={() => {
            setUsers(false);
          }}
        >
          Video list
        </span>
        <span
          className={`btn ${users ? "blue" : null}`}
          onClick={() => {
            setUsers(true);
          }}
        >
          User list
        </span>
      </div>

      {users ? (
        <section className="contain-list">
          {dataUsers?.map((user) => {
            return (
              <div key={user._id} className="user">
                <div>{user.username}</div>
                <div>number of videos : {user.videos.length}</div>
              </div>
            );
          })}
        </section>
      ) : (
        <section className="contain-vid">
          {dataVideos.map((video) => {
            return (
              <div key={video._id} className="video">
                <VideoPlayer
                  userId={userId}
                  serverUrl={serverUrl}
                  setRefresh={setRefresh}
                  vid={video}
                  userToken={userToken}
                  refresh={refresh}
                  pathname={location.pathname}
                />
              </div>
            );
          })}
        </section>
      )}
    </section>
  );
};

export default Homepage;
