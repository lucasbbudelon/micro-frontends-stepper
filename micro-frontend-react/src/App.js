import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import axios from 'axios';

import './App.css';

class App extends Component { 

  constructor() {
    super();
    this.state = {
      process: {},
      socket: {}
    }
  }

  componentDidMount() {
    axios.get(`https://localhost:44390/api/process/123`)
      .then(response => {
        const process = response.data;
        this.setState({ process });
      });

      const socket = socketIOClient('http://localhost:4444');
      this.setState({ socket });
  }

  render() {

    const { process, socket } = this.state;

    function handleBackClick(e) {
      e.preventDefault();
      socket.emit('on-back-step', process);
    }   

    function handleNextClick(e) {
      e.preventDefault();
      socket.emit('on-next-step', process);
    } 

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <h1>Dados Acadêmicos</h1>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-12">
            <ul>
              <li>Histórico ensino médio</li>
              <li>Histórico ensino fundamental</li>
              <li>Diploma curso técnico</li>
              <li>Diploma graduação</li>
              <li>Diploma Pós-Graduação</li>
              <li>Diploma Mestrado</li>
            </ul>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-md-2 col col-sm-6">
            <button type="button" className="btn btn-primary w-100" onClick={handleBackClick}>voltar</button>
          </div>
          <div className="col-md-2 col-sm-6">
            <button type="button" className="btn btn-primary w-100" onClick={handleNextClick}>próximo</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
