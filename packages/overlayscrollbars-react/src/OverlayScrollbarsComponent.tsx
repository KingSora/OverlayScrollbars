export interface OverlayScrollbarsComponentProps {
  element?: string;
  options?: {};
  events?: {};
}

export const OverlayScrollbarsComponent = (props: OverlayScrollbarsComponentProps) => {
  const { msg } = props;
  return (
    <div className="App">
      <header className="App-header">
        <p>{msg}</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
};
