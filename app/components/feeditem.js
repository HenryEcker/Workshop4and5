import React from 'react';
import StatusUpdate from './statusupdate';
import CommentThread from './commentthread';
import Comment from './comment';
import {postComment, likeFeedItem, unlikeFeedItem} from './../server';

export default class FeedItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = props.data;
    }

    handleCommentPost(commentText) {
        postComment(this.state._id, 4, commentText, (updatedFeedItem) => {
            this.setState(updatedFeedItem);
        });
    }

    handleLikeClick(clickEvent) {
        clickEvent.preventDefault();
        if (clickEvent.button === 0) {
            var callbackFunction = (updatedLikeCounter) => {
                this.setState({likeCounter: updatedLikeCounter});
            };
            if (this.didUserLike()) {
                unlikeFeedItem(this.state._id, 4, callbackFunction);
            } else {
                likeFeedItem(this.state._id, 4, callbackFunction);
            }
        }
    }
    didUserLike() {
        var likeCounter = this.state.likeCounter;
        var liked = false;
        for (var i = 0; i < likeCounter.length; i++) {
            if (likeCounter[i]._id === 4) {
                liked = true;
                break;
            }
        }
        return liked;
    }

    render() {
        var data = this.state;
        var contents;
        var likeButtonText = "Like";
        if (this.didUserLike()) {
            likeButtonText = "Unlike";
        }
        switch (data.type) {
            case "statusUpdate":
                contents = (
                    <StatusUpdate key={data._id} author={data.contents.author} postDate={data.contents.postDate} location={data.contents.location}>
                        {data.contents.contents.split("\n").map((line, i) => {
                            return (
                                <p key={"line" + i}>{line}</p>
                            );
                        })}
                    </StatusUpdate>
                );
                break;
            default:
                throw new Error("Unknown FeedItem: " + data.type);
        }
        return (
            <div className="fb-status-update panel panel-default">
                <div className="panel-body">
                    {contents}
                    <hr/>
                    <div className="row">
                        <div className="col-md-12">
                            <ul className="list-inline">
                                <li>
                                    <a href="#" onClick= { (e) => this.handleLikeClick(e) }>
                                        <span className="glyphicon glyphicon-thumbs-up"></span>
                                        {likeButtonText
}
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <span className="glyphicon glyphicon-comment"></span>
                                        Comment
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <span className="glyphicon glyphicon-share-alt"></span>
                                        Share</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="panel-footer">
                    <div className="row">
                        <div className="col-md-12">
                            <a href="#">{data.likeCounter.length + " people "}</a>
                            like this
                        </div>
                    </div>
                    <hr/>
                    <CommentThread onPost={(commentText) => this.handleCommentPost(commentText)}>
                        {data.comments.map((comment, i) => {
                            return (
                                <Comment key={i} author={comment.author} postDate={comment.postDate}>
                                    {comment.contents}
                                </Comment>
                            );
                        })}
                    </CommentThread>
                </div >
            </div>
        )
    }
}
