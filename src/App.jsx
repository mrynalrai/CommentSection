import classes from './App.module.css';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import CommentBuilder from './container/CommentBuilder/CommentBuilder';
import Layout from './hoc/Layout/Layout';

function App({updateData}) {

  useEffect(() => {
    let data = window.localStorage.getItem('comments');
    if (data) {
      data = JSON.parse(data);
      updateData(data);
    }
  }, [updateData])

  return (
    <div className={classes["App"]}>
      <Layout>
      <CommentBuilder />
      </Layout>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateData: (data) => dispatch({type: 'dataUpdated', payload: data})
  }
}
export default connect(null, mapDispatchToProps)(App);
