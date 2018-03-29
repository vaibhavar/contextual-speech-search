import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Snackbar from 'material-ui/Snackbar';
import AppBar from 'material-ui/AppBar';
import VoiceIcon from 'material-ui/svg-icons/action/settings-voice';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import CustomerSearch from './CustomerSearch';
import CustomerProfile from './CustomerProfile';
import OrderDetails from './OrderDetails';

var recognizeMic = require('watson-speech/speech-to-text/recognize-microphone');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      btnText: 'Start',
      listening: false,
      transcript: '',
      customerSearchActive: false,
      customerDetails: false,
      openLastOrder: false,
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
          name: 'Kelly',
          orders: [],
        },
      ],
    };

    this.onListenPress = this.onListenPress.bind(this);
    this.closeOrderDetails = this.closeOrderDetails.bind(this);

    this.keywords = new RegExp(/customer|profile|have a nice day|last order|reason/);
    this.reasons = new RegExp(/broken|wrong|late|other/);
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

  endCall() {
    // Reset state
    this.setState({
      listening: false,
      customer: '',
      customerSearchActive: false,
      openLastOrder: false,
      customerDetails: false,
    });
    // Stop stream
    this.stream.stop();
  }

  searchCustomer(sData) {
    const extractedCustomerId = this.convertToNumber(sData);
    // Customer id is expected to be 5 digits
    if (extractedCustomerId && extractedCustomerId.length === 5) {
      document.querySelector('strong#customerid').className = 'highlighted';
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

  listenForReason(sData) {
    console.log('reason');
    // Match the reason and auto-select in complaint form
    var aMatches = sData.match(this.reasons);
    if (aMatches && aMatches.length > 0) {
      this.setState({ complaintReason: aMatches[0] });
    }
  }

  doSearch(sData) {
    console.log(sData);
    const aMatches = sData.match(this.keywords);
    if (aMatches && aMatches.length > 0) {
      if (document.querySelector('strong.highlighted')) {
        document.querySelector('strong.highlighted').className = '';
      }
      const sMatch = aMatches[0];
      switch (sMatch) {
        case 'customer':
          // Only search if customer is not already present
          if (!this.state.customer) {
            document.querySelector('strong#customer').className = 'highlighted';
            this.searchCustomer(sData);
          }
          break;
        case 'have a nice day':
          document.querySelector('strong#niceday').className = 'highlighted';
          // Close the session
          this.endCall();
          break;
        case 'profile':
          document.querySelector('strong#profile').className = 'highlighted';
          // If we already have a customer selected
          if (this.state.customer) {
            this.setState({ customerSearchActive: false, customerDetails: true });
          }
          break;
        case 'last order':
          document.querySelector('strong#lastorder').className = 'highlighted';
          // Open details of last order
          this.setState({ customerDetails: false, openLastOrder: true });
          break;
        case 'reason':
          if (this.state.openLastOrder) {
            document.querySelector('strong#reason').className = 'highlighted';
            this.listenForReason(sData);
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

    fetch('/api/speech-to-text/token')
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
              let sData = data.alternatives[0].transcript;
              this.doSearch(sData);
              //console.log(data);
              this.setState({ text: sData });
              //if (data.final) {
              //  this.setState({ transcript: `${this.state.transcript} ${sData}` });
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

  closeOrderDetails() {
    this.setState({ openLastOrder: false });
  }

  render() {
    return (
      <MuiThemeProvider>
        <AppBar
          title="BayMax - the companion of support assistants"
          iconClassNameRight="muidocs-icon-navigation-expand-more"
        />
        <div className="App">
          <header className="App-header">
            {this.state.listening ? <div class="circle-ripple" /> : <span />}
            <div class="words">
              {' '}
              <span> {this.state.text} </span>
            </div>
          </header>
          <FloatingActionButton
            className="fab"
            label={this.state.btnText}
            onClick={this.onListenPress}
          >
            <VoiceIcon />
          </FloatingActionButton>

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

          <OrderDetails
            open={this.state.openLastOrder}
            onClose={this.closeOrderDetails}
            reason={this.state.complaintReason}
          />

          <span className="logo">
            <img src="https://rlv.zcache.com/baymax_waving_classic_round_sticker-r5e5fdb049089454bb138d73cbaa0c5ab_v9waf_8byvr_324.jpg" />
          </span>
          <br />
          <p className="instructions">
            Hi, I'm BayMax. I'll help you navigate through this application.<br />
            You can use keywords like <br />'<strong id="customer">customer</strong>', '<strong id="customerid">
              customer ID &lt;5 digit number&gt;
            </strong>, <strong id="profile">profile</strong>,{' '}
            <strong id="lastorder">last order</strong>,{' '}
            <strong id="reason">reason &lt;reason of complaint&gt; </strong>', '<strong id="niceday">
              have a nice day
            </strong>'
          </p>

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
