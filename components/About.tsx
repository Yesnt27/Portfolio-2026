export default function About() {
  return (
    <section
      id="about"
      className="mx-auto w-full max-w-page px-[clamp(1.5rem,calc(min(100vw,1920px)*174/1920),10.875rem)] pb-[clamp(2rem,calc(min(100vw,1920px)*80/1920),5rem)] pt-[clamp(3rem,calc(min(100vw,1920px)*120/1920),7.5rem)]"
      aria-labelledby="about-heading"
    >
      <h2
        id="about-heading"
        className="font-display text-[clamp(2rem,calc(min(100vw,1920px)*60/1920),3.75rem)] font-bold leading-[0.92] text-white"
      >
        About Me
      </h2>
      <p className="mt-[clamp(1rem,calc(min(100vw,1920px)*40/1920),2.5rem)] max-w-[903px] font-body text-[clamp(1.0625rem,calc(min(100vw,1920px)*30/1920),1.875rem)] font-medium leading-[1.4] text-white">
        Multidisciplinary graphic designer and artist focused on practical design
        and creative storytelling. More about this section coming soon.
      </p>
    </section>
  );
}
