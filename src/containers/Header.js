import { useNavigate } from "react-router";
import Logo from "../assets/logo-png.png";

const Header = ({ userToken, setConnected }) => {
  const navigate = useNavigate();
  return (
    <section className="header">
      <div
        className="logo btn"
        onClick={() => {
          navigate("/");
        }}
      >
        <img src={Logo} alt="" />
        Mytube
      </div>
      <div
        className="btn header-mid"
        onClick={() => {
          navigate("/myvideos");
        }}
      >
        my videos
      </div>

      {/* if user is connected disconnect button will appear in header, otherwise sign up / log in button will appear */}
      {!userToken ? (
        <div className="header-right">
          <div
            className="btn"
            onClick={() => {
              navigate("/signup");
            }}
          >
            sign up
          </div>
          <div
            className="btn"
            onClick={() => {
              navigate("/login");
            }}
          >
            log in
          </div>
        </div>
      ) : (
        <div className="header-right">
          <div
            className="btn"
            onClick={() => {
              navigate("/myprofile");
            }}
          >
            my profile
          </div>
          <div
            className="btn"
            onClick={() => {
              setConnected(null);
            }}
            style={{ color: "#fe4555" }}
          >
            disconnect
          </div>
        </div>
      )}
    </section>
  );
};

export default Header;
