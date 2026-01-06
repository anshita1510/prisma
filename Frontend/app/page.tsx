
import { Sliders } from "lucide-react";
import HeroSection from "./components/Sections/heroSection";
import Section1 from "./components/Sections/section1";
import Section2 from "./components/Sections/section2";
import Section3 from "./components/Sections/section3";

import Navbar from "./components/partials/navbar";
import Slider from "./components/partials/slider";
import Footer from "./components/partials/Footer";



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
