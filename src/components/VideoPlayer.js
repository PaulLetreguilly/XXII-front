import ReactPlayer from "react-player";
import { useState } from "react";
import axios from "axios";

const VideoPlayer = ({ serverUrl, setRefresh, vid, userToken, refresh }) => {
  const [play, setPlay] = useState(false);
  const [modify, setModify] = useState(false);
  const [title, setTitle] = useState(vid.title);
  const [description, setDescription] = useState(vid.description);

  const body = { id: vid._id };

  //   only if we changed title or description
  if (title !== vid.title) {
    body.title = title;
  }
  if (description !== vid.description) {
    body.description = description;
  }

  const handleSubmit = async () => {
    try {
      const update = await axios.post(`${serverUrl}/update/video`, body, {
        headers: { Authorization: "Bearer " + userToken },
      });
      //   console.log(update.data);
      setModify(false);
      setRefresh(!refresh);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <div>
        video name :{" "}
        {modify ? (
          <input
            type="text"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            value={title}
          />
        ) : (
          <span>{vid.title}</span>
        )}
      </div>
      <ReactPlayer
        url={vid.url}
        onClick={() => {
          setPlay(!play);
        }}
        playing={play}
        controls={true}
      />
      <div>
        description :{" "}
        {modify ? (
          <input
            type="text"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        ) : (
          <span>{vid.description}</span>
        )}
      </div>
      {modify ? (
        <input type="submit" value="send" />
      ) : (
        <button
          onClick={() => {
            setModify(true);
          }}
        >
          update
        </button>
      )}
    </form>
  );
};

export default VideoPlayer;
