import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CircuitBreaker from 'opossum';
import './App.css';

const options = {
  timeout: 2000,
  errorThresholdPercentage: 50,
  resetTimeout: 5000
};
const circuit = new CircuitBreaker(() => axios.get('http://localhost:4000/my-endpoint'), options);

const breakerEmoji = {
  closed: '💚',
  'half open': '💛',
  open: '❤️'
};

const requestEmoji = {
  pending: '⏳',
  success: '✅',
  error: '❌'
};

function App() {
  const [breakerState, setBreakerState] = useState('closed');
  const [requestState, setRequestState] = useState('success');
  const makeRequest = () => {
    setRequestState('pending')
    return circuit
      .fire()
      .then(() => setRequestState('success'))
      .catch(() => setRequestState('error'));
  };

  useEffect(() => {
    console.log(">>> useEffect");
    const eventLogger = eventName => [ eventName, (...args) => console.log('EVENT', eventName, ...args) ];
    circuit.on(...eventLogger('fire'));
    circuit.on(...eventLogger('reject'));
    circuit.on(...eventLogger('timeout'));
    circuit.on(...eventLogger('success'));
    circuit.on(...eventLogger('failure'));
    circuit.on('open', () => setBreakerState('open'));
    circuit.on('close', () => setBreakerState('closed'));
    circuit.on('halfOpen', () => setBreakerState('half open'));
    circuit.on(...eventLogger('fallback'));
    circuit.on(...eventLogger('semaphoreLocked'));
    circuit.on(...eventLogger('healthCheckFailed'));
  }, [setBreakerState])

  return (
    <div className="App">
        <h1>❓Want Cookies?</h1>
        <div>
          <button style={{ fontSize: '2em' }} type="button" onClick={makeRequest} disabled={requestState === 'pending'}>
            Get Cookies! 🍪
          </button>
          {requestEmoji[requestState]}
        </div>
        <hr />
        <div>
          Breaker is {breakerState} {breakerEmoji[breakerState]}
        </div>
    </div>
  );
}

export default App;
