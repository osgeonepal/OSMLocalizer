import notFound from "../assets/icons/notFound.jpg";

export const Notfound = () => {
  return (
    <div style={{ height: "90vh" }}>
      <div
        className="d-flex justify-content-center"
        style={{ height: "80%", overflowX: "hidden" }}
      >
        <img src={notFound} alt="notFound" />
      </div>
      <div className="title d-flex align-items-center flex-column">
        <h1>The page you are looking for is not found</h1>
        <div style={{ fontSize: "0.8rem" }}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.freepik.com/free-vector/oops-404-error-with-broken-robot-concept-illustration_8030430.htm#query=404%20not%20found&position=2&from_view=keyword&track=ais"
          >
            Image by storyset
          </a>
          <span> on Freepik</span>
        </div>
      </div>
    </div>
  );
};
