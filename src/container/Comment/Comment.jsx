import { useState, useEffect } from 'react';
import classes from './Comment.module.scss';
import { fetchUserImage, timeSince } from '../../util';
import { ReactComponent as Like} from '../../assets/images/like-button.svg';
import PostComment from '../../component/PostComment/PostComment';

const Comment = ({ data, children, updateComment, likeComment, removeComment, user, isLiked, addNewComment }) => {

    const [isEdit, setIsEdit] = useState(false);
    const [isReply, setIsReply] = useState(false);
    const [newText, setNewText] = useState('');

    let showTime;

    if (data.createdTs) {
        showTime = timeSince(new Date(data.createdTs));
    }

    const addComment = (txt) => {
        setIsReply(false);
        addNewComment(txt, data.id);
    }
    const edit = () => {
        setIsEdit(true);
        setNewText(children);
    };
    const reply = () => {
        setIsReply(true);
    };
    const handleChange = (e) => {
        setNewText(e.target.value);
    }
    const save=() => {
        updateComment(data.id, newText);
        setIsEdit(false);
    }

    return (
        <>
            <div className={classes['commentContainer']}>
                <div className={classes['imgContainer']}>
                    <img src={fetchUserImage(data.avatar)}/>
                </div>
                <div className={classes['sideContainer']}>
                    <div className={classes['textContainer']}>
                        <div className={classes['header']}>
                            <div className={classes['userName']}>{data.userName}</div>
                            <div className={classes['time']}>{showTime}</div>
                        </div>
                        {
                            !isEdit ?
                            <>
                                <div className={classes['text']}>
                                    {data.text}
                                </div>
                                <div className={classes['actions']}>
                                    <Like id='likeButton' style={{fill: isLiked ? 'cornflowerblue' : 'black'}} className={classes['like']} onClick={()=>likeComment(data.id, user.userId)}/>
                                    <span style={{marginRight: 16}}>{data.likes.length}</span>
                                    {
                                        data.userId === user.userId ?
                                        <div className={classes['edit']} onClick={edit}>
                                            Edit
                                        </div>
                                        :null
                                    }
                                    {
                                        data.userId === user.userId ?
                                        <div className={classes['edit']} onClick={()=>removeComment(data.id)}>
                                            Delete
                                        </div>
                                        :null
                                    }
                                    <div className={classes['edit']} onClick={reply}>
                                        Reply
                                    </div>
                                </div>
                            </> :
                                <div className={classes["commentContainer"]}>
                                <div className={classes["commentText"]}>
                                    <textarea 
                                    value={newText}
                                    onChange={handleChange}
                                    >
                                    </textarea>
                                </div>
                                <button onClick={save}>
                                    <span>Save</span>
                                </button>
                            </div> 
                        }
                    </div>
                    {
                        isReply ?
                        <PostComment user={user} addNewComment={addComment} />
                        : null
                    }
                    {
                        data.children.length > 0 && data.children.map((comment, i) => {
                            let isLiked;
                            if(comment.likes && comment.likes.indexOf(user.userId) === -1 ){
                                isLiked = false;
                            } else {
                                isLiked = true;
                            }
                            return(
                                <Comment 
                                  key={i} 
                                  data={comment}
                                  isLiked={isLiked}
                                  removeComment ={removeComment} 
                                  updateComment ={updateComment}
                                  likeComment ={likeComment}
                                  addNewComment={addNewComment}
                                  user={user}
                                  >{comment.text}</Comment>
                               );   
                        })}
                </div>
            </div>
        </>
    )
}

export default Comment;