import { useState } from 'react';
import classes from './Comment.module.scss';
import { fetchUserImage, timeSince } from '../../util';
import { ReactComponent as Like} from '../../assets/images/like-button.svg';
import { connect } from 'react-redux';

const Comment = ({ data, children, updateComment, likeComment, removeComment, user }) => {

    const [isEdit, setIsEdit] = useState(false);
    const [newText, setNewText] = useState('');

    let showTime;

    if (data.createdTs) {
        showTime = timeSince(new Date(data.createdTs));
    }

    const edit = () => {
        setIsEdit(true);
        setNewText(children);
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
                                <Like className={classes['like']} onClick={()=>likeComment(data.id)}/>
                                <span style={{marginRight: 16}}>{data.likes}</span>
                                <div className={classes['edit']} onClick={edit}>
                                    Edit
                                </div>
                                {
                                    data.userId === user.userId ?
                                    <div className={classes['edit']} onClick={()=>removeComment(data.id)}>
                                        Delete
                                    </div>
                                    :null
                                }
                            </div>
                        </> :
                            <div className="commentContainer">
                            <div className="commentText">
                                <textarea 
                                value={newText}
                                onChange={handleChange}
                                style={{width: '100%'}}
                                >
                                </textarea>
                            </div>
                            <button onClick={save}>
                                <span>Save</span>
                            </button>
                        </div> 
                    }
                </div>
            </div>
        </>
    )
}

const mapStateTopProps = (state) => {
    return {
        user: state.user
    }
}

export default connect(mapStateTopProps, null)(Comment);