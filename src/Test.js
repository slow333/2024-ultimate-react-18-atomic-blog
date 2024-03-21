import React, {useState} from 'react';

function SlowComponents() {
  const els = Array.from({length: 100_000}, (v, i) => {
    return `word_${i}`
  })
  return (<div>
    <ul>
      {els.map(w => <li>{w}</li>)}
    </ul>
  </div>)
}

function Counter({children}) {
  const [c, setC] = useState(0);

  return (<div>
    <h1>Slow counter </h1>
    <button onClick={() => setC(c => c + 1)}>+Count {c}</button>
    {children}
  </div>);
}

const Test = () => {
  return <Counter>
    <SlowComponents/>
  </Counter>
}

export default Test;