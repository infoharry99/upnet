import React from "react";
import styled from "styled-components";

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  height: 300px;
`;

const SliderWrapper = styled.div`
  position: relative;
  height: 100%;
  margin: 0 10px;
`;

const StyledInput = styled.input`
  writing-mode: bt-lr; /* IE */
  -webkit-appearance: slider-vertical; /* WebKit */
  appearance: slider-vertical;
  width: 8px;
  height: 100%;
  background: #e5e5e5;
  border-radius: 4px;
  outline: none;
  opacity: 0.7;
  transition: opacity 0.2s;
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    background: #f47c20;
    cursor: pointer;
    border-radius: 50%;
  }
  &::-moz-range-thumb {
    width: 25px;
    height: 25px;
    background: #f47c20;
    cursor: pointer;
    border-radius: 50%;
  }
`;

const ValueLabel = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  background-color: #f47c20;
  border-radius: 3px;
  padding: 2px 5px;
  font-size: 14px;
`;

const Slider = ({ value, onChange, max, label }) => {
  return (
    <SliderWrapper>
      <ValueLabel style={{ bottom: `${(value / max) * 100}%` }}>
        {label}
      </ValueLabel>
      <StyledInput
        type="range"
        min="0"
        max={max}
        value={value}
        onChange={onChange}
        style={{ writingMode: "bt-lr" }}
      />
    </SliderWrapper>
  );
};
