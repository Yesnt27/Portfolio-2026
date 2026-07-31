import Image from "next/image";
import HeroPortraitHotspot from "@/components/HeroPortraitHotspot";
import { homeImages } from "@/lib/home-images";

export default function Hero() {
  return (
    <section id="home" className="mx-auto w-full max-w-page">
      <figure className="relative aspect-[1920/1080] w-full overflow-hidden bg-[#111]">
        <Image
          src={homeImages.heroDrawing}
          alt="Illustration of Kenny holding a subway hand strap"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <HeroPortraitHotspot />
      </figure>

      <div className="px-[clamp(1.5rem,calc(min(100vw,1920px)*174/1920),10.875rem)] pt-[clamp(2rem,calc(min(100vw,1920px)*152/1920),9.5rem)]">
        <h1 className="max-w-[1050px] font-display text-[clamp(3rem,calc(min(100vw,1920px)*180/1920),11.25rem)] font-bold leading-[0.92] tracking-[-0.02em] text-white">
          Hello, I&rsquo;m Kenny
        </h1>
        <p className="mt-[clamp(1.5rem,calc(min(100vw,1920px)*80/1920),5rem)] max-w-[903px] font-body text-[clamp(1.0625rem,calc(min(100vw,1920px)*30/1920),1.875rem)] font-medium leading-normal text-white">
          Multidisciplinary graphic designer and artist with a drive to create
          with emphasis on practical design and creative storytelling.
        </p>
      </div>
    </section>
  );
}
