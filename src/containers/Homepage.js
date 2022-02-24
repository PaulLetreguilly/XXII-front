import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import VideoPlayer from "../components/VideoPlayer";
import { useLocation } from "react-router";

const Homepage = ({ serverUrl, userToken }) => {
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
    <section>
      <h2>Homepage</h2>
      <span
        onClick={() => {
          setUsers(false);
        }}
      >
        Video list
      </span>
      <span
        onClick={() => {
          setUsers(true);
        }}
      >
        User list
      </span>
      {users ? (
        <section>
          {dataUsers?.map((user) => {
            return (
              <div key={user._id}>
                <div>{user.username}</div>
                <div>number of videos : {user.videos.length}</div>
                {/* <div
                  onClick={() => {
                    navigate("/");
                  }}
                >
                  see {user.username}'s videos !
                </div> */}
              </div>
            );
          })}
        </section>
      ) : (
        <section>
          {dataVideos.map((video) => {
            return (
              <div key={video._id}>
                <VideoPlayer
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

{
  /* <div>
        <span style={{ fontWeight: "bold" }}>list of users : </span>
        {data?.map((user) => {
          return <div key={user._id}>{user.username}</div>;
        })}
      </div> */
}
