import BlobImage from "../../components/blobImage";
import AboutClient from "./AboutClient";

const contactHighlights = [
  "Vrijblijvend meedenken",
  "Heldere planning",
  "Persoonlijke opvolging",
];

const About = () => {
  return (
    <AboutClient
      contactHighlights={contactHighlights}
      profileImage={
        <BlobImage
          blobPrefix="profile/profile-image"
          fallbackSrc="/assets/img/profile/profile-image.avif"
          alt="Thurston Joseph"
          fill
          className="profile-image"
          priority
        />
      }
    />
  );
};

export default About;
