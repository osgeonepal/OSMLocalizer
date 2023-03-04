

const Footer = () => {
    return (
        <footer className="bg-secondary" style={{height: "33vh"}}>
        <div className="container text-light pt-4 fs-5">
            <div className="title">
               <span className="me-2">OSMLocalizer:</span>
                <a
                    className="text-light"
                    href="https://github.com/Aadesh-Baral/OSMLocalizer/releases/latest/"
                >
                    v1.0.0
                </a>
            </div>
            <div className="title">
                <span className="fw-semibold">A tool to help you localize places in OpenStreetMap.</span>
                <br />
                <span style={{fontSize:"0.9rem"}}>One tool to localize them all.</span>
            </div>
        </div>
        </footer>
    )
}

export default Footer