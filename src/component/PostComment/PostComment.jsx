import React from 'react';
import classes from './PostComment.module.scss';
import { fetchUserImage } from '../../util';

/**
 * Render text area for user to enter comment
 * @param {props data} param0 
 */
function PostComment({user, addNewComment}) {
    return (
        <>
        <div className={classes["PostComment_container"]}>
            <div>
                <img src={fetchUserImage(user.avatar)} className={classes["PostComment_container--img"]}/>
            </div>
            <div className={classes["PostComment_container--box"]}>
                <textarea id="commentBox" placeholder="Join the discussion..."></textarea> 
            </div>
        </div>
        <div className={classes['buttonCOntainer']}>
            <button onClick={addNewComment}> Post</button>  
        </div>
        </>
    );
}

export default PostComment;