import React from 'react';
import ReactDOM from 'react-dom';

class CourseDetail extends React.Component {
  render() {
    return (
      <div>
        <h1>Sections table goes in this component</h1>
        <h1>Course of interest: {this.props.course}</h1>
      </div>
    );
  }
}


export default CourseDetail;
