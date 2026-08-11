import Hero from "@/components/Hero";
import WhyChooseUs from "@/components/WhyChooseUs";
import UserRoles from "@/components/UserRoles";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import ContactForm from "@/components/ContactForm";

export default function Home() {
  return (
    <main>
      <Hero />
      <WhyChooseUs />
      <UserRoles />
      <Testimonials />
      <FAQ />
      <ContactForm />
    </main>
  );
}