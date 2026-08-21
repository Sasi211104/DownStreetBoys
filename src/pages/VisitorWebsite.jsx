import Countdown from "../components/Countdown";

import About from "./About";
import Events from "./Events";
import Donations from "./Donations";
import Contact from "./Contact";

import Footer from "../components/Footer";

function VisitorWebsite() {
  return (
    <div className="app">

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">

        <div className="logo">
          🕉️ DSB
          <span>VINAYAKA MAHOTSAV</span>
        </div>

        <div className="nav-links">

          <a href="#home">Home</a>

          <a href="#about">About</a>

          <a href="#events">Events</a>

          <a href="#donations">Donations</a>

          <a href="#contact">Contact</a>

        </div>

      </nav>


      {/* ================= HERO ================= */}

      <section
        className="hero"
        id="home"
      >

        <div className="hero-content">

          <p className="welcome">
            🙏 GANPATI BAPPA MORYA 🙏
          </p>

          <h1>
            DSB
            <span>VINAYAKA MAHOTSAV</span>
          </h1>

          <p className="location">
            DOWN STREET BOYS • GORAPALLI VILLAGE
          </p>

          <p className="tagline">
            Together in Devotion, United in Celebration
          </p>

          <Countdown />

          <button
            className="hero-button"
            onClick={() =>
              document
                .getElementById("events")
                ?.scrollIntoView({
                  behavior: "smooth"
                })
            }
          >
            Explore Festival
          </button>

        </div>


        {/* HERO IMAGE */}

        <div className="hero-image">

          <img
            src="/images/dsb_image.jpg"
            alt="DSB Vinayaka Mahotsav Ganesh Idol"
          />

        </div>

      </section>


      {/* ================= ABOUT ================= */}

      <About />


      {/* ================= EVENTS ================= */}

      <Events />


      {/* ================= DONATIONS ================= */}

      <Donations />


      {/* ================= CONTACT ================= */}

      <Contact />


      {/* ================= FOOTER ================= */}

      <Footer />

    </div>
  );
}

export default VisitorWebsite;