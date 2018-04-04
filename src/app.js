import React from 'react';
import ReactDOM from 'react-dom';
import CourseDetail from './components/CourseDetail';
import CourseSelector from './components/CourseSelector';
import Header from './components/Header';
import Schedules from './components/Schedules';
import courseJSON from './../data/courses_sample_data.json';
import deptJSON from './../data/departments_FA18.json';
import { initialSectionsExtract } from './lib/ExtractSections';
import axios from 'axios';
import 'semantic-ui-css/semantic.min.css';
import './styles/styles.scss';

const BASE_URL = `https://cse120-course-planner.herokuapp.com/api/courses/course-match/`;

class AppRoot extends React.Component {
  state = {
    selectedDepartment: undefined,
    selectedCourse: undefined, // for course detail table
    sections: {}, // for algorithm, must be in same format as table row
    validSchedules: [], // for calendars
  };

  componentWillMount() {

    console.log("in the root app component, want to load DEPARTMENT data here.");

    //initialize data
    window.jsonData = courseJSON;
    const departments = Object.keys(window.jsonData);
    const courses = Object.keys(window.jsonData[departments[0]]);
    window.deptList = deptJSON;

    const courseData = window.jsonData[departments[0]][courses[0]];
    console.log("Course data:");
    console.log(courseData);

    //const jsonObj = JSON.parse(courseJSON);
    console.log("JSON file: ");
    console.log(window.jsonData);
    //console.log(jsonObj);
    console.log("Printing out main keys from JSON file:");
    console.log(departments);
    console.log("printing out courses from Anthropology");
    console.log(courses);

    //this.setState(() => ({ selectedDepartment: departments[0] }));
  }

  updateSelectedDept = (dept) => {
    this.setState(() => ({ selectedDepartment: dept }));
  };

  updateSelectedCourse = (course) => {
    this.setState(() => ({ selectedCourse: course }));
  };

  updateSectionCheckboxToggle = (sectionNumber) => {
    // format changed, so need to update to reflect that.
    // if MAIN component was unchecked, then we want to uncheck the rest of the sections in that particular section
    const course = this.state.selectedCourse;
    let sections = this.state.sections; // accessing object with key as sections mapping to array
    const sectionKeys = Object.keys(sections[course]);

    for (let i = 0; i < sectionKeys.length; i++) {
      let sectionIndex = sectionKeys[i];
      let sectionsList = sections[course][sectionIndex];
      console.log("sections list: ", sectionsList);
      for (let j = 0; j < sectionsList.length; j++) {
        let currSection = sectionsList[j];
        let checked = currSection['isSelected'];

        if (currSection['Section Number'] !== sectionNumber) {
          // go on to next iteration
          continue;
        }
        if (!currSection['isMainComponent']) {
          // toggle checked
          sections[course][sectionIndex][j]['isSelected'] = !checked;
        }
        else {
          // otherwise, this section is a main component, then flip boolean of linked sections
          // uncheck MAIN component and deselect as well as disable the other rows
          sections[course][sectionIndex][j]['isSelected'] = !checked;
          // deselect all other components and disable the rows
          for (let k = j+1; k < sectionsList.length; k++) {
            let rowDisabled = sectionsList[k]['isRowDisabled'];
            let selected = sectionsList[k]['isSelected'];
            sections[course][sectionIndex][k]['isRowDisabled'] = !rowDisabled;
            sections[course][sectionIndex][k]['isSelected'] = !selected;
          }
          // done, no need to check other ones
          break;
        }

      }
    }
    this.setState(() => ({ sections: sections }));

  };

  postRequestDataExtractor = (courseData) => {
    // return an object of sections like so: (NOTE: MAIN COMPONENT MUST GO FIRST)
    // {
    //   "1": [LECT, LAB, etc.],
    //   "2": [LECT, LAB, etc.]
    // }
    console.log("want to parse this data: ", courseData);
    let output = {};
    // first, initalize main components
    for (let i = 0; i < courseData.length; i++) {
      console.log("lecture crn: ", courseData[i]['lecture_crn']);
      if (courseData[i]['lecture_crn'] === null) {
        // initalize section array
        output[courseData[i]['crn']] = [];
        output[courseData[i]['crn']].push(courseData[i]);
      }
    }

    // loop again, this time, add disc/lab to proper lecture crn
    for (let j = 0; j < courseData.length; j++) {
      if (courseData[j]['lecture_crn'] !== null) {
        output[[courseData[j]['lecture_crn']]].push(courseData[j]);
      }
    }
    console.log("output after initialization: ", output);
    return output;
  }

