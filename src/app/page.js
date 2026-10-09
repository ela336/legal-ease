import Banner from "./components/Banner";
import FeaturedLawyers from "./components/home/FeaturedLawyers";
import TopExperts from "./components/home/TopExperts";
import Categories from "./components/home/Categories";

export default function Home() {
  return (
    
      <main className="flex-1">
      <Banner />
      <FeaturedLawyers />
      <TopExperts />
      <Categories />
    </main>
      
    
  );
}
