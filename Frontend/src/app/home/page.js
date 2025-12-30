import HeroSection from "../../components/Sections/Herosection";
import Navbar from "../../components/partials/Navbar";
import Slider from "../../components/partials/Slider";
import Footer from "../../components/partials/Footer";
import Section1 from "../../components/Sections/Section1"
import Section2 from "../../components/Sections/Section2"
import Section3 from "../../components/Sections/Section3"


export default function page() {
  return (
    <div>
      <Navbar></Navbar>
      <HeroSection></HeroSection>  
      <Slider></Slider>
      <Section1></Section1>
      <Section2></Section2>
      <Section3></Section3>
      <Footer></Footer>
    
    </div>
  )
}
