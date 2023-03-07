import React from "react";

export const Input = (props) => {
  return (
    <div className="p-2 pb-4">
      <label className="form-label text-secondary fw-bold">{props.label}</label>
      <input
        className="form-control rounded-0"
        name={props.name}
        type={props.type}
        placeholder={props.placeholder}
        defaultValue={props.defaultValue}
        onChange={(e) => props.onChange(e)}
      />
    </div>
  );
};

export const TextArea = (props) => {
  return (
    <div className="p-2 pb-4">
      <label className="form-label fw-bold text-secondary">{props.label}</label>
      <textarea
        className="form-control rounded-0"
        name={props.name}
        type={props.type}
        placeholder={props.placeholder}
        defaultValue={props.defaultValue}
        onChange={(e) => props.onChange(e)}
        rows={props.rows}
      />
    </div>
  );
};

export const Select = (props) => {
  return (
    <div className="p-2 pb-4">
      <label className="form-label fw-bold text-secondary">{props.label}</label>
      <select
        className="form-select"
        name={props.name}
        onChange={(e) => props.onChange(e)}
        value={props.value}
      >
        {props.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export const Checkbox = (props) => {
  const options = props.options.map((option) => {
    return (
      <div className="form-check btn-group" key={option.value}>
        <input
          className="btn-check"
          type="radio"
          name={props.name}
          value={option.value}
          id={option.value}
          checked={props.value === option.value}
          onChange={(e) => props.onChange(e)}
        />
        <label htmlFor={option.value} className="btn btn-sm btn-outline-dark">
          {option.label}
        </label>
      </div>
    );
  });
  return (
    <div className="p-2 pb-4">
      <label className="form-label fw-bold text-secondary">{props.label}</label>
      {options}
    </div>
  );
};
