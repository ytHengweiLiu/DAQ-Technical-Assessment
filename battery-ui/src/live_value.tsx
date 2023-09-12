import React from 'react';
import './App.css';

interface TemperatureProps {
  temp: number;
}

function LiveValue({ temp } : TemperatureProps) {

  let valueColour = 'white';

  if (temp < 0) {
    valueColour = 'darkblue'
  } else if (temp < 20) {
    valueColour = 'blue'
  } else if (temp < 40) {
    valueColour = 'lightblue'
  } else if (temp < 60) {
    valueColour = 'green'
  } else if (temp < 80) {
    valueColour = 'yellow'
  } else if (temp <= 100) {
    valueColour = 'orange'
  } else if (temp > 100) {
    valueColour = 'red'
  }

  return (
      <header className="live-value" style={{ color : valueColour }}>
        {`${temp.toString()}°C`}
      </header>
  );
}

export default LiveValue;