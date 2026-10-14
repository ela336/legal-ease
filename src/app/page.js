import Banner from "./components/Banner";
import Statistics from "./components/home/Statistics";
import FeaturedLawyers from "./components/home/FeaturedLawyers";
import HowItWorks from "./components/home/HowItWorks";
import TopExperts from "./components/home/TopExperts";
import Categories from "./components/home/Categories";
import Testimonials from "./components/home/Testimonials";
import FAQ from "./components/home/FAQ";

export default function Home() {
  return (
    <main className="flex-1">
      <Banner />
      <Statistics />
      <FeaturedLawyers />
      <HowItWorks />
      <TopExperts />
      <Categories />
      <Testimonials />
      <FAQ />
    </main>
  );
}