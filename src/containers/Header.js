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
        users
      </div>
      <div>my videos</div>

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
        <div
          onClick={() => {
            setConnected(null);
          }}
          style={{ color: "red" }}
        >
          disconnect
        </div>
      )}
      {/* <div
        onClick={() => {
          navigate("/signup");
        }}
      >
        s'inscrire
      </div>
      <div
        onClick={() => {
          navigate("/login");
        }}
      >
        se connecter
      </div> */}
    </section>
  );
};

export default Header;
