import ReactPlayer from "react-player";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const VideoPlayer = ({
  serverUrl,
  setRefresh,
  vid,
  userToken,
  refresh,
  pathname,
}) => {
  const [play, setPlay] = useState(false);
  const [modify, setModify] = useState(false);
  const [title, setTitle] = useState(vid.title);
  const [description, setDescription] = useState(vid.description);
  const [modal, setModal] = useState(false);

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
      setModify(false);
      setRefresh(!refresh);
    } catch (error) {
      console.log(error.message);
    }
  };

  const likeIt = async () => {
    try {
      const body = { like: true, id: vid._id };
      const like = await axios.post(`${serverUrl}/video/like`, body, {
        headers: { Authorization: "Bearer " + userToken },
      });

      setRefresh(!refresh);
    } catch (error) {
      console.log(error.message);
    }
  };

  const dontLikeIt = async () => {
    try {
      const body = { dislike: true, id: vid._id };
      const like = await axios.post(`${serverUrl}/video/like`, body, {
        headers: { Authorization: "Bearer " + userToken },
      });
      setRefresh(!refresh);
    } catch (error) {
      console.log(error.message);
    }
  };

  const viewCounter = async () => {
    try {
      const body = { id: vid._id };
      const view = await axios.post(`${serverUrl}/video/views`, body);
      setRefresh(!refresh);
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteVideo = async () => {
    try {
      const deleteIt = await axios.post(`${serverUrl}/video/delete`, {
        id: vid._id,
      });
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
      <div>
        <ReactPlayer
          url={vid.url}
          onStart={() => {
            viewCounter();
          }}
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
        <span
          className="like"
          onClick={() => {
            likeIt();
          }}
        >
          <FontAwesomeIcon icon="arrow-up" /> {vid.like.length}
        </span>
        <span
          className="dislike"
          onClick={() => {
            dontLikeIt();
          }}
        >
          <FontAwesomeIcon icon="arrow-down" /> {vid.dislike.length}
        </span>
        <span>
          <FontAwesomeIcon icon="person" /> {vid.view}
        </span>
        {pathname === "/myvideos" && (
          <div>
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
            {modify && (
              <div
                onClick={() => {
                  setModal(true);
                }}
              >
                {" "}
                X{" "}
              </div>
            )}
            {modal && (
              <div>
                Are you sure you want to delete this video ?{" "}
                <button
                  onClick={() => {
                    setModify(false);
                    deleteVideo();
                    setRefresh(!refresh);
                  }}
                >
                  Yes
                </button>
                <button
                  onClick={() => {
                    setModal(false);
                  }}
                >
                  No
                </button>{" "}
                Maybe... I don't know
              </div>
            )}
          </div>
        )}
      </div>
    </form>
  );
};

export default VideoPlayer;
