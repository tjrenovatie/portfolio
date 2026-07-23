import type { Metadata } from "next";
import type { Variants } from "framer-motion";
import Image from "next/image";
import { ButtonLink } from "@/components/button";
import {
  MotionDiv,
  MotionH1,
  MotionH2,
  MotionP,
  MotionSection,
} from "@/components/motion";
import { getFirstBlobUrl } from "@/lib/vercel-blob";
import { projects } from "@/lib/projects";
import FaqAccordion from "./FaqAccordion";

export const metadata: Metadata = {
  title: "Diensten - TJ Renovatie | Vakmanschap in elk detail",
  description:
    "Badkamerrenovatie, keukenrenovatie, tegelwerk, cinewalls en complete woningrenovaties. Vraag een vrijblijvende offerte aan bij TJ Renovatie.",
};

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const revealUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardCategories = [
  {
    icon: "bx-layer",
    title: "Tegelwerk",
    description:
      "Specialist in grootformaat tegels en complexe patronen. Perfecte voegen en naadloze overgangen.",
  },
  {
    icon: "bx-tv",
    title: "Wanden en cinewalls",
    description:
      "Moderne cinewalls met geïntegreerde haard en sfeerverlichting. Strak gestucte wanden voor een moderne look.",
  },
  {
    icon: "bx-home-alt",
    title: "Totaalrenovatie",
    description:
      "Wij nemen de gehele woning onder handen. Eén planning, één vast team en één verbluffend eindresultaat.",
  },
];

const benefits = [
  {
    icon: "bx-user",
    title: "Vast aanspreekpunt",
    description: "Directe communicatie en korte lijnen gedurende het gehele traject.",
  },
  {
    icon: "bx-calendar",
    title: "Nauwkeurige planning",
    description: "Duidelijke afspraken over deadlines en oplevermomenten.",
  },
  {
    icon: "bxs-diamond",
    title: "Premium materialen",
    description: "Wij werken uitsluitend met producten van de hoogste kwaliteit.",
  },
  {
    icon: "bx-badge-check",
    title: "Garantie op werk",
    description: "Zekerheid op de afwerking en de constructieve integriteit.",
  },
];

async function getServiceImages() {
  const bathroomProject = projects.find((project) => project.id === "p1");
  const kitchenProject = projects.find((project) => project.id === "p3");

  const [bathroomImage, kitchenImage] = await Promise.all([
    getFirstBlobUrl(bathroomProject?.blobPrefix ?? "", "/fallback.avif"),
    getFirstBlobUrl(kitchenProject?.blobPrefix ?? "", "/fallback.avif"),
  ]);

  return { bathroomImage, kitchenImage };
}

