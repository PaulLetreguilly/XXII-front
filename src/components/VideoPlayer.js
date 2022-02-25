import ReactPlayer from "react-player";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const VideoPlayer = ({
  userId,
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
      if (userToken) {
        const body = { like: true, id: vid._id };
        const like = await axios.post(`${serverUrl}/video/like`, body, {
          headers: { Authorization: "Bearer " + userToken },
        });

        setRefresh(!refresh);
      } else {
        alert("Please log in first to like videos");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const dontLikeIt = async () => {
    try {
      if (userToken) {
        const body = { dislike: true, id: vid._id };
        const like = await axios.post(`${serverUrl}/video/like`, body, {
          headers: { Authorization: "Bearer " + userToken },
        });
        setRefresh(!refresh);
      } else {
        alert("Please log in first to dislike videos");
      }
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
      const deleteIt = await axios.post(
        `${serverUrl}/video/delete`,
        {
          id: vid._id,
        },
        {
          headers: { Authorization: "Bearer " + userToken },
        }
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const checkLike = () => {
    for (let i = 0; i < vid.like.length; i++) {
      if (vid) {
        // console.log(vid.like[i]);
        // console.log(userId);
        if (vid.like[i] === userToken) {
          return true;
        }
      }
    }
  };
  const checkDislike = () => {
    for (let i = 0; i < vid.dislike.length; i++) {
      if (vid) {
        if (vid.dislike[i] === userToken) {
          return true;
        }
      }
    }
  };

  return (
    <form
      className="form-vid"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <div>
        {modify ? (
          <input
            className="video-title"
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
          width={"100%"}
          url={vid.url}
          onStart={() => {
            viewCounter();
          }}
          controls={true}
        />
        <div className="under-vid">
          <div>
            {modify ? (
              // <textarea name="" id="" cols="30" rows="10"></textarea>
              <textarea
                name="video-description"
                // type="text"
                cols="40"
                rows="3"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            ) : (
              <span>{vid.description}</span>
            )}
          </div>
          <div>
            <span
              className="like btn"
              style={{
                color: checkLike() && "#74d963",
                borderColor: checkLike() && "#74d963",
              }}
              onClick={() => {
                likeIt();
              }}
            >
              <FontAwesomeIcon icon="arrow-up" /> {vid.like.length}
            </span>
            <span
              className="dislike btn"
              style={{
                color: checkDislike() && "#fe4555",
                borderColor: checkDislike() && "#fe4555",
              }}
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
                  <div className="update">
                    <input type="submit" value="send" className="btn" />
                    <div
                      className="btn"
                      onClick={() => {
                        setModal(true);
                      }}
                    >
                      {" "}
                      X{" "}
                    </div>
                  </div>
                ) : (
                  <button
                    className="btn update"
                    onClick={() => {
                      setModify(true);
                    }}
                  >
                    update
                  </button>
                )}
                {modal && (
                  <div className="modal">
                    Are you sure you want to delete this video ?{" "}
                    <div className="validation">
                      <button
                        className="btn val"
                        onClick={() => {
                          setModify(false);
                          deleteVideo();
                          setRefresh(!refresh);
                        }}
                      >
                        Yes
                      </button>
                      <button
                        className="btn val"
                        onClick={() => {
                          setModal(false);
                        }}
                      >
                        No
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default VideoPlayer;
