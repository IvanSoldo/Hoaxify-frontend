import UserList from "../components/UserList";
import HoaxSubmit from "../components/HoaxSubmit";
import { useSelector } from "react-redux";
import HoaxFeed from "../components/HoaxFeed";

const HomePage = () => {
  const { user } = useSelector((state) => state.authentication);

  return (
    <div>
      <div className="row">
        <div className="col-8">
          {user.isLoggedIn && <HoaxSubmit />}
          <HoaxFeed />
        </div>
        <div className="col-4">
          <UserList />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
