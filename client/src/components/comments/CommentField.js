import React from 'react';
import classes from "../../pages/TopicDetails.module.css";

const CommentField = (props) => {
    const {comment, replies} = props

    return (
        <div className="media-block">
            <a className="media-left" href="#">
                <img className="img-circle img-sm"
                     alt="Profile Picture"
                     src="https://bootdey.com/img/Content/avatar/avatar1.png"/>
            </a>
            <div className="media-body">
                <div className="mar-btm">
                    <a href="#" className="btn-link text-semibold media-heading box-inline">
                        {comment.created_by_user_name}
                    </a>
                    <p className="text-muted text-sm">
                        {comment.updatedAt}
                    </p>
                </div>
                <p>
                    {comment.text}
                </p>
                <div className="pad-ver">
                    <div className="btn-group">
                        {/*<a className="btn btn-sm btn-default btn-hover-success" href="#">*/}
                        {/*    <i className="fa fa-thumbs-up"></i>*/}
                        {/*</a>*/}
                        {/*<a className="btn btn-sm btn-default btn-hover-danger" href="#">*/}
                        {/*    <i className="fa fa-thumbs-down"></i>*/}
                        {/*</a>*/}
                    </div>
                    {/*<a className="btn btn-sm btn-default btn-hover-primary pull-right" href="#">Comment</a>*/}

                    <a className={`badge badge-secondary ${classes.badge_outlined} pull-right`}
                       type="button"
                    >
                        <span >
                            Comment
                        </span>
                    </a>

                    <hr/>
                    {
                        replies.map(item => {
                            return item
                        })
                    }
                </div>


            </div>
        </div>
    );
};

export default CommentField;