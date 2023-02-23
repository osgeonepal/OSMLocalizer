import React, {useEffect} from 'react';


function AuthorizedView(props) {
    // const [isRedyToRedirect, setIsRedyToRedirect] = useState(false);
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const state = params.get('state');
        console.log(code, state)
        window.opener.authComplete(code, state)
    }, []);
    return (
        <></>
    );
}

export default AuthorizedView;

