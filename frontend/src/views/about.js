import fossLogo from "../assets/icons/open-source.png";

const AboutView = () => {
  return (
    <div className="container">
      <div className="col-md-10 col-lg-9 col-xl-8 col-sm-12  p-2 ps-4 pt-4 ms-3 ">
        <div>
          <span className="fs-1 title border-bottom border-4 border-primary active">
            About
          </span>
        </div>
        <div className="mt-4 ps-4">
          <p
            className="fw-semibold"
            style={{ textAlign: "justify", textJustify: "inter-word" }}
          >
            In a world of ever-changing maps, there was one tool that could
            conquer the challenge of localizing names in OpenStreetMap - OSM
            Localizer. The legend of this powerful tool was whispered throughout
            the lands, and many brave mappers sought to wield its power.
          </p>
          <p style={{ textAlign: "justify", textJustify: "inter-word" }}>
            The story of OSM Localizer began long ago, when the mappers of the
            world were faced with a great challenge - how to accurately and
            comprehensively map the names of places and things in every language
            and culture. The mappers knew that to achieve this goal, they needed
            a tool that was powerful and versatile, one that could fetch data
            from any corner of the world, and suggest translations for names
            based on the set name of the element.
            <br />
            <br />
            And so, the mappers set out on a quest to find such a tool, and
            after many trials and tribulations, they discovered the OSM
            Localizer. Like the One Ring of power, OSM Localizer gave them
            immense control over the data, allowing them to create challenges,
            fetch elements and localize easily with tools like translate engine
            and transliterate integrated within it.
            <br />
            <br />
            But the true magic of OSM Localizer was its ability to unite mappers
            from all over the world in a common cause. The mappers came from
            different lands and spoke different languages, but they were all
            united in a shared mission to create a more complete and accurate
            map of the world.
            <br />
            <br />
            Together, they faced many challenges - from the rugged peaks of the
            mountains to the vast expanse of the oceans, from the bustling
            cities to the quiet countryside. But with OSM Localizer as their
            guide, they were able to overcome these obstacles, one name at a
            time.
            <br />
            <br />
            And so, the legend of OSM Localizer grew, until it became known as
            the one tool to localize them all. Its power and versatility had
            helped to create a more accurate and comprehensive map of the world,
            and its ability to unite mappers from all corners of the globe had
            created a community of people who shared a common vision of a better
            world.
            <br />
            <br />
            And so, the mappers continued on their journey, using OSM Localizer
            to chart new territories and conquer new challenges. They knew that
            with this powerful tool at their fingertips, they could make a real
            impact on the world, and ensure that the maps we use are accurate,
            up-to-date, and truly reflect the diverse cultures and languages of
            our world.
          </p>
        </div>
        <div className="row ps-4">
          <span className="text-body fw-bold title fs-3">
            Free and Open Source
          </span>
          <div className="col-8 d-flex align-items-center">
            <p
              className="text-body"
              style={{ textAlign: "justify", textJustify: "inter-word" }}
            >
              The OSMLocalizer is Free and Open Source software developed for
              OpenStreetMap Community. The application’s code can be accessed
              through&nbsp;
              <a
                className="text-decoration-none"
                href="https://github.com/Aadesh-Baral/OSMLocalizer"
                title="OSMLocalizer"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
              , where you can report issues and make contributions.
            </p>
          </div>
          <div className="col-4">
            <img
              className="d-block"
              src={fossLogo}
              alt="foss"
              style={{ width: "80px", height: "80px" }}
            />
            <a
              style={{ fontSize: "0.8rem" }}
              href="https://www.flaticon.com/free-icons/open-source"
              title="open source icons"
              target="_blank"
              rel="noreferrer"
            >
              Open source icons created by Pixel perfect - Flaticon
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutView;
