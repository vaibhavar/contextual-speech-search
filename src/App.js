import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Snackbar from 'material-ui/Snackbar';
import AppBar from 'material-ui/AppBar';
import VoiceIcon from 'material-ui/svg-icons/action/settings-voice';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import Transcript from './Transcript';
import CustomerSearch from './CustomerSearch';
import CustomerProfile from './CustomerProfile';

var recognizeMic = require('watson-speech/speech-to-text/recognize-microphone');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      btnText: 'Start',
      listening: false,
      transcript: [],
      customerSearchActive: false,
      customerDetails: false,
      customers: [
        {
          id: '00001',
          name: 'William Mraz',
          orders: [],
        },
        {
          id: '00002',
          name: 'Elon Musk',
          orders: [],
        },
        {
          id: '00003',
          name: 'John Doe',
          orders: [],
        },
        {
          id: '00004',
          name: 'Andrew Simmons',
          orders: [],
        },
        {
          id: '12345',
          name: 'Vaibhav Arora',
          orders: [],
        },
        {
          id: '54321',
          name: 'Sanchit',
          orders: [],
        },
      ],
    };

    this.onListenPress = this.onListenPress.bind(this);
    this.keywords = new RegExp(/customer|profile|past orders|thank you/);
    this.numbers = new RegExp(/one|two|three|four|five|six|seven|eight|nine|ten/g);
    this.numbersToNum = {
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
      seven: 7,
      eight: 8,
      nine: 9,
      zero: 0,
      o: 0,
    };
  }

  convertToNumber(sData) {
    var aNumbers = sData.match(this.numbers);
    if (aNumbers && aNumbers.length > 0) {
      return aNumbers
        .map(
          function(oNumber) {
            return this.numbersToNum[oNumber];
          }.bind(this)
        )
        .join('');
    }
  }

  searchCustomer(sData) {
    const extractedCustomerId = this.convertToNumber(sData);
    // Customer id is expected to be 5 digits
    if (extractedCustomerId && extractedCustomerId.length === 5) {
      this.setState({
        show: 'Searching for Customer with ID = ' + extractedCustomerId,
        openStatusBar: true,
        type: 'success',
        customer: extractedCustomerId,
      });
    } else {
      this.setState({
        show: 'Waiting for customer ID',
        openStatusBar: true,
        type: 'waiting',
        customerSearchActive: true,
      });
    }
  }

  doSearch(sData) {
    const aMatches = sData.match(this.keywords);
    if (aMatches && aMatches.length > 0) {
      const sMatch = aMatches[0];
      switch (sMatch) {
        case 'customer':
          // Only search if customer is not already present
          if (!this.state.customer) {
            this.searchCustomer(sData);
          }
          break;
        case 'past orders':
          this.setState({ show: 'Loading past orders', openStatusBar: true });
          break;
        case 'thank you':
          break;
        case 'profile':
          // If we already have a customer selected
          if (this.state.customer) {
            this.setState({ customerDetails: true });
          }
          break;
      }
    }
  }

  onListenPress() {
    if (this.state.listening) {
      this.stream.stop();
      this.setState({ listening: false, btnText: 'Start' });
      return false;
    }

    this.setState({
      listening: true,
      btnText: 'Stop',
    });

    fetch('https://localhost:3001/api/speech-to-text/token')
      .then(function(response) {
        return response.text();
      })
      .then(
        function(token) {
          this.stream = recognizeMic({
            token: token,

            objectMode: false, // send objects instead of text
            extractResults: true, // convert {results: [{alternatives:[...]}], result_index: 0} to {alternatives: [...], index: 0}
            format: false, // optional - performs basic formatting on the results such as capitals an periods
          });
          this.stream.on(
            'data',
            function(data) {
              //if (data.final) {
              let sData = data.alternatives[0].transcript;
              this.doSearch(sData);
              //console.log(data);
              this.setState({ text: sData });
              //var aTranscript = this.state.transcript;
              //aTranscript.push({ message: sData });
              //this.setState({ transcript: aTranscript });
              //}
            }.bind(this)
          );
          this.stream.on('error', function(err) {
            console.log(err);
          });
        }.bind(this)
      )
      .catch(function(error) {
        console.log(error);
      });
  }

  getCustomer(sId) {
    return this.state.customers.filter(oCustomer => oCustomer.id === sId)[0];
  }

  render() {
    return (
      <MuiThemeProvider>
        <AppBar
          title="BayMax - your personal assistant"
          iconClassNameRight="muidocs-icon-navigation-expand-more"
        />
        <div className="App">
          <header className="App-header">
            {this.state.listening ? <div class="circle-ripple" /> : <span />}
          </header>
          <FloatingActionButton
            className="fab"
            label={this.state.btnText}
            onClick={this.onListenPress}
          >
            <VoiceIcon />
          </FloatingActionButton>
          <div>{this.state.text}</div>

          {/* <Transcript messages={this.state.transcript} />*/}

          <CustomerSearch
            open={this.state.customerSearchActive}
            customers={this.state.customers}
            customerId={this.state.customer}
          />

          <CustomerProfile
            open={this.state.customerDetails}
            customer={this.getCustomer(this.state.customer)}
            customerId={this.state.customer}
          />

          <Snackbar
            open={this.state.openStatusBar}
            autoHideDuration={4000}
            message={this.state.show}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
