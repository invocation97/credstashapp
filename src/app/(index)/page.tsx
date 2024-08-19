import Features from "@/components/marketing/Features";
import Hero from "@/components/marketing/Hero";
import ProductPromo from "@/components/marketing/ProductPromo";

export default async function Page() {
  return (
    <div className="flex-1">
      <Hero />
      <ProductPromo />
      <Features />
    </div>
  );
}
