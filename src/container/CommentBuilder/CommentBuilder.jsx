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
    
    const addNewComment = () => {
        let textEl = document.getElementById("commentBox").value;
        if (!textEl || !textEl.trim()) {
            console.log('Please enter something');
            return;
        }
        const comment = {
            id: uniqid(),
            createdTs: new Date(),
            updatedTs: null,
            text: textEl,
            userId: user.userId,
            userName: user.userName,
            likes: 0,
            parent: null,
            avatar: user.avatar,
            children: []
        }

        if(!data) {
            updateStoreLocal([comment]);
        } else {
            data.push(comment);
            updateStoreLocal(data);
        }
        document.getElementById("commentBox").value = '';
    }

    /**
     * 
     * @param {Number} id 
     */
    const removeComment = (id) => {
        data = data.filter(el => el.id !== id);
        updateStoreLocal(data);
    }

    const updateComment = (id, text) => {
        data = data.map(el => {
            if(el.id === id) {
                el.text = text;
                el.updatedTs = new Date();
            }
            return el;
        })
        updateStoreLocal(data);
    }

    const likeComment = (id) => {
        data = data.map(el => {
            if(el.id === id) {
                el.likes++;
            }
            return el;
        })
        updateStoreLocal(data);
    }

    //TODO: Implement reply comment
    const replyComment = (id, text) => {
        
    }

    /**
     * Does sort on the basis of date or number of likes
     */
    const doSort = () => {
        switch(document.getElementById("sortType").value) {
            case 'likes':
                if(data){
                    let temp = data;
                    temp.sort((a,b) => a.likes - b.likes);
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
                return(
                    <Comment 
                      key={i} 
                      data={comment}
                      removeComment ={removeComment} 
                      updateComment ={updateComment}
                      likeComment ={likeComment}
                      replyComment ={replyComment}
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
