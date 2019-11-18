import React from "react";
import { components } from "react-select";
import Select from "react-select";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import axios from "axios";

import "./App.css";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: null,
      data: [], //Initial 5 data
      dataSearch: [], //Initial 10 data
      modal: false,
      modalperson: null,
      modalidx: null
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    axios.get(`https://randomuser.me/api/?results=10`).then(res => {
      const data = res.data.results.filter((item, index) => index < 0);
      const dataSearch = res.data.results;
      this.setState({ data });
      this.setState({ dataSearch });
      console.log(this.state.data);
    });
  }

  delete = () => {
    this.state.data.splice(this.state.modalidx, 1);
    this.setState({ data: this.state.data });
    this.toggle();
  };

  toggledel(person, index) {
    this.setState({ modalperson: person });
    this.setState({ modalidx: index });
    this.setState({
      modal: !this.state.modal
    });
    console.log(this.state.modalperson);
    console.log(this.state.modalidx);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

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
        <div style={{ height: 40 }}>
          <img
            alt="optImg"
            style={{ height: 35 }}
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
            placeholder="Pilih personalia..."
            onChange={this.handleChange}
            components={{ Option: singleOption, SingleValue: singleValue }}
            value={selectedOption}
            options={options}
          />
        </div>
        <table className="maintable">
          {data.map((person, index) => {
            return (
              <tbody>
                <tr key={index}>
                  <td rowSpan="1">
                    <img src={person.picture.thumbnail} alt="profile pic." />
                    <h5 className="name">
                      {person.name.first} {person.name.last}{" "}
                    </h5>
                    <div className="bb">
                      <Button
                        color="primary"
                        // onClick={() => this.edit(person, index)}
                      >
                        edit
                      </Button>{" "}
                      <Button
                        color="danger"
                        //onClick={() => this.delete(person, index)}
                        onClick={() => this.toggledel(person, index)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
                <Modal
                  isOpen={this.state.modal}
                  toggle={this.toggle}
                  className={this.props.className}
                >
                  <ModalHeader toggle={this.toggle}>
                    Delete Personalia
                  </ModalHeader>
                  <ModalBody>Yakin ingin menghapus personalia ini?</ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick={() => this.delete()}>
                      Ya
                    </Button>{" "}
                    <Button color="secondary" onClick={this.toggle}>
                      Tidak
                    </Button>
                  </ModalFooter>
                </Modal>
              </tbody>
            );
          })}
        </table>
      </div>
    );
  }
}
