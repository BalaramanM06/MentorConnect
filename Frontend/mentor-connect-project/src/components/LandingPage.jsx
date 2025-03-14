import { Link } from "react-router-dom";
import LandingPageNavbar from "./LandingPageNavBar";
import LandingPageBody from "./LandingPageBody";
import LandingPageFooter from "./LandingPageFooter";


export default function LandingPage() {
    return (
        <div className="landing-page">
            <LandingPageNavbar />
            <LandingPageBody />
            <LandingPageFooter />
        </div>
    );
}