export default async function DienstenPage() {
  const { bathroomImage, kitchenImage } = await getServiceImages();

  return (
    <article className="w-full bg-[--color-background-dark] text-[--color-text-muted]">
      {/* Hero */}
      <MotionSection
        className="relative overflow-hidden bg-marble-dark bg-cover bg-center px-5 py-20 sm:px-8 md:py-28"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative mx-auto max-w-3xl">
          <MotionP
            className="eyebrow mb-4 !text-[--color-primary]"
            variants={revealUp}
          >
            Onze diensten
          </MotionP>
          <MotionH1
            className="mb-6 leading-tight text-[--color-broken-white]"
            variants={revealUp}
          >
            Van idee tot perfecte afwerking
          </MotionH1>
          <MotionP
            className="mb-10 max-w-2xl text-base leading-8 sm:text-lg"
            variants={revealUp}
          >
            Bij TJ Renovatie combineren we jarenlange ervaring met precisie in
            de uitvoering. Of het nu gaat om een specifieke ruimte of een
            volledige transformatie van uw woning, wij leveren vakmanschap dat
            voldoet aan de hoogste standaarden.
          </MotionP>
          <MotionDiv variants={revealUp}>
            <ButtonLink href="/contact" variant="primary">
              Vraag een vrijblijvende offerte aan
            </ButtonLink>
          </MotionDiv>
        </div>
      </MotionSection>

      {/* Detailed services */}
      <section className="mx-auto max-w-7xl space-y-24 px-5 py-20 sm:px-8 md:py-28">
        {/* Badkamerrenovatie */}
        <MotionDiv
          className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <MotionDiv
            className="relative order-2 aspect-[4/3] overflow-hidden md:order-1"
            variants={revealUp}
          >
            <Image
              src={bathroomImage}
              alt="Luxe badkamerrenovatie met donker tegelwerk"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 border border-[--color-border-subtle]" />
          </MotionDiv>
          <MotionDiv className="order-1 md:order-2" variants={revealUp}>
            <h2 className="mb-6 text-[--color-broken-white]">
              Badkamerrenovatie
            </h2>
            <p className="mb-8 text-base leading-8">
              Wij transformeren uw badkamer tot een persoonlijke spa. Van het
              verleggen van leidingen tot de laatste kitrand, wij ontzorgen u
              volledig.
            </p>
            <ul className="mb-10 space-y-3">
              {[
                "Installatie van sanitair en kranen",
                "Waterdichte wand- en vloerafwerking",
                "Maatwerk meubels en verlichtingsplan",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 bg-[--color-primary]" />
                  <span className="text-[--color-broken-white]">{item}</span>
                </li>
              ))}
            </ul>
            <ButtonLink
              href="/contact"
              variant="primary"
              className="!bg-transparent border border-[--color-primary] !text-[--color-broken-white] hover:!bg-[--color-primary] hover:!text-white"
            >
              Bespreek uw project
            </ButtonLink>
          </MotionDiv>
        </MotionDiv>

        {/* Keukenrenovatie */}
        <MotionDiv
          className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <MotionDiv variants={revealUp}>
            <h2 className="mb-6 text-[--color-broken-white]">
              Keukenrenovatie
            </h2>
            <p className="mb-8 text-base leading-8">
              De keuken is het hart van de woning. Wij realiseren keukens die
              niet alleen functioneel zijn, maar ook een architectonisch
              statement vormen.
            </p>
            <ul className="mb-10 space-y-3">
              {[
                "Aanpassen van elektra en gas/water",
                "Vakkundige montage van apparatuur",
                "Hoogwaardig tegelwerk en achterwanden",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 bg-[--color-primary]" />
                  <span className="text-[--color-broken-white]">{item}</span>
                </li>
              ))}
            </ul>
            <ButtonLink
              href="/contact"
              variant="primary"
              className="!bg-transparent border border-[--color-primary] !text-[--color-broken-white] hover:!bg-[--color-primary] hover:!text-white"
            >
              Bespreek uw project
            </ButtonLink>
          </MotionDiv>
          <MotionDiv
            className="relative aspect-[4/3] overflow-hidden"
            variants={revealUp}
          >
            <Image
              src={kitchenImage}
              alt="Moderne keukenrenovatie met maatwerk"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 border border-[--color-border-subtle]" />
          </MotionDiv>
        </MotionDiv>

        {/* Card grid */}
        <MotionDiv
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          {cardCategories.map((card) => (
            <MotionDiv
              key={card.title}
              variants={revealUp}
              className="flex flex-col border border-[--color-border-subtle] bg-[--color-surface-card] p-8 transition-transform duration-300 hover:-translate-y-1 hover:border-white/30"
            >
              <i
                className={`bx ${card.icon} mb-6 text-4xl text-[--color-primary]`}
                aria-hidden="true"
              />
              <h3 className="mb-4 text-xl font-semibold text-[--color-broken-white]">
                {card.title}
              </h3>
              <p className="mb-6 flex-grow text-sm">{card.description}</p>
              <a
                href="/contact"
                className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[--color-primary]"
              >
                Project bespreken
                <i className="bx bx-right-arrow-alt" aria-hidden="true" />
              </a>
            </MotionDiv>
          ))}
        </MotionDiv>
      </section>

      {/* Benefits */}
      <section className="border-t border-[--color-border-subtle] bg-[--color-surface-anthracite] px-5 py-20 sm:px-8 md:py-28">
        <MotionDiv
          className="mx-auto mb-16 max-w-3xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={containerVariants}
        >
          <MotionP
            className="eyebrow mb-4 !text-[--color-primary-title]"
            variants={revealUp}
          >
            Onze belofte
          </MotionP>
          <MotionH2
            className="text-2xl font-semibold text-[--color-broken-white] sm:text-3xl"
            variants={revealUp}
          >
            Waarom kiezen voor TJ Renovatie
          </MotionH2>
        </MotionDiv>
        <MotionDiv
          className="mx-auto grid max-w-6xl grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          {benefits.map((benefit) => (
            <MotionDiv
              key={benefit.title}
              variants={revealUp}
              className="text-center"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center border border-[--color-border-subtle] bg-[--color-surface-card]">
                <i
                  className={`bx ${benefit.icon} text-3xl text-[--color-primary]`}
                  aria-hidden="true"
                />
              </div>
              <h4 className="mb-3 text-lg font-semibold text-[--color-broken-white]">
                {benefit.title}
              </h4>
              <p className="text-sm">{benefit.description}</p>
            </MotionDiv>
          ))}
        </MotionDiv>
      </section>

      {/* FAQ */}
      <section className="px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto max-w-3xl">
          <MotionH2
            className="mb-12 text-center text-2xl font-semibold text-[--color-broken-white] sm:text-3xl"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            Veelgestelde vragen
          </MotionH2>

          <FaqAccordion />

          <div className="mt-16 border border-[--color-border-subtle] bg-[--color-surface-card] p-10 text-center">
            <h3 className="mb-4 text-xl font-semibold text-[--color-broken-white]">
              Staat uw vraag er niet tussen?
            </h3>
            <p className="mb-8">
              Wij staan klaar om al uw specifieke vragen te beantwoorden over
              uw aanstaande renovatie.
            </p>
            <ButtonLink href="/contact" variant="primary">
              Neem contact op
            </ButtonLink>
          </div>
        </div>
      </section>
    </article>
  );
}
