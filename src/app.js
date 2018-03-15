import React from 'react';
import ReactDOM from 'react-dom';
import courseJSON from './../data/courses_sample_data.json'

class Template extends React.Component {
  state = {
    // default state values
    selectedDepartment: '',
    selectedCourse: '',
    jsonData: '',
  }

  componentDidMount() {
    //initialize data
    console.log("comp. mounted.  Want to get json data and store either locally (for development) or through an AJAX request (production).");
    const jsonData = courseJSON;
    const departments = Object.keys(jsonData);
    const courses = Object.keys(jsonData[departments[0]]);

    //const jsonObj = JSON.parse(courseJSON);
    console.log("JSON file: ");
    console.log(jsonData);
    //console.log(jsonObj);
    console.log("Printing out main keys from JSON file:");
    console.log(departments);
    console.log("printing out courses from Anthropology");
    console.log(courses);


    this.setState(() => ({ selectedDepartment: departments[0], selectedCourse: courses[0], jsonData: jsonData}));
    // print courses from Anthropology
  }

  handleDeptDropdown = (event) => {
    // want to update selectedCourse state as well
    const dept = event.target.value;
    const course = Object.keys(this.state.jsonData[dept])[0];
    this.setState(() => ({ selectedDepartment: dept, selectedCourse: course}));
  }

  handleCourseDropdown = (event) => {
    const course = event.target.value;
    this.setState(() => ({ selectedCourse: course }));
  }

  updateCourse

  handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted.  What to do with the data?");
    console.log("Want to add course to courses list.");
  }

  loadDepartmentOptions = () => {
    // don't map until jsonData is loaded.
    if (!this.state.jsonData) {
      return (
        <option>Loading...</option>
      );
    }
    return (
      Object.keys(this.state.jsonData).map((dept) => {
        return (
          <option key={dept} value={dept}>{dept}</option>
        );
      })
    )
  }

  loadCourseOptions = () => {
    // don't map until jsonData is loaded OR department is selected
    if (!this.state.jsonData || !this.state.selectedDepartment) {
      return (
        <option>Loading...</option>
      );
    }
    // update state to first option in department
    return (
      Object.keys(this.state.jsonData[`${this.state.selectedDepartment}`]).map((course) => {
        return (
          <option key={course} value={course}>{course}</option>
        );
      })
    );
  }

  render() {
    return (
      <div>
        <h1>Bobcat Courses</h1>
        <p>Selected Department: {this.state.selectedDepartment}</p>
        <p>Selected Course: {this.state.selectedCourse}</p>
        <form onSubmit={this.handleSubmit}>
          <select name="dept-dropdown" onChange={this.handleDeptDropdown}>
            {
              this.loadDepartmentOptions()
            }
          </select>
          <select name="course-dropdown" onChange={this.handleCourseDropdown}>
            {
              this.loadCourseOptions()
            }
          </select>
          <input type="submit" value="Add Course" />
        </form>
      </div>
    );
  }
}


ReactDOM.render(<Template />, document.getElementById('app'));
