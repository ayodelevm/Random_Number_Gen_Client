import React from 'react';
import http from './utils'
import './App.css';

// function App() {
//   return (
//     <div className="App">

//     </div>
//   );
// }

// export default App;

export default class App extends React.Component {

  state = {
    error: '',
    filenames: [],
    numberToGenerate: '',
    filename: '',
    phoneNumbers: [],
    selected: '',
    numberToLoopBy: 0,
    loading: false,
  }

  componentDidMount() {
    this.setState({
      loading: true,
    });
    http.get('/read/filenames')
    .then((response) => {
      const data = response.data.allFilenames;
      this.setState({
        filenames: data,
        loading: false,
      });
    });
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  }

  generatePhonenumbers = () => {
    const payload = {
      numberToGenerate: this.state.numberToGenerate,
    };
    let storeData = {};

    this.setState({
      loading: true,
    });

    http.post('/generate', payload)
    .then((response) => {
      const data = response.data;
      return data;
    })
    .then((data) => {
      storeData = data;
      return http.get('/read/filenames');
    })
    .then((response) => {
      const data = response.data.allFilenames;
      const { phoneNumbers, filename } = storeData;
      const numberToLoopBy = phoneNumbers.length % 4 !== 0 ? ((phoneNumbers.length + 1) / 4) : phoneNumbers.length / 4;

      this.setState({
        filenames: data,
        phoneNumbers,
        filename,
        numberToLoopBy,
        numberToGenerate: '',
        loading: false,
      });
    })
    .catch((error) => {
      this.setState({
        error: error.response.data.errors.numberToGenerate,
        loading: false,
      });
    });
  }

  fetchSelectedFileContent = () => {
    const payload = {
      filename: this.state.filename,
    };
    if (this.state.filename === 'Select a filename') {
      return;
    }

    this.setState({
      loading: true,
    });

    http.post('/read/file', payload)
    .then((response) => {
      const { phoneNumbers, filename } = response.data;
      const numberToLoopBy = phoneNumbers.length % 4 !== 0 ? ((phoneNumbers.length + 1) / 4) : phoneNumbers.length / 4;
      this.loading = false;
      this.setState({
        phoneNumbers,
        filename,
        numberToLoopBy,
        loading: false,
      });
    });
  }

  render() {
    const newPhoneNumbers = this.state.phoneNumbers && [...this.state.phoneNumbers];
    const total = newPhoneNumbers.length;
    const sortedNumbers = newPhoneNumbers.sort((a, b) => b.localeCompare(a))
    const max = sortedNumbers[0];
    const min = sortedNumbers.slice(-1).pop();
    return (
      <div className='background-container'>
        {this.state.loading && <div className="lds-hourglass"></div>}
        <div className="left-sub_container">
          <div className="left-sub_container__top">
            <h1>How many numbers do you want to generate?</h1>
            <div className="form">
              <input className="field" name="numberToGenerate" value={this.state.numberToGenerate} type="text" onChange={this.handleChange} placeholder="number to generate"/>
              <button onClick={this.generatePhonenumbers} className="submit" type="submit" value="">Send</button>		
            </div>
            {this.state.error && <div className="error"><div>{this.state.error}</div></div>}
          </div>
          <div className="left-sub_container__bottom">
            <h1>Select a file from below to get generated phone numbers</h1>
            <div className="form">
            <select name="filename" onChange={this.handleChange} value={this.state.filename} className="field">
              <option>Select a filename</option>
              {this.state.filenames.map((filename, i) => (<option key={i}>{filename}</option>))}
            </select>
              <button onClick={this.fetchSelectedFileContent} className="submit_2" type="submit" value="">Send</button>		
            </div>
          </div>
        </div>
        <div className="right-sub_container">
          {newPhoneNumbers.length ? <div><span>Total: {total}</span> <span>Max: {max}</span> <span>Min: {min}</span></div> : null}
          <div className="page">
            {
              [...new Array(Math.ceil(this.state.numberToLoopBy))].map((acc, i) => {
                const row = newPhoneNumbers.splice(0, 4);
                return (
                  <div key={i} className="collection">
                    <div className="collection-items">
                      <div>{row[0]}</div>
                      <div>{row[1]}</div>
                      <div>{row[2]}</div>
                      <div>{row[3]}</div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    );
  }
}
