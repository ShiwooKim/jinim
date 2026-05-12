import { BrandLanding } from "@/components/brand/BrandLanding";
import { SiteFooter } from "@/components/brand/SiteFooter";
import { SiteHeader } from "@/components/brand/SiteHeader";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <BrandLanding />
      <SiteFooter />
    </>
  );
}
