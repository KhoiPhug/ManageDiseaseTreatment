import { Link } from "react-router-dom";
import config from '@/config';

function Profile() {
    return (
        <div>
            <h2>Profile Page</h2>
            <Link to={config.routes.specialistChecklist}>hung</Link>
        </div>
    );
}

export default Profile;
