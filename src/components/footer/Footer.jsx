import "./styles.css";
import {Figma, Instagram, LinkedIn, Twitter, YouTube} from "../../assets/imgs/svg/index.js";

const Footer = () => {
    return (
        <div className="footer-container">
            <div className="footer-networks">
                <Figma/>
                <div className='footer-net-links'>
                    <Twitter/>
                    <Instagram/>
                    <YouTube/>
                    <LinkedIn/>
                </div>
            </div>
            <div className="footer-links">
                <div className='footer-title'>Use Cases</div>
                <div>UI design</div>
                <div>UX design</div>
                <div>Wireframing</div>
                <div>Diagramming</div>
                <div>Brainstorming</div>
                <div>Online whiteboard</div>
                <div>Team collaboration</div>
            </div>
            <div className="footer-links">
                <div className='footer-title'>Explore</div>
                <div>Design</div>
                <div>Prototyping</div>
                <div>Development features</div>
                <div>Design systems</div>
                <div>Collaboration features</div>
                <div>Design process</div>
                <div>FigJam</div>
            </div>
            <div className="footer-links">
                <div className='footer-title'>Resources</div>
                <div>Blog</div>
                <div>Best practices</div>
                <div>Colors</div>
                <div>Color wheel</div>
                <div>Support</div>
                <div>Developers</div>
                <div>Resource library</div>
            </div>
        </div>
    );
};

export default Footer;
