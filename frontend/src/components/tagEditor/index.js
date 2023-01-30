import React, { useState, useEffect } from 'react';

import { fetchExternalJSONAPI } from "../../utills/fetch";
import Map from './map';
import { TagEditorForm } from './editForm';

var id = 5067983922;
var type = "node";
const count = 0

export default function TagEditor() {
    const [element, setElement] = useState([]);
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        (async () => {
            setLoading(true);
            const data = await fetchExternalJSONAPI(`https://api.openstreetmap.org/api/0.6/${type}/${id}.json`);
            setElement(data["elements"][0]);
            setLoading(false);
        })();
    }, []);
    return (
        <div className='h-auto border border-secondary-subtle p-2 pt-0'>
            {isLoading ? <div>Loading...</div> :
                (<div>
                    <div className='row p-2'>
                        <div className="col-6 d-flex justify-content-start fs-6 text-secondary align-items-center">
                            <span>{element.type}: </span> <span>{element.id}</span>
                        </div>
                        <div className='col-6 d-flex justify-content-end align-items-center'>
                            <div>
                                <button className="btn btn-secondary">
                                    <i className="fa fa-undo " aria-hidden="true"></i>
                                </button>
                                <button className="btn btn-secondary">
                                    <i className="fa fa-repeat" aria-hidden="true"></i>
                                </button>
                            </div>
                            <button className="btn btn-secondary ms-2" type="submit">
                                <i className="fa fa-upload"> {count}</i>
                            </button>
                        </div>
                    </div>
                    <Map element={element} />
                    <TagEditorForm element={element} setElement={setElement} />
                </div>)
            }
        </div>
    );
}