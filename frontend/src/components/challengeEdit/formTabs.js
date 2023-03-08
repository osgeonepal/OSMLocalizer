export const FormTabs = (props) => {
  const checkSelected = (optionSelected) => {
    let liClass = "nav-link text-secondary";
    if (props.option === optionSelected) {
      liClass = "nav-link active bg-secondary text-light";
    }
    return liClass;
  };

  const elements = [
    { value: "Description", required: true },
    // { value: "Features", required: true },
    { value: "Translation" },
  ];

  return (
    <div>
      <ul className="nav flex-column">
        {elements.map((elm, n) => (
          <li
            className="nav-item "
            key={n}
            onClick={() => props.setOption(elm.value)}
          >
            <p className={checkSelected(elm.value)}>
              {elm.value}
              {elm.required && " *"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};
