import React from 'react';

import './AddNewCommentComponent.css'
import {Button} from "react-bootstrap";

const AddNewCommentComponent = () => {
    return (<div>
        <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet"/>
        <div className="container bootdey">
            <div className="col-md-12 bootstrap snippets">
                <div className="panel">
                    <div className="panel-body">
                                <textarea className="form-control" rows="2"
                                          placeholder="What are you thinking?"></textarea>
                        <div className="mar-top clearfix">
                            <Button className={'pull-right btn-sm'}
                                variant="outline-primary"
                                onClick={() => {

                                }}
                            >Share</Button>

                            {/*<button className="btn btn-sm btn-primary pull-right" type="submit">*/}
                            {/*    <i className="fa fa-pencil fa-fw"></i> Share*/}
                            {/*</button>*/}
                        </div>
                    </div>
                </div>

            </div>
        </div>

    </div>);
};

export default AddNewCommentComponent;