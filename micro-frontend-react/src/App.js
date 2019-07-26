import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import axios from 'axios';

import './App.css';
import * as constants from'./Constants.js';
import * as environment from './Environment.js';

class App extends Component { 

  constructor() {
    super();

    this.state = {
      stepCodeName: '',
      currentProcess: {},
      currentStep: {},
      fieldStep: {},
      items: constants.ITEMS,
      socket: socketIOClient(environment.messenger)
    }

    const processId = window.location.search.split('=')[1];
    
    axios
      .get(`${environment.bff}/process/${processId}`)
      .then(response => {
        this.loadData(response.data);
        this.emitStepRendered(response.data.id);
        this.initOnkeydown();
      });
  }

  loadData(process) {
    const stepCodeName = 'time-experience';
    const currentProcess = process;
    const currentStep = process.steps.find(f => f.codeName === stepCodeName);
    const fieldStep = currentStep.fields.find(s => s.codeName === 'experience-code');
    this.setState({ stepCodeName, currentProcess, currentStep, fieldStep });
  }

  saveStep(process, step, { warnChange = false, moveNextStep = false }) {
    const url = `${environment.bff}/process/${process.id}/step/${step.codeName}`;
    axios
      .patch(url, step)
      .then(response => {
        const processUpdated = response.data;
        this.loadData(processUpdated);
        if (warnChange) this.emitUpdateProcess(processUpdated.id)
        if (moveNextStep) this.emitMoveStepper(processUpdated.id)
      });
  }

  emitStepRendered(processId) {
    const { stepCodeName } = this.state;
    const body = { processId, stepCodeName };
    const message = this.getMessage('step-rendered', body);
    this.sendMessage(message);
  }

  emitUpdateProcess(processId) {
    const body = { processId };
    const message = this.getMessage('update-process', body);
    this.sendMessage(message);
  }

  emitMoveStepper(processId) {
    const body = { processId };
    const message = this.getMessage('move-next-step', body);
    this.sendMessage(message);
  }

  sendMessage(message) {
    const { socket } = this.state;
    socket.emit('on-message', message);
  }

  getMessage(subject, body) {
    return {
      date: new Date(),
      app: 'micro-frontend-react',
      device: '',
      subject,
      from: '',
      body
    };
  }

  submit = () => {
    const { currentProcess, currentStep } = this.state;
    currentStep.lastUpdate = new Date();
    this.saveStep(currentProcess, currentStep, { warnChange: true, moveNextStep: true });
  } 

  selectItem = (e) => {
    const { fieldStep } = this.state;
    fieldStep.value = e.currentTarget.id;
    this.setState({ fieldStep });
  }  

  initOnkeydown() {
    document.onkeydown = (e) => {

      if (e.ctrlKey) { return; }

      const { fieldStep, items } = this.state;
      const indexItemSelected = this.getItemSelected();
      let newItemSelected;

      switch (e.key) {
        case 'Enter':
          if (!fieldStep.value) { return; }
          this.submit();
          break;
        case 'ArrowLeft':
          newItemSelected = items[indexItemSelected - 1];
          break;
        case 'ArrowRight':
          newItemSelected = items[indexItemSelected + 1];
          break;
        default:
          break;
      }

      if (!newItemSelected) { newItemSelected = items[indexItemSelected]; }
      if (indexItemSelected < 0) { newItemSelected = items[0]; }
      fieldStep.value = newItemSelected.code;
      this.setState({ fieldStep });
    };
  }

  getItemSelected() {
    const { fieldStep, items } = this.state;
    const itemSelected = items.find(x => x.code === fieldStep.value);
    return items.indexOf(itemSelected);
  }

  formatDate(value) {
    const date = new Date(value);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
  }

  render() {

    const { currentStep, fieldStep, items } = this.state;
   
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <h1>{currentStep.title}</h1>
            { currentStep.lastAcess ? <small>Última visualização: {this.formatDate(currentStep.lastAcess)}</small> : null }
            { currentStep.lastUpdate ? <small> | Última atualização: {this.formatDate(currentStep.lastUpdate)}</small> : null }
          </div>
        </div>
        <div className="row mt-4">
          { items.map(item => 
            <div key={item.code} className="col-4">
              <div className={`card ${fieldStep.value === item.code ? 'item-selected' : ''}`} id={item.code} onClick={this.selectItem}>
                <div className="wrapper-image">
                  <img className="card-img-top" src={item.image} alt={item.title} />
                </div>
                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>
                  <p className="card-text">{item.description}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="row my-5">
          <div className="col-12">
            <button type="button" className="btn btn-primary w-100" disabled={fieldStep.value === null} onClick={this.submit}>salvar</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
