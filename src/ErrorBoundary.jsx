import React from 'react';
export default class ErrorBoundary extends React.Component {
  constructor(props){ super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error){ return { error }; }
  componentDidCatch(error, info){ console.error('UI crash:', error, info); }
  render(){
    if(this.state.error){
      return <div style={{padding:16,fontFamily:'Georgia'}}>
        <h2>Something went wrong</h2>
        <pre style={{whiteSpace:'pre-wrap'}}>{String(this.state.error)}</pre>
      </div>;
    }
    return this.props.children;
  }
}
