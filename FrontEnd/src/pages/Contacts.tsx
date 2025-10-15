import LocationMap from "@/components/contact/LocationMap";
import FaqSection from "@/components/contact/FaqSection";
import SocialMediaSection from "@/components/contact/SocialMediaSection";
import ContactInfoCards from "@/components/contact/ContactInfoCards";
import ContactForm from "@/components/contact/ContactForm";

const Contacts = () => {
  return (
    <div className="">
      {/* Hero Section */}
      <div className="hero">
        <section className="container">
          <h1>Liên hệ với chúng tôi</h1>
          <p>Hãy để lại thông tin, chúng tôi sẽ liên hệ với bạn sớm nhất</p>
        </section>
      </div>

      {/* Contact Info Cards */}
      <ContactInfoCards />

      {/* Contact Form & Map Section */}
      <section className="section">
        <div className="container h-fit">
          <div className="row">
            {/* Contact Form */}
            <div className="col-md-6 mb-4">
              <ContactForm />
            </div>

            {/* Map & Location Info */}
            <div className="col-md-6 mb-4">
              <LocationMap />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FaqSection />

      {/* Social Media Section */}
      <SocialMediaSection />
    </div>
  );
};

export default Contacts;
