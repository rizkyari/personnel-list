import React from "react";
import { components } from "react-select";
import Select from "react-select";
import axios from "axios";

import "./App.css";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: null,
      data: [], //Initial 5 data
      dataSearch: [] //Initial 10 data
    };
  }

  componentDidMount() {
    axios.get(`https://randomuser.me/api/?results=10`).then(res => {
      const data = res.data.results.filter((item, index) => index < 5);
      const dataSearch = res.data.results;
      this.setState({ data });
      this.setState({ dataSearch });
      console.log(this.state.data);
    });
  }

  delete = (item, idx) => {
    alert("delete " + item.name.first);
    this.state.data.splice(idx, 1);
    this.setState({ data: this.state.data });
  };

  handleChange = selectedOption => {
    this.setState({ selectedOption }, () => {
      const { data, selectedOption } = this.state;
      const isExist = data.some(entry => entry === selectedOption.entry);
      if (!isExist) {
        data.unshift(selectedOption.entry);
        this.setState({ data });
      }
    });
  };

  render() {
    const { selectedOption, data, dataSearch } = this.state;
    const { Option, SingleValue } = components;
    const options = dataSearch.map((entry, index) => ({
      value: index,
      label: entry.name.first + " " + entry.name.last,
      entry
    }));
    const singleOption = props => (
      <Option {...props}>
        <div
          style={{
            height: 40
          }}
        >
          <img
            alt="optImg"
            style={{
              height: 35
            }}
            src={props.data.entry.picture.thumbnail}
          />
          <div
            style={{
              padding: 5
            }}
          >
            {props.data.label}
          </div>
        </div>
      </Option>
    );
    const singleValue = props => (
      <SingleValue {...props}>
        <div
          style={{
            height: 40,
            width: 450
          }}
        >
          <img
            alt="selectImg"
            style={{
              height: 35
            }}
            src={props.data.entry.picture.thumbnail}
          />
          <div
            style={{
              padding: 5
            }}
          >
            {props.data.label}
          </div>
        </div>
      </SingleValue>
    );

    return (
      <div>
        <div className="search">
          <Select
            placeholder="Select the user ..."
            onChange={this.handleChange}
            components={{ Option: singleOption, SingleValue: singleValue }}
            value={selectedOption}
            options={options}
          />
        </div>
        <table>
          <tbody>
            {data.map((person, index) => {
              return (
                <tr key={index}>
                  <td rowSpan="1">
                    <img src={person.picture.thumbnail} alt="profile pic." />
                    <h5 className="name">{person.name.first} </h5>

                    <div className="bb">
                      <button onClick={() => this.edit(person, index)}>
                        edit
                      </button>{" "}
                      <button onClick={() => this.delete(person, index)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
