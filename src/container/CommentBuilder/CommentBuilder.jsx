import classes from './CommentBuilder.module.scss';
import { connect } from 'react-redux';
import Comment from '../Comment/Comment';
import uniqid from 'uniqid';
import PostComment from '../../component/PostComment/PostComment';
import { useEffect, useState } from 'react';
import { USERS } from '../../constants';

const CommentBuilder = ({ user, data, updateData, updateUser }) => {

    const [ sortedData, setSortedData] = useState(data);

    /**
     * Do sort on every render and page load
     */
    useEffect(() => {
        doSort();
        switchUser();
    }, [data]);

    /**
     * Updates localStorage and redux-store
     * @param {Object} data 
     */
    const updateStoreLocal = (data) => {
        updateData(data);
        window.localStorage.setItem('comments', JSON.stringify(data));
    }
    
    const addNewComment = (textVal, parentId) => {
        if (!textVal || !textVal.trim()) {
            console.log('Please enter something');
            return;
        }
        const comment = {
            id: uniqid(),
            createdTs: new Date(),
            updatedTs: null,
            text: textVal,
            userId: user.userId,
            userName: user.userName,
            likes: [],
            parent: parentId,
            avatar: user.avatar,
            children: []
        }

        //on first entry
        if(!data) {
            updateStoreLocal([comment]);
        } else {
            if (!parentId) {
                data.push(comment);
                updateStoreLocal(data);
            } else {
                data = data.map((el) => {
                    if (el.id === parentId) {
                        el.children.push(comment);
                    } 
                    else if(el.children.length > 0) {
                        let isPresent = false;
                        el.children = el.children.map((childEl) => {
                            if (childEl.id === parentId) {
                                isPresent = true;
                            }
                            return childEl;
                        })
                        if (isPresent) {
                            el.children.push(comment);
                        }
                    }
                    return el;
                });
                updateStoreLocal(data);
            }
        }
        document.getElementById("commentBox").value = '';
    }

    /**
     * 
     * @param {Number} id 
     */
    const removeComment = (id) => {
        data = data.filter(el => {
            if (el.id === id) {
                return false;
            } else if (el.children.length > 0) {
                el.children = el.children.filter(childEl => {
                    if (childEl.id === id) {
                        return false;
                    } else {
                        return true;
                    }
                })
            }
            return true;
        });
        updateStoreLocal(data);
    }

    const updateComment = (id, text) => {
        data = data.map(el => {
            if(el.id === id) {
                el.text = text;
                el.updatedTs = new Date();
            } else if (el.children.length > 0) {
                el.children.map(childEl => {
                    if (childEl.id === id) {
                        childEl.text = text;
                        el.updatedTs = new Date();
                    }
                    return childEl;
                })
            }
            return el;
        })
        updateStoreLocal(data);
    }

    const likeComment = (id, userId) => {
        data = data.map(el => {
            if(el.id === id) {
                if (el.likes.indexOf(userId) === -1){
                    el.likes.push(userId);
                } else {
                    el.likes = el.likes.filter(likeId => likeId !== userId);
                }
            } else if (el.children.length > 0) {
                el.children = el.children.map((childEl) => {
                    if (childEl.id === id) {
                        if (childEl.likes.indexOf(userId) === -1) {
                            childEl.likes.push(userId);
                        } else {
                            childEl.likes = childEl.likes.filter(likeId => likeId !== userId);
                        }
                    } 
                    return childEl;
                });
                updateStoreLocal(data);
            }
            return el;
        })
        updateStoreLocal(data);
    }

    /**
     * Does sort on the basis of date or number of likes
     */
    const doSort = () => {
        switch(document.getElementById("sortType").value) {
            case 'likes':
                if(data){
                    let temp = data;
                    temp.sort((a,b) => a.likes.length - b.likes.length);
                    setSortedData([...temp]);
                }
                break;
            case 'date':
                if (data) {
                    let temp = data;
                    temp.sort((a,b) => {
                        if (new Date(a.createdTs) < new Date(b.createdTs))
                            return -1
                        else {
                            return 1;
                        }
                    });
                    setSortedData([...temp]);
                }
                break;
        }
    };

    const switchUser = () => {
        const selectedUser = document.getElementById("selectUser").value;
        if (selectedUser) {
            let userData = USERS[selectedUser];
            updateUser(userData);
        }
    }

    return(
        <div className={classes["PostComment"]}>
            <div className={classes['userContainer']}>
                <label htmlFor="selectUser" style={{marginRight: 8}}>Current user:</label>

                <select name="selectUser" id="selectUser" onChange={switchUser}>
                    <option value="mrynalrai">Mrinal Rai</option>
                    <option value="cr7">Cristiano Ronaldo</option>
                    <option value="lm10">Lionel Messi</option>
                </select>
            </div>
            <PostComment user={user} addNewComment={addNewComment}/>      
            <div className={classes['dropdown_container']}>
                <label htmlFor="sortType" style={{marginRight: 8}}>Sort by:</label>
                <select name="sortType" id="sortType" onChange={doSort}>
                    <option value="date">date</option>
                    <option value="likes">likes</option>
                </select>
            </div>
            {sortedData &&  sortedData.map((comment, i) => {
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
      );
}

const mapStateTopProps = (state) => {
    return {
        user: state.user,
        data: state.data
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
      updateData: (data) => dispatch({type: 'dataUpdated', payload: data}),
      updateUser: (data) => dispatch({type: 'userUpdated', payload: data})
    }
  }

export default connect(mapStateTopProps, mapDispatchToProps)(CommentBuilder);
