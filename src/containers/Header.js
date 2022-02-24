import { useNavigate } from "react-router";

const Header = ({ userToken, setConnected }) => {
  const navigate = useNavigate();
  return (
    <section>
      <div
        onClick={() => {
          navigate("/");
        }}
      >
        Home
      </div>
      <div
        onClick={() => {
          navigate("/myvideos");
        }}
      >
        my videos
      </div>

      {/* if user is connected disconnect button will appear in header, otherwise sign up / log in button will appear */}
      {!userToken ? (
        <div>
          <div
            onClick={() => {
              navigate("/signup");
            }}
          >
            sign up
          </div>
          <div
            onClick={() => {
              navigate("/login");
            }}
          >
            log in
          </div>
        </div>
      ) : (
        <div>
          <div
            onClick={() => {
              navigate("/myprofile");
            }}
          >
            my profile
          </div>
          <div
            onClick={() => {
              setConnected(null);
            }}
            style={{ color: "red" }}
          >
            disconnect
          </div>
        </div>
      )}
    </section>
  );
};

export default Header;