  addCourseSections = (dept, course) => {
    //const courseData = window.jsonData[dept][course];
    /*
    sections: {
      "CSE-005": {
        "1": [LECT, LAB, LAB, LAB, etc.],
        "2": [LECT, LAB, LAB, LAB, etc.]
      },
      "ANTH-001": {
        "1": [LECT, DISC, DISC, DISC, etc.],
        "2": [LECT, DISC, DISC, DISC, etc.]
      }
    }
    */
    let sections = this.state.sections;

    const request = {
      course_list: [course],
      term: "201830" // fall semester
    };

    const client = axios.create({
      auth: {
        username: "admin",  //This could be your email
        password: "course-planner"
      },
      headers: {
        "Content-Type": "application/json"
      }
    });

    client.post(BASE_URL, request)
      .then(res => {
        const data = res.data[course];
        console.log("(POST) inside add course sections: ", data);
        let sectionsObj = this.postRequestDataExtractor(data);
        sections[course] = sectionsObj;
        console.log("SECTIONS: ", sections);
        this.setState(() => ({ sections: sections }));
      })
      .catch(error => {
        console.log("error: ", error);
      });
    //this.setState(() => ({ sections: sections }));
  };

  deleteCourseFromSections = (course) => {
    let selSections = this.state.sections;
    delete selSections[course];
    this.setState(() => ({ sections: selSections }));
  };

  deleteAllSections = () => {
    this.setState(() => ({ sections: {} }));
  };

  // add two more functions to clearSelectedCourse and clearSelectedDept
  clearSelectedDept = () => {
    this.setState(() => ({ selectedDepartment: undefined }));
  };

  clearSelectedCourse = () => {
    this.setState(() => ({ selectedCourse: undefined }));
  };

  generateSchedules = () => {
    // Should we build the graph here???
    // so the graph would be built here, and then used for the algorithm to find valid schedules.
    console.log("IN ROOT COMPONENT");
    console.log("Want to first check size of courses array.");
    console.log("Take courses, use courses array to get information from JSON, run algorithm.");
    console.log("Decide what data we want to use to run the algorithm.");
    console.log("Store result of algo in some sort of data structure, to be used by the Calendar component");
    this.clearSelectedCourse();
    this.setState(() => ({ validSchedules: 'test' }));
  };


  render() {
    // only render course detail if a course is selected
    // only render calendar component if valid schedules has size > 0
    // if generate schedules is ran, but there is a conflict, then
    // notify user and reset state
    const selectedDepartment = this.state.selectedDepartment;
    const selectedCourse = this.state.selectedCourse;
    const validSchedules = this.state.validSchedules;
    const sections = this.state.sections;
    const sectionKeys = Object.keys(sections);
    console.log("KEYS: ", sectionKeys);
    console.log("STATE: ", this.state);
    return (
      <div>
        <Header />
        {/* <p>Selected Department (in root comp.): {this.state.selectedDepartment}</p>
        <p>Selected Course (in root comp.): {this.state.selectedCourse}</p> */}
        <div className="main-container">
          <CourseSelector
            selectedDepartment={selectedDepartment}
            selectedCourse={selectedCourse}
            updateSelectedDept={this.updateSelectedDept}
            updateSelectedCourse={this.updateSelectedCourse}
            addCourseSections={this.addCourseSections}
            clearSelectedDept={this.clearSelectedDept}
            clearSelectedCourse={this.clearSelectedCourse}
            deleteCourseFromSections={this.deleteCourseFromSections}
            deleteAllSections={this.deleteAllSections}
            generateSchedules={this.generateSchedules}
          />
          {
            ((Object.keys(this.state.sections).length !== 0) && selectedCourse) &&
            <CourseDetail
              department={selectedDepartment}
              course={selectedCourse}
              sections={sections}
              updateSectionCheckboxToggle={this.updateSectionCheckboxToggle}
            />
          }
          { selectedCourse === undefined &&
            <div className="app-root__schedules-title-wrapper">
              <h3>Schedules</h3>
              {
                // don't render calendars unless both conditions inside () are true
                // note: selectedCourse must get reset to undefined when running
                // the algorithm
                 (validSchedules.length > 0 && selectedCourse === undefined) &&
                <Schedules
                  validSchedules={validSchedules}
                />
              }
            </div>
          }
          {/* footer component will go here */}
        </div>
      </div>
    );
  }
}



ReactDOM.render(<AppRoot />, document.getElementById('app'));
