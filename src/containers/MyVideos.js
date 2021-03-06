import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import VideoPlayer from "../components/VideoPlayer";

const MyVideos = ({ serverUrl, userToken, userId }) => {
  const [isUploading, setisUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState();
  const [data, setData] = useState();
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userToken) {
      navigate("/login");
    }
  }, [userToken]);

  useEffect(() => {
    const abortCont = new AbortController();
    const fetchvideos = async () => {
      try {
        if (userToken) {
          const videos = await axios.get(`${serverUrl}/myvideos`, {
            headers: { Authorization: "Bearer " + userToken },
          });
          setData(videos.data);
          setIsLoading(false);
        }
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("fetch aborted");
        } else if (error.response.status === 401) {
          window.location.reload(true);
        } else {
          console.log(error.message);
        }
      }
    };
    fetchvideos({ signal: abortCont.signal });
    return () => {
      abortCont.abort();
    };
  }, [refresh]);

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("video", file);

      const upload = await axios.post(`${serverUrl}/upload`, formData, {
        headers: { Authorization: "Bearer " + userToken },
      });
      setRefresh(!refresh);
      setisUploading(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  return isLoading ? (
    <div>Loading ...</div>
  ) : (
    <section className="contain-video">
      <h2>My Videos</h2>
      <div
        className="btn upload"
        style={{ color: "#24b0da", margin: "20px 0" }}
        onClick={() => {
          setisUploading(!isUploading);
        }}
      >
        upload new video
      </div>
      {isUploading ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <input
            className="file"
            type="file"
            onChange={(e) => {
              setFile(e.target.files[0]);
            }}
          />
          <input
            className="title"
            placeholder="title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            type="text"
          />
          <textarea
            className="description"
            name="description"
            placeholder="description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            cols="30"
            rows="5"
          ></textarea>
          <input type="submit" value="send" />
        </form>
      ) : (
        <div>
          <div>number of videos : {data?.length}</div>
          <div className="videos">
            {data?.map((vid, index) => {
              return (
                <div key={vid._id} className="myvideos">
                  <div>video number : {index + 1}</div>
                  <VideoPlayer
                    userId={userId}
                    serverUrl={serverUrl}
                    setRefresh={setRefresh}
                    vid={vid}
                    userToken={userToken}
                    refresh={refresh}
                    pathname={location.pathname}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

export default MyVideos;
