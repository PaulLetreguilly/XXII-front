import axios from "axios";
import { useEffect, useState } from "react";

const MyVideos = ({ serverUrl, userToken }) => {
  const [isUploading, setisUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState();
  const [data, setData] = useState();
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const abortCont = new AbortController();
    const fetchvideos = async () => {
      try {
        const videos = await axios.get(`${serverUrl}/myvideos`, {
          headers: { Authorization: "Bearer " + userToken },
        });
        // console.log(videos.data);
        setData(videos.data);
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("fetch aborted");
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
      console.log(upload.data);
      setRefresh(!refresh);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <section>
      <h2>My Videos</h2>
      <div
        style={{ color: "blue", margin: "20px 0" }}
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
            type="file"
            onChange={(e) => {
              setFile(e.target.files[0]);
            }}
          />
          <input
            placeholder="title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            type="text"
          />
          <textarea
            name="description"
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
          {data?.map((vid, index) => {
            return (
              <div key={vid._id}>
                <div>video number : {index + 1}</div>
                <div>video name : {vid.title}</div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default MyVideos;
