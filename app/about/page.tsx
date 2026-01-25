import Link from "next/link";
import React from "react";
import BlobImage from "../../components/blobImage";

const About = () => {
  return (
    <article className="w-full flex justify-center items-center p-5 bg-white pb-32">
      <div className="container max-w-7xl flex flex-col items-center mt-10">
        {/* Hero Section with Image and Title */}
        <div className="relative w-full h-[50vh] sm:h-[30vh] md:h-[40vh] lg:h-[50vh] rounded-lg overflow-hidden">
          <BlobImage
            blobPrefix="profile/profile-image"
            fallbackSrc="/assets/img/profile/1.webp"
            alt="Thurston Joseph"
            fill
            className="profile-image"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold select-text">
              Hi, I&lsquo;m Thurston.
            </h1>
          </div>
        </div>

        {/* About Description Section */}
        <div className="mt-10 w-full max-w-4xl text-center select-text">
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 leading-relaxed mb-8">
            Welkom! Mijn naam is Thurston Joseph, een ondernemer met een passie
            voor de bouw. Voor mij draait bouwen niet alleen om stenen stapelen,
            maar om dromen verwezenlijken. Of het nu gaat om een renovatie,
            nieuwbouw, of een kleine aanpassing!
          </p>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 leading-relaxed mb-8">
            Wilt u een zorgeloze verbouwing? Ik zorg hier voor! Kwaliteit,
            meedenken, adviseren en vakmanschap voor een eerlijke prijs, dat is
            waar ik voor sta!
          </p>
        </div>

        {/* Contact Section */}
        <div className="mt-16 w-full max-w-4xl text-center select-text">
          <hr className="border-gray-300 mb-10" />

          <Link
            href="/contact"
            className="text-[--color-primary] text-xl sm:text-2xl md:text-3xl hover:no-underline"
          >
            Let&lsquo;s Connect
          </Link>
        </div>
      </div>
    </article>
  );
};

export default About;
