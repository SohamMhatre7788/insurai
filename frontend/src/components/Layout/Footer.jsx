import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* About Us Section */}
        <div className="footer-about">
          <strong>About Us</strong>
          <p>
                Welcome to our team project, this project is the part of Infosys Springboard Virtual Internship 6.0.<br/>
                Our Team has 5 Members,
                <br/><a href="https://www.linkedin.com/in/soham-sunil-mhatre" target="_blank">Soham Mhatre</a>
                <br/><a href="https://www.linkedin.com/in/rishikesh-wakchaure-06055524b/" target="_blank">Rishikesh Wakchaure</a>
                <br/><a href="https://www.linkedin.com/in/sanskar-more-740793232" target="_blank">Sanskar More</a>
                <br/><a href="https://www.linkedin.com/in/srushti-gadakh-81796725b " target="_blank">Srushti Gadakh</a>
                <br/><a href="https://www.linkedin.com/in/paridhi-gupta-968aa1293/" target="_blank">Paridhi Gupta</a><br/> 
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
