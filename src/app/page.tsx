import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Experiencias from "@/components/sections/SearchBar";
import Ofertas from "@/components/sections/Ofertas";
import FAQ from "@/components/sections/FAQ";
import Contacto from "@/components/sections/Contacto";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Experiencias />
        <Ofertas />
        <FAQ />
        <Contacto />
      </main>
      <Footer />
    </>
  );
}
