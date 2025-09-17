// Footer.tsx
import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { Col, Row } from "react-bootstrap";
import { FiSend } from "react-icons/fi";
import { MdWavingHand } from "react-icons/md";
import "./FooterStyle.scss";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

const encode = (data: Record<string, string>) =>
  Object.keys(data)
    .map(
      (key) =>
        encodeURIComponent(key) + "=" + encodeURIComponent(data[key])
    )
    .join("&");

const Footer: React.FC = () => {
  const [formData, setFormData] = useState({ email: "" });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode({ "form-name": "newsletter", ...formData }),
    }).catch((error) => console.error(error));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Open link safely
  const openExternalLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="footerContainer spaciousLayout">
      <Row className="py-5">
        <Col md={5} sm={12} className="footerSec1Col1">
          <div className="text2 mb-3">Become Bizowl Insider</div>
          <div className="text1 mb-4">
            Grow Your Business, Get Free Business Consultation.
          </div>
          <form name="newsletter" method="post" onSubmit={handleSubmit} className="spaciousForm">
            <input type="hidden" name="form-name" value="newsletter" />
            <div className="input-group inputBoxStyle">
              <input
                type="email"
                className="inputStyle"
                placeholder="Your Email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <button className="footerSendButtonStyle" type="submit" aria-label="Send Email">
                <FiSend className="sendButtonStyle" size={22} color="#d3d3d373" />
              </button>
            </div>
          </form>
        </Col>

        <Col md={1} sm={0} />

        <Col md={6} sm={12} className="infoAndLinks">
          <div className="footerSec2Text1 mb-4">
            Bizowl is an online platform designed exclusively for business owners and startups.  
            Bizowl offers essential services, tools, resources, and expert guidance to start and grow a business.
          </div>
          <div className="footerLinksRow d-flex flex-wrap gap-4 mb-4">
            <NavLink className="navLinks textCapitalize" to="/aboutUs">About Us</NavLink>
            <NavLink className="navLinks textCapitalize" to="/">Services</NavLink>
            <NavLink className="navLinks textCapitalize" to="/blogs">Blogs</NavLink>
            <NavLink className="navLinks textCapitalize" to="/contactUs">Contact Us</NavLink>
            <NavLink className="navLinks textCapitalize" to="/termsAndCondition">Terms and Conditions</NavLink>
            <NavLink className="navLinks textCapitalize" to="/privacyPolicy">Privacy Policy</NavLink>
            <NavLink className="navLinks textCapitalize" to="/refund-and-cancellation-policy">Refund and Cancellation Policy</NavLink>
            <NavLink className="navLinks textCapitalize" to="https://bizowl-partner.web.app/login">Partner</NavLink>
          </div>

          <div>
            <span className="footerSec2Text1">Let's Chat! </span>
            <span className="footerSec2Text2">
              Say <MdWavingHand color="gold" /> at{" "}
              <a href="mailto:contact@bizzowl.com" className="contactDetailsItemBody touchable" aria-label="Email contact@bizzowl.com">
                contact@bizzowl.com
              </a>
            </span>
          </div>

          <div className="footerSec2SocialIcons mt-3">
            <div onClick={() => openExternalLink("https://www.facebook.com/bizowl")} className="socialIconView pointer" role="button" tabIndex={0} aria-label="Facebook">
              <FaFacebookF color="#fafafa" />
            </div>
            <div onClick={() => openExternalLink("https://www.instagram.com/bizowlofficial/")} className="socialIconView pointer" role="button" tabIndex={0} aria-label="Instagram">
              <FaInstagram color="#fafafa" />
            </div>
            <div onClick={() => openExternalLink("https://www.linkedin.com/company/bizowl/")} className="socialIconView pointer" role="button" tabIndex={0} aria-label="LinkedIn">
              <FaLinkedin color="#fafafa" />
            </div>
            <div onClick={() => openExternalLink("https://www.youtube.com/@bizowl")} className="socialIconView pointer" role="button" tabIndex={0} aria-label="YouTube">
              <FaYoutube color="#fafafa" />
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={12} className="text-center colorWhite padding10 spaciousCopyright">
          &copy; White Sense Pvt. Ltd. {new Date().getFullYear()}
        </Col>
      </Row>
    </div>
  );
};

export default Footer;
