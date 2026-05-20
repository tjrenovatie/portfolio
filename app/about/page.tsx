import Image from "next/image";
import { ButtonLink } from "@/components/button";
import { MotionDiv, MotionH1, MotionP } from "@/components/motion";
import { getFirstBlobUrl } from "@/lib/vercel-blob";

const contactHighlights = [
  "Vrijblijvend meedenken",
  "Heldere planning",
  "Persoonlijke opvolging",
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const revealUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const revealRight = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.15,
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const About = async () => {
  const profileSrc = await getFirstBlobUrl(
    "profile/profile-image",
    "/assets/img/profile/profile-image.avif"
  );

  return (
    <article className="bg-white text-neutral-900">
      <section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-10 px-5 pb-20 pt-28 md:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <MotionDiv
          className="max-w-2xl select-text"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <MotionP className="eyebrow mb-4" variants={revealUp}>
            TJ Renovatie
          </MotionP>
          <MotionH1
            className="mb-6 leading-tight tracking-normal text-[--color-primary-title]"
            variants={revealUp}
          >
            Renovatie met aandacht voor planning, uitvoering en afwerking.
          </MotionH1>
          <MotionP
            className="mb-5 text-base leading-8 text-neutral-700 sm:text-lg"
            variants={revealUp}
          >
            Mijn naam is Thurston Joseph. Met TJ Renovatie help ik klanten met
            duidelijke keuzes, praktisch advies en zorgvuldig uitgevoerde
            verbouwingen in en rond de woning.
          </MotionP>
          <MotionP
            className="mb-8 text-base leading-8 text-neutral-700 sm:text-lg"
            variants={revealUp}
          >
            Of het nu gaat om een badkamer, keuken, toilet, woonkamer of een
            complete binnenruimte: het doel is altijd hetzelfde. Heldere
            afspraken, vakmanschap en een resultaat dat netjes wordt opgeleverd.
          </MotionP>

          <MotionDiv
            className="flex flex-col gap-3 sm:flex-row"
            variants={revealUp}
          >
            <ButtonLink href="/contact" variant="dark">
              Bespreek uw project
            </ButtonLink>
            <ButtonLink href="/projects" variant="secondary">
              Bekijk projecten
            </ButtonLink>
          </MotionDiv>
        </MotionDiv>

        <MotionDiv
          className="relative h-[26rem] overflow-hidden rounded-lg shadow-xl md:h-[34rem]"
          initial="hidden"
          animate="visible"
          variants={revealRight}
        >
          <Image
            src={profileSrc}
            alt="Thurston Joseph"
            fill
            className="profile-image"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white sm:p-7">
            <p className="eyebrow eyebrow-light">Thurston Joseph</p>
            <p className="mt-2 max-w-md text-base leading-7 text-white">
              Persoonlijk contact, duidelijke communicatie en aandacht voor het
              werk op locatie.
            </p>
          </div>
        </MotionDiv>
      </section>

      <section className="bg-neutral-50 px-5 py-16 lg:px-8">
        <MotionDiv
          className="mx-auto grid max-w-7xl overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg md:grid-cols-[1.1fr_0.9fr]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="p-6 sm:p-8 lg:p-10">
            <p className="eyebrow mb-4">Contact</p>
            <h2 className="mb-5 max-w-2xl text-3xl font-semibold text-[--color-primary-title] sm:text-4xl">
              Heeft u plannen voor een verbouwing?
            </h2>
            <p className="max-w-2xl text-base leading-8 text-neutral-700">
              Vertel kort wat u wilt aanpakken. Dan kijken we samen naar de
              ruimte, de planning en de beste volgende stap voor uw project.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/contact" variant="primary">
                Start uw aanvraag
              </ButtonLink>
            </div>
          </div>

          <div className="border-t border-neutral-200 bg-neutral-100 p-6 sm:p-8 md:border-l md:border-t-0 lg:p-10">
            <div className="grid gap-4">
              {contactHighlights.map((highlight) => (
                <div
                  key={highlight}
                  className="flex items-center gap-3 rounded-md border border-neutral-200 bg-white p-4"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-[--color-primary]" />
                  <p className="text-base font-semibold text-neutral-900">
                    {highlight}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-neutral-200 pt-6">
              <p className="eyebrow eyebrow-muted">Reactie</p>
              <p className="mt-2 text-base leading-7 text-neutral-700">
                U ontvangt een persoonlijke reactie met vragen of een voorstel
                voor een vervolggesprek.
              </p>
            </div>
          </div>
        </MotionDiv>
      </section>
    </article>
  );
};

export default About;
