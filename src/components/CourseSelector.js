import React from 'react';
import ReactDOM from 'react-dom';
import AddCourse from './AddCourse';
import Courses from './Courses';

class CourseSelector extends React.Component {
  state = {
    courses: [], // array of course objects { name: '...', department: '...' }
  };

  componentDidMount() {

  }

  handleDeptDropdown = (event, data) => {
    // want to update selectedCourse state as well by calling handler from app root
    const dept = data.value;
    this.props.updateSelectedDept(dept);
    this.props.clearSelectedCourse();
  };

  handleDeleteCourses = () => {
    this.setState(() => ({ courses: [] }));
    this.props.clearSelectedCourse();
  };

  handleDeleteOneCourse = (course) => {
    this.setState((prevState) => ({
      courses: prevState.courses.filter((currCourseObj) => {
        return currCourseObj.name !== course
      })
    }));

    if (course === this.props.selectedCourse) {
      this.props.clearSelectedCourse();
    }
  };

  handleAddCourse = (course) => {
    const courses = this.state.courses;
    if (!course) {
      return "Select a valid course to add.";
    }

    // loop through array of objects, and check if course already exists
    for (let i = 0; i < courses.length; i++) {
      let currObject = courses[i];
      if (currObject.name === course) {
        return "This course already exists.";
      }
    }

    const courseObj = {
      name: course,
      department: this.props.selectedDepartment
    };

    this.setState((prevState) => ({
      courses: prevState.courses.concat(courseObj)
    }));
  };

  render() {
    return (
      <div>
        <AddCourse
          handleAddCourse={this.handleAddCourse}
          handleDeptDropdown={this.handleDeptDropdown}
          updateSelectedCourse={this.props.updateSelectedCourse}
          selectedDepartment={this.props.selectedDepartment}
        />
        {
          this.state.courses.length === 0 &&
          <p>Please add a course to get started.</p>
        }
        { this.state.error && <p>{this.state.error}</p> }
        <Courses
          courses={this.state.courses}
          handleDeleteCourses={this.handleDeleteCourses}
          handleDeleteOneCourse={this.handleDeleteOneCourse}
          updateSelectedCourse={this.props.updateSelectedCourse}
          updateSelectedDept={this.props.updateSelectedDept}
          selectedDepartment={this.props.selectedDepartment}
        />
        <button onClick={this.props.generateSchedules}>
          Generate Schedules
        </button>
      </div>
    );
  }
}

export default CourseSelector;